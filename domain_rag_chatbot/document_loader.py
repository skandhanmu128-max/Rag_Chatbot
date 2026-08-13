import io
from pypdf import PdfReader
from langchain_core.documents import Document
from typing import List

def process_pdf(uploaded_files) -> List[Document]:
    """
    Read uploaded PDF files in bytes, extract text per page,
    and return a list of LangChain Document objects with metadata.
    """
    documents = []
    
    for file in uploaded_files:
        try:
            # streamlit uploaded file behaves like a file object
            pdf_reader = PdfReader(file)
            for page_num, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                if text and text.strip():
                    doc = Document(
                        page_content=text,
                        metadata={
                            "source": file.name,
                            "page": page_num + 1
                        }
                    )
                    documents.append(doc)
        except Exception as e:
            # Handle empty or un-readable PDFs gracefully
            print(f"Warning: Could not process {file.name}. Error: {e}")
            
    return documents
