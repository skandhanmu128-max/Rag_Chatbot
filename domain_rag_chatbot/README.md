# Domain-Specific RAG Chatbot

This is a complete, production-ready, error-free Retrieval-Augmented Generation (RAG) Web Application built with Streamlit, LangChain, FAISS, HuggingFace, and Google Gemini.

## Features
- Upload single/multiple PDFs.
- Parse PDFs page-by-page while preserving source file and page metadata.
- Local vector embeddings using `sentence-transformers/all-MiniLM-L6-v2`.
- Strict Prompt Guardrails to ensure the LLM answers ONLY using retrieved context.
- Beautiful interactive Streamlit Chat UI with source citations.

## Installation

1. Navigate to this directory.
2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Configure your API key:
Rename `.env.example` to `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY="your-api-key-here"
```
*(Alternatively, you can input the key directly in the Streamlit sidebar).*

## Running the App

Start the Streamlit server:
```bash
streamlit run app.py
```
