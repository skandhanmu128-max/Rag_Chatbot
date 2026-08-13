"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Loader2 } from "lucide-react";
import axios from "axios";

export default function DocumentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus("idle");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadStatus("success");
      setUploadMessage(`Indexed ${response.data.chunks_processed} chunks successfully.`);
      setFile(null);
    } catch (error: any) {
      setUploadStatus("error");
      setUploadMessage(error.response?.data?.detail || "Upload failed. Please ensure the backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 p-8 flex-col items-center">
      <header className="mb-8 text-center mt-12">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Knowledge</h1>
        <p className="text-slate-400">Ingest PDFs into the FAISS vector database for RAG retrieval.</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-xl text-center">
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 mb-6 hover:bg-slate-800/50 transition">
          <UploadCloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-white mb-2">Drag & drop your PDF</h3>
          <p className="text-sm text-slate-400 mb-6">or click to browse from your computer</p>
          
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="hidden" 
            id="file-upload" 
          />
          <label htmlFor="file-upload" className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg text-sm font-medium transition border border-slate-700">
            Select PDF
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700 text-left">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="text-sm font-medium">{file.name}</div>
            </div>
            <div className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-4 rounded-lg mb-6 text-sm">
            <CheckCircle className="w-4 h-4" /> {uploadMessage}
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg mb-6 text-sm">
            <AlertTriangle className="w-4 h-4" /> {uploadMessage}
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          {isUploading ? <><Loader2 className="w-4 h-4 animate-spin"/> Processing & Embedding...</> : "Ingest Document"}
        </button>
      </div>
    </div>
  );
}
