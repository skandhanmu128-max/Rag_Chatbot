from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.rag.vector_store import vector_store
import os

# Initialize Gemini LLM if key is available
if settings.GEMINI_API_KEY:
    os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
    llm = ChatGoogleGenerativeAI(model=settings.GEMINI_MODEL, temperature=0.1)
else:
    llm = None

class RAGAgent:
    @staticmethod
    async def ask_question(query: str):
        if not llm:
            return {
                "answer": "Gemini API Key is not configured. Cannot generate response.",
                "evidence": []
            }

        # 1. Retrieve evidence
        retrieved_docs = vector_store.search(query, top_k=5)
        
        if not retrieved_docs:
             return {
                "answer": "I could not find sufficient evidence in the uploaded documents to answer this reliably.",
                "evidence": []
            }

        # 2. Format context for prompt
        context_parts = []
        for i, doc in enumerate(retrieved_docs):
            context_parts.append(f"[Evidence {i+1}] (Doc {doc['document_id']}, Page {doc['page_number']}): {doc['text']}")
        context_str = "\n\n".join(context_parts)

        # 3. Construct prompt with strict grounding instructions
        prompt = f"""You are DocuMind AI, an expert document intelligence assistant.
Answer the user's question based ONLY on the provided evidence. 
If the evidence does not contain the answer, say "I could not find sufficient evidence in the uploaded documents to answer this reliably."
Do not hallucinate external information.
Include citations in your answer using the Evidence numbers, e.g., [Evidence 1].

EVIDENCE:
{context_str}

USER QUESTION:
{query}

ANSWER:
"""

        # 4. Generate response
        try:
            response = llm.invoke(prompt)
            answer_content = response.content
            
            # Format evidence for frontend consumption
            evidence_payload = [
                {
                    "document_id": doc["document_id"],
                    "page_number": doc["page_number"],
                    "text": doc["text"],
                    "score": doc["score"]
                } for doc in retrieved_docs
            ]
            
            return {
                "answer": answer_content,
                "evidence": evidence_payload
            }
        except Exception as e:
            return {
                "answer": f"An error occurred while generating the response: {str(e)}",
                "evidence": []
            }
