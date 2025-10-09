# Repo RAG AI Assistant

This project is a **Repository Retrieval-Augmented Generation (RAG) system**. It allows you to:

* Scan GitHub repositories
* Embed all textual content (any programming language, documentation, or config files) into Pinecone
* Query the repository using natural language
* Get structured, human-readable explanations powered by Google Gemini AI
* Interact through a simple **HTML frontend**

---

## 🚀 Features

* **Scan Repos**: Automatically fetch all files from a repo and embed them for semantic search
* **Query Repos**: Ask questions about the repo and get context-aware answers
* **Supports all file types**: Python, JavaScript, TypeScript, HTML, CSS, JSON, Markdown, YAML, etc.
* **Modular Structure**: Clean separation of routes, services, and utils
* **Persistent Storage**: Track last scanned commits in Firestore to avoid unnecessary rescans
* **FastAPI + Pinecone + Google GenAI** integration
* **Frontend Interface**: Easy-to-use web interface (`index.html`)

---

## 📂 Project Structure

```
RepoRAG_Structured/
├─ main.py                # FastAPI app entry point
├─ config.py              # API keys and environment variables
├─ routes/
│  ├─ scan.py             # Scan GitHub repo and upsert to Pinecone
│  ├─ query.py            # Query repo using natural language
├─ services/
│  ├─ github_service.py   # GitHub API helpers
│  ├─ pinecone_service.py # Pinecone client wrapper
│  ├─ firestore_service.py# Firestore helpers
│  ├─ embedding_service.py# SentenceTransformer embeddings
├─ models/
│  └─ request_models.py   # Pydantic request models
├─ utils/
│  └─ text_utils.py       # Text chunking & namespace helpers
├─ frontend/
│  └─ index.html          # Simple web UI for scanning & querying
├─ .env                   # Environment variables
├─ README.md
└─ requirements.txt
```

---

## ⚙️ Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/RepoRAG_Structured.git
cd RepoRAG_Structured
```

2. Create a virtual environment and activate:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with:

```env
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_google_genai_api_key
FIRESTORE_CREDENTIALS=path/to/your/service_account.json
```

---

## ⚡ Running the App

```bash
uvicorn main:app --reload
```

* Open `http://127.0.0.1:8000/docs` for Swagger UI
* Open `frontend/index.html` in a browser for the **web interface**

---

## 📝 Frontend Usage

The **HTML frontend** allows you to:

1. **Scan a Repository**

* Paste the GitHub repo URL
* Click **Scan Repo**
* View scanning status, last commit, number of files scanned, and vectors upserted

2. **Ask a Question**

* Enter a question about the repo
* Click **Query Repo**
* View the AI-generated answer with Markdown formatting and syntax-highlighted code

> The frontend communicates with the backend API running on `http://127.0.0.1:8000` (change `API_BASE` in `index.html` if deployed elsewhere).

---

## 🛠 Tech Stack

* **FastAPI** – Python web framework
* **Pinecone** – Vector database for embeddings
* **Google GenAI (Gemini)** – LLM for answering repo questions
* **Firestore** – Stores last scanned commit per repo
* **SentenceTransformer** – Generates embeddings for repo files
* **Frontend** – HTML/JS with Marked.js and Highlight.js

---

