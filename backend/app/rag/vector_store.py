import os
import faiss
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.config import settings

class VectorStore:
    def __init__(self, index_path="documind_index.faiss", meta_path="documind_meta.json"):
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.index_path = index_path
        self.meta_path = meta_path
        self.dimension = self.model.get_sentence_embedding_dimension()
        
        # Load or create FAISS index and metadata
        if os.path.exists(self.index_path) and os.path.exists(self.meta_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.meta_path, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = []

    def add_chunks(self, chunks: list):
        """
        Embeds chunks and adds them to FAISS and metadata store.
        chunks: list of dicts {"text": str, "metadata": dict}
        """
        if not chunks:
            return
            
        texts = [c["text"] for c in chunks]
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        
        # Normalize for cosine similarity (optional, FlatL2 is Euclidean but works OK for demo, 
        # or use IndexFlatIP for Cosine if normalized)
        faiss.normalize_L2(embeddings)
        
        self.index.add(embeddings)
        
        # Append metadata
        for chunk in chunks:
            self.metadata.append({
                "text": chunk["text"],
                "document_id": chunk["metadata"]["document_id"],
                "page_number": chunk["metadata"]["page_number"]
            })
            
        # Save to disk
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, 'w') as f:
            json.dump(self.metadata, f)

    def search(self, query: str, top_k: int = 5):
        """
        Embeds query and searches FAISS.
        Returns top_k chunks with metadata.
        """
        if self.index.ntotal == 0:
            return []
            
        query_emb = self.model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_emb)
        
        distances, indices = self.index.search(query_emb, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append({
                    "text": self.metadata[idx]["text"],
                    "document_id": self.metadata[idx]["document_id"],
                    "page_number": self.metadata[idx]["page_number"],
                    "score": float(distances[0][i])
                })
        return results

# Singleton instance
vector_store = VectorStore()
