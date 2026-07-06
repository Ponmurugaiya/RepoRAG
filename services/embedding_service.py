import json
import boto3
from config import BEDROCK_REGION

# Bedrock client — reused across Lambda invocations (module-level init)
_bedrock = boto3.client("bedrock-runtime", region_name=BEDROCK_REGION)

# Model produces 1024-dim vectors by default, but supports 256 / 512 / 1024.
# We use 384 to match the existing Pinecone index (all-MiniLM-L6-v2 dimension).
_MODEL_ID = "amazon.titan-embed-text-v2:0"
_DIMENSIONS = 384


def embed_text(text: str) -> list:
    """
    Embed a single string using Amazon Titan Text Embeddings V2.
    Returns a list of floats with length _DIMENSIONS (384).
    Drop-in replacement for the previous SentenceTransformer call.
    """
    body = json.dumps({
        "inputText": text,
        "dimensions": _DIMENSIONS,
        "normalize": True,       # unit-normalise for cosine similarity
    })

    response = _bedrock.invoke_model(
        modelId=_MODEL_ID,
        body=body,
        contentType="application/json",
        accept="application/json",
    )

    result = json.loads(response["body"].read())
    return result["embedding"]
