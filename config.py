import os
from dotenv import load_dotenv

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# AWS
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
DYNAMO_TABLE_NAME = os.getenv("DYNAMO_TABLE_NAME", "RepoRAGRepos")

INDEX_NAME = "repo-rag-index"
