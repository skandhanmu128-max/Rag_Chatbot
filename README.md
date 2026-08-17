# Domain-Specific RAG Chatbot Platform 🚀

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://ragchatbot-pn5um3cnysbas2me7dsfty.streamlit.app/)
**An enterprise-grade, end-to-end Retrieval-Augmented Generation (RAG) platform. Features dynamic Google Gemini LLM routing, FAISS vector embeddings, secure PDF chunking, and multimodal capabilities including Voice-to-Text and Text-to-Voice. Built with a responsive Next.js/Streamlit UI and a robust FastAPI backend for seamless document querying.**

---

## 📂 Project Structure

This repository contains three main components:

1. **/frontend** (Next.js)
   - A beautifully designed React frontend using Next.js.
   - Built to be deployed seamlessly on **Vercel**.
2. **/backend** (FastAPI)
   - The core Python API for advanced multi-agent interactions and database management.
3. **/domain_rag_chatbot** (Streamlit)
   - A standalone, fully-featured RAG chatbot interface.
   - Includes PDF document ingestion, FAISS vectorization, and **Multimodal Voice support** (Microphone Speech-to-Text & AI Text-to-Voice).
   - Features dynamic auto-discovery of valid Gemini API endpoints to guarantee 100% uptime.

---

## ⚡ Deployment Instructions

### Deploying the Frontend (Vercel)
1. Fork or push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **CRITICAL:** Set the **Root Directory** to `frontend`.
5. Click **Deploy**. Vercel will automatically build the Next.js app and provide a live public URL.

### Running the Streamlit Chatbot Locally
Navigate to the Streamlit project directory:
```bash
cd domain_rag_chatbot
```
Install the required dependencies:
```bash
pip install -r requirements.txt
```
Run the application:
```bash
streamlit run app.py
```

### Running the FastAPI Backend Locally
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies and run the server:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🔐 Environment Variables
You will need a `.env` file in the root of the backend or streamlit applications with your Google Gemini API key:
```env
GEMINI_API_KEY="your_google_api_key_here"
```

