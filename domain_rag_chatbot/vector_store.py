import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def create_vector_store(documents):
    """
    Chunk documents and build a FAISS vector database.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=350,
        chunk_overlap=50
    )
    chunks = text_splitter.split_documents(documents)
    
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    
    vector_store = FAISS.from_documents(chunks, embeddings)
    return vector_store, chunks

def save_vector_store(db, path):
    """
    Save the FAISS vector store locally.
    """
    if not os.path.exists(path):
        os.makedirs(path)
    db.save_local(path)

def load_vector_store(path):
    """
    Load the FAISS vector store from local path safely.
    """
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    # allow_dangerous_deserialization=True is required for local trust loading in newer langchain
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)
