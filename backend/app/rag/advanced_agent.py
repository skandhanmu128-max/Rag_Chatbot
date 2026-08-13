from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.rag.vector_store import vector_store
import os

if settings.GEMINI_API_KEY:
    os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
    llm = ChatGoogleGenerativeAI(model=settings.GEMINI_MODEL, temperature=0.2)
else:
    llm = None

class AdvancedAgent:
    @staticmethod
    async def compare_documents(topic: str):
        if not llm: return {"error": "LLM not configured"}
        
        # In a real app we'd filter by document IDs, but for this demo we'll just search the whole FAISS store for the topic
        docs = vector_store.search(topic, top_k=6)
        context = "\n".join([f"Doc {d['document_id']}: {d['text']}" for d in docs])
        
        prompt = f"""You are an AI Policy Analyst. Compare the information across the provided documents regarding: '{topic}'.
Identify what is common, what has changed, and any conflicting information.
Format the output nicely.

EVIDENCE:
{context}
"""
        response = llm.invoke(prompt)
        return {"comparison": response.content}

    @staticmethod
    async def generate_study_material(topic: str, mode: str):
        if not llm: return {"error": "LLM not configured"}
        
        docs = vector_store.search(topic, top_k=4)
        context = "\n".join([d['text'] for d in docs])
        
        if mode == "viva":
            prompt = f"Generate 5 tough Viva (oral exam) questions and answers based on this text:\n\n{context}"
        elif mode == "cheatsheet":
            prompt = f"Create a highly condensed 1-page Cheat Sheet with bullet points and key formulas/facts from this text:\n\n{context}"
        elif mode == "podcast":
            prompt = f"Convert this academic text into a fun, engaging 2-person podcast script explaining the concepts simply:\n\n{context}"
        else:
            prompt = f"Summarize this:\n\n{context}"
            
        response = llm.invoke(prompt)
        return {"result": response.content}

    @staticmethod
    async def extract_knowledge_graph(topic: str):
        if not llm: return {"error": "LLM not configured"}
        
        docs = vector_store.search(topic, top_k=3)
        context = "\n".join([d['text'] for d in docs])
        
        prompt = f"""Extract a knowledge graph from this text. 
Return ONLY a valid JSON object with two keys: 'nodes' (list of dicts with 'id' and 'label') and 'links' (list of dicts with 'source', 'target', and 'label').
Make it simple, max 10 nodes.

TEXT:
{context}
"""
        response = llm.invoke(prompt)
        content = response.content
        # Strip markdown json block if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        import json
        try:
            return json.loads(content)
        except:
            return {"nodes": [{"id": "Error", "label": "Parse Error"}], "links": []}
