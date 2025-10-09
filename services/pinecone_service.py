from pinecone import Pinecone, ServerlessSpec
from config import PINECONE_API_KEY, INDEX_NAME

pc = Pinecone(api_key=PINECONE_API_KEY)
spec = ServerlessSpec(cloud="aws", region="us-east-1")

if not pc.has_index(INDEX_NAME):
    pc.create_index(name=INDEX_NAME, dimension=384, metric="cosine", spec=spec)

index = pc.Index(INDEX_NAME)

def safe_upsert(vectors, namespace: str):
    if vectors:
        index.upsert(vectors, namespace=namespace)
        print(f"[PINECONE] Upserted {len(vectors)} vectors into namespace '{namespace}'")
    else:
        print(f"[PINECONE] No vectors to upsert for namespace '{namespace}'")

def safe_delete(namespace: str):
    try:
        index.delete(deleteAll=True, namespace=namespace)
        print(f"[PINECONE] Deleted namespace '{namespace}'")
    except Exception:
        print(f"[PINECONE] Namespace '{namespace}' not found, nothing to delete")
