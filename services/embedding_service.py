from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_text(text: str) -> list:
    return embed_model.encode(text).tolist()
