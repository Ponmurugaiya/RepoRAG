from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import scan, query

app = FastAPI(title="Repo RAG AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)
app.include_router(query.router)

@app.get("/")
def root():
    return {"message": "Repo RAG Backend is running 🚀"}
