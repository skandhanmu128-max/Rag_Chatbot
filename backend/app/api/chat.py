from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.agent import RAGAgent

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/")
async def chat_with_docs(request: ChatRequest):
    response = await RAGAgent.ask_question(request.query)
    return response
