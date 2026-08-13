from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.advanced_agent import AdvancedAgent

router = APIRouter()

class TopicRequest(BaseModel):
    topic: str

class StudyRequest(BaseModel):
    topic: str
    mode: str

@router.post("/compare")
async def compare_docs(request: TopicRequest):
    return await AdvancedAgent.compare_documents(request.topic)

@router.post("/study")
async def generate_study(request: StudyRequest):
    return await AdvancedAgent.generate_study_material(request.topic, request.mode)

@router.post("/knowledge-graph")
async def get_kg(request: TopicRequest):
    return await AdvancedAgent.extract_knowledge_graph(request.topic)
