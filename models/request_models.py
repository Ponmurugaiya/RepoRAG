from pydantic import BaseModel

class ScanRequest(BaseModel):
    repo_url: str

class QueryRequest(BaseModel):
    repo_url: str
    question: str
