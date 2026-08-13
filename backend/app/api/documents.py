from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import Document, DocumentPage
from app.rag.ingestion import PDFParser
from app.rag.vector_store import vector_store
import shutil
import os

router = APIRouter()
pdf_parser = PDFParser()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create document record
    new_doc = Document(filename=file.filename, file_path=file_path, health_score=100)
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    
    try:
        # Parse and chunk PDF
        chunks = pdf_parser.parse_pdf(file_path, new_doc.id)
        
        # Add to FAISS vector store
        if chunks:
            vector_store.add_chunks(chunks)
            
        return {"message": "Document uploaded and indexed successfully", "document_id": new_doc.id, "chunks_processed": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.get("/")
async def list_documents(db: AsyncSession = Depends(get_db)):
    # Simple endpoint to list docs (requires select implementation, simplified for now)
    return {"message": "Document list endpoint"}
