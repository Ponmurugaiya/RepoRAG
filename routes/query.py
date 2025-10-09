from fastapi import APIRouter
from models.request_models import QueryRequest
from services import github_service, pinecone_service, embedding_service
from utils.text_utils import sanitize_name
import google.genai as genai
from config import GEMINI_API_KEY

router = APIRouter(prefix="/query", tags=["Query"])

@router.post("")
def query_repo(req: QueryRequest):
    try:
        repo_id, full_name, branch = github_service.get_repo_id(req.repo_url)
        namespace = sanitize_name(str(repo_id))

        q_vec = embedding_service.embed_text(req.question)
        query_response = pinecone_service.index.query(
            vector=q_vec,
            top_k=3,
            include_metadata=True,
            namespace=namespace
        )

        matches = query_response.get("matches", [])
        if not matches:
            return {
                "question": req.question,
                "answer_markdown": "No context found for this repo. Make sure it has been scanned first.",
                "repo_url": req.repo_url,
                "top_chunks_used": 0
            }

        context = "\n\n".join([m["metadata"]["text"] for m in matches])

        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
You are a helpful assistant named "RepoRAG AI - helps you understand complex repositories easily" that explains code repositories.
Use the following context from the repo to answer clearly and in a structured way.
Format your response with sections and Markdown formatting for readability.

Context:
{context}

Question:
{req.question}

Please include but only when necessary:
1. A short summary (2–3 lines)
2. A detailed explanation
3. Code snippets (in ```python``` or appropriate syntax)

If the question is a greeting or unrelated, politely refuse and say you can only answer questions about the repository context above.
"""

        response = client.models.generate_content(model="gemini-2.5-flash", contents=[prompt])
        answer = getattr(response, "text", "No answer generated.")

        return {
            "question": req.question,
            "answer_markdown": answer,
            "repo_url": req.repo_url,
            "top_chunks_used": len(matches),
        }

    except Exception as e:
        return {"error": str(e)}
