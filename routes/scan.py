from fastapi import APIRouter
from models.request_models import ScanRequest
from services import github_service, pinecone_service, dynamodb_service, embedding_service
from utils.text_utils import sanitize_name, chunk_text
import time

router = APIRouter(prefix="/scan", tags=["Scan"])

@router.post("")
def scan_repo(req: ScanRequest):
    try:
        # ------------------ Repo Metadata ------------------
        repo_id, full_name, branch = github_service.get_repo_id(req.repo_url)
        namespace = sanitize_name(str(repo_id))
        print(f"[SCAN] Scanning repo: {full_name}, branch: {branch}, namespace: {namespace}")

        # ------------------ DynamoDB Check ------------------
        item = dynamodb_service.get_repo_item(repo_id)
        last_commit = item.get("last_commit") if item else None
        new_commit = github_service.get_commit_sha(full_name, branch)

        if last_commit == new_commit:
            print("[SCAN] Repo already scanned. No changes detected.")
            return {"status": "already_scanned", "namespace": namespace, "last_commit": new_commit}

        # ------------------ Fetch Repo Files ------------------
        all_files = github_service.fetch_all_files(full_name)
        print(f"[SCAN] Total files fetched: {len(all_files)}")

        # ------------------ Create Vectors ------------------
        vectors = []
        for f in all_files:
            for i, chunk in enumerate(chunk_text(f["content"])):
                vectors.append({
                    "id": f"{f['path']}-{i}",
                    "values": embedding_service.embed_text(chunk),
                    "metadata": {"text": chunk, "file": f["path"]}
                })
        print(f"[SCAN] Total vectors to upsert: {len(vectors)}")

        # ------------------ Delete Old Namespace ------------------
        pinecone_service.safe_delete(namespace)

        # ------------------ Upsert Vectors ------------------
        if vectors:
            pinecone_service.safe_upsert(vectors, namespace)
            # Small delay to ensure namespace is available for query
            time.sleep(1)
        else:
            print("[SCAN] Warning: No vectors to upsert. Repo may be empty or file types not supported.")

        # ------------------ Update DynamoDB ------------------
        dynamodb_service.update_repo_commit(repo_id, full_name, new_commit)
        print(f"[SCAN] DynamoDB updated with commit {new_commit}")

        return {
            "status": "scanned",
            "namespace": namespace,
            "last_commit": new_commit,
            "files_scanned": len(all_files),
            "vectors_upserted": len(vectors)
        }

    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": str(e)}
