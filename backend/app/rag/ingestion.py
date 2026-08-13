import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

class PDFParser:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def parse_pdf(self, file_path: str, document_id: str):
        """
        Parses a PDF, extracting text page by page, and chunks it.
        Returns a list of chunks with metadata (page number, doc id).
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"PDF not found at {file_path}")

        reader = PdfReader(file_path)
        chunks = []
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                page_chunks = self.text_splitter.split_text(text)
                for chunk in page_chunks:
                    chunks.append({
                        "text": chunk,
                        "metadata": {
                            "document_id": document_id,
                            "page_number": i + 1,
                        }
                    })
        return chunks
