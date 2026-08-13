import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt import SYSTEM_PROMPT

load_dotenv()

def get_active_gemini_model(api_key: str) -> str:
    """
    Dynamically queries Google API to find an active model 
    that supports content generation to prevent 404 NOT_FOUND errors.
    """
    genai.configure(api_key=api_key)
    
    # Priority list of preferred stable models
    preferred_models = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro-002"
    ]
    
    try:
        # Fetch models supported by your API key
        available_models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                # Strip the "models/" prefix if present
                model_name = m.name.replace("models/", "")
                available_models.append(model_name)
        
        # Check priority models first
        for model in preferred_models:
            if model in available_models:
                return model
        
        # Fallback to the first valid text generation model found
        if available_models:
            return available_models[0]
            
    except Exception as e:
        print(f"Warning: Model auto-discovery failed ({e}). Falling back to 'gemini-1.5-flash'.")
    
    return "gemini-1.5-flash"

def answer_query(vector_store, query: str, api_key: str = None) -> dict:
    """
    Retrieves top chunks from FAISS and queries the automatically selected Gemini model.
    """
    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not resolved_api_key:
        raise ValueError("Gemini API key is missing. Please provide it in .env or the UI sidebar.")
    
    # Auto-detect a valid active model name
    model_name = get_active_gemini_model(resolved_api_key)
    
    # Initialize LangChain model
    llm = ChatGoogleGenerativeAI(
        model=model_name,
        google_api_key=resolved_api_key,
        temperature=0.1
    )
    
    # 1. Retrieve top 4 context chunks
    docs = vector_store.similarity_search(query, k=4)
    
    if not docs:
        return {
            "answer": "I could not find this information in the uploaded documents.",
            "sources": []
        }
    
    # 2. Extract context text and page metadata
    context_text = "\n\n".join([doc.page_content for doc in docs])
    
    # 3. Format strict prompt
    formatted_prompt = SYSTEM_PROMPT.format(context=context_text, question=query)
    
    # 4. Generate answer
    response = llm.invoke(formatted_prompt)
    
    # Formatting sources back to standard dict for app.py
    sources = [
        {"source": doc.metadata.get("source", "Unknown"), "page": doc.metadata.get("page", "?")}
        for doc in docs
    ]
    
    # Deduplicate sources preserving order
    unique_sources = []
    for s in sources:
        if s not in unique_sources:
            unique_sources.append(s)
            
    return {
        "answer": response.content,
        "sources": unique_sources,
        "model_used": model_name
    }
