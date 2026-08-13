from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import documents, chat, advanced
from app.core.config import settings

app = FastAPI(
    title="DocuMind AI API",
    description="Backend API for Domain-Specific RAG Chatbot",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(advanced.router, prefix="/api/advanced", tags=["Advanced RAG"])

@app.get("/")
async def root():
    return {"message": "Welcome to DocuMind AI API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
