from pinecone import Pinecone
from config import PINECONE_API_KEY

# Pinecone client — reused across Lambda invocations
pc = Pinecone(api_key=PINECONE_API_KEY)

# Use Pinecone's inference API for embeddings — no Bedrock/external model needed.
# llama-text-embed-v2 supports flexible dimensions; we use 384 to match the index.
_MODEL = "llama-text-embed-v2"
_DIMENSIONS = 384


def embed_text(text: str) -> list:
    """
    Embed a single string using Pinecone's llama-text-embed-v2 model.
    Returns a list of floats with length _DIMENSIONS (384).
    """
    response = pc.inference.embed(
        model=_MODEL,
        inputs=[text],
        parameters={"input_type": "passage", "truncate": "END", "dimension": _DIMENSIONS},
    )
    return response[0].values
