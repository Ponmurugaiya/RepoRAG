import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from routes import scan, query

app = FastAPI(title="Repo RAG AI Assistant")

# In Lambda the FRONTEND_ORIGIN env var should be your CloudFront / Amplify URL.
# Locally it falls back to localhost so dev still works without changes.
_allowed_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(scan.router)
app.include_router(query.router)

@app.get("/")
def root():
    return {"message": "Repo RAG Backend is running 🚀"}

# ── Lambda entry point ──────────────────────────────────────────────────────
# API Gateway HTTP API includes the stage name in the path (/prod/scan).
# api_gateway_base_path strips "/prod" so FastAPI sees "/scan" correctly.
handler = Mangum(app, lifespan="off", api_gateway_base_path="/prod")
