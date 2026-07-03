# ⚖️ LegalAid — AI Legal Aid Assistant

> RAG-based legal document analysis platform powered by Claude API. Upload legal documents and get instant AI-driven analysis, clause extraction, risk identification, and plain-language explanations.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Claude API](https://img.shields.io/badge/Claude%20API-Anthropic-orange?style=flat-square)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector%20Store-blueviolet?style=flat-square)
![Flask](https://img.shields.io/badge/Flask-Backend-black?style=flat-square&logo=flask)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)

---

## 📌 Overview

LegalAid is a Retrieval-Augmented Generation (RAG) system designed to make legal documents accessible. Users upload contracts, agreements, or legal filings, and the system chunks, embeds, and stores them in ChromaDB. Queries are answered by retrieving relevant passages and passing them to Claude API for grounded, accurate responses — reducing hallucination and improving document fidelity.

Built as a hackathon project (also known as AI Legal Aid Assistant).

---

## 🧠 RAG Architecture

```
User Uploads Document (PDF / TXT)
        │
        ▼
  Document Chunking
  (Sliding window, ~500 tokens)
        │
        ▼
  Embedding Generation
  (Sentence Transformers / Claude Embeddings)
        │
        ▼
  ChromaDB Vector Store
  (Persistent local collection)
        │
        │   ← User Query
        ▼
  Similarity Search
  (Top-K relevant chunks retrieved)
        │
        ▼
  Prompt Construction
  [System] + [Retrieved Context] + [User Query]
        │
        ▼
  Claude API
  (claude-3-haiku / claude-3-sonnet)
        │
        ▼
  Grounded Legal Response
        │
        ▼
  React Frontend Display
```

---

## 🗂️ Project Structure

```
LegalAid/
├── backend/
│   ├── app.py                      # Flask entry point
│   ├── rag_pipeline.py             # Document ingestion + retrieval pipeline
│   ├── claude_client.py            # Anthropic API wrapper
│   ├── embedder.py                 # Embedding generation
│   ├── chunker.py                  # Document chunking logic
│   └── document_parser.py         # PDF/TXT extraction
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── UploadPanel.jsx     # Document upload UI
│   │   │   ├── ChatInterface.jsx   # Q&A chat window
│   │   │   ├── ClauseViewer.jsx    # Clause extraction display
│   │   │   └── RiskPanel.jsx       # Risk flag highlights
│   │   └── index.jsx
│   └── package.json
├── chroma_db/                      # Persistent ChromaDB storage (auto-created)
├── uploads/                        # Temporary uploaded docs
├── .env
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/LUNAR/LegalAid.git
cd LegalAid
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

**Key Python dependencies:**

```
flask
flask-cors
anthropic
chromadb
sentence-transformers
PyMuPDF                  # PDF parsing
langchain                # Optional: chunking utilities
numpy
python-dotenv
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLAUDE_MODEL=claude-3-haiku-20240307
CHROMA_PERSIST_DIR=./chroma_db
UPLOAD_DIR=./uploads
CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RESULTS=5
```

---

## 🚀 Running LegalAid

### Start Backend

```bash
cd backend
python app.py
```

Backend runs at `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm start
```

Frontend runs at `http://localhost:3000`

---

## 🔬 RAG Pipeline — Detailed

### 1. Document Ingestion

```
POST /api/upload
  → Extract text (PyMuPDF for PDFs, direct read for TXT)
  → Chunk into ~500-token windows with 50-token overlap
  → Generate embeddings (sentence-transformers/all-MiniLM-L6-v2)
  → Store chunks + embeddings in ChromaDB collection
  → Return document_id for future queries
```

### 2. Query & Retrieval

```
POST /api/query
  → Embed the user query
  → ChromaDB cosine similarity search → Top-K chunks
  → Construct prompt:
      [System: You are a legal assistant...]
      [Context: {retrieved_chunks}]
      [User: {question}]
  → Send to Claude API
  → Stream response back to frontend
```

### 3. Clause Extraction

```
POST /api/extract-clauses
  → Retrieve full document from ChromaDB
  → Send structured prompt to Claude:
      "Extract and categorize all key clauses..."
  → Return structured JSON of clause types + text
```

---

## 📡 API Reference

### `POST /api/upload`

Upload a legal document for indexing.

**Request (multipart/form-data):**
```
file: <pdf or txt>
```

**Response:**
```json
{
  "document_id": "doc_abc123",
  "filename": "contract.pdf",
  "chunks_stored": 42,
  "status": "indexed"
}
```

### `POST /api/query`

Ask a question about an indexed document.

**Request:**
```json
{
  "document_id": "doc_abc123",
  "question": "What are the termination clauses in this contract?",
  "stream": true
}
```

### `POST /api/extract-clauses`

Extract and categorize all key clauses.

**Response:**
```json
{
  "clauses": [
    {
      "type": "Termination",
      "text": "Either party may terminate with 30 days written notice...",
      "risk_level": "medium"
    }
  ]
}
```

### `POST /api/risk-scan`

Identify potentially risky clauses.

**Response:**
```json
{
  "risks": [
    {
      "severity": "high",
      "clause": "Non-compete extends to all worldwide markets for 5 years.",
      "explanation": "Unusually broad geographic and temporal scope."
    }
  ]
}
```

---

## 🎯 Key Features

- **Grounded answers** — responses are always anchored to retrieved document text, not hallucinated
- **Source attribution** — each answer cites the specific document chunk it drew from
- **Risk flagging** — Claude scans for unusual, one-sided, or potentially harmful clauses
- **Plain-language mode** — complex legal language is translated into plain English on request
- **Multi-document support** — upload and query multiple documents independently

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| LLM | Claude API (Anthropic) |
| Vector Store | ChromaDB (local persistent) |
| Embeddings | sentence-transformers |
| Document Parsing | PyMuPDF |
| Backend | Flask + Flask-CORS |
| Frontend | React |
| RAG Orchestration | Custom pipeline (+ optional LangChain) |

---

## ⚠️ Disclaimer

LegalAid is an AI-assisted research tool. It does **not** constitute legal advice. Always consult a qualified legal professional for binding legal decisions.

---

## 📄 License

MIT License. See `LICENSE` for details.
