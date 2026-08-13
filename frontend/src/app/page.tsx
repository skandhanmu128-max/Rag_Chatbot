import Link from "next/link";
import { ArrowRight, FileText, Database, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Zap className="text-blue-500 w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">DocuMind AI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-blue-400 transition">Dashboard</Link>
          <Link href="/chat" className="text-sm font-medium hover:text-blue-400 transition">Chat</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Agentic RAG Engine v2.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
          Ask. Understand. Verify. Discover.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
          Domain-Specific Multimodal Agentic RAG Document Intelligence Platform. Transform static PDFs into an interactive, self-verifying knowledge graph.
        </p>
        
        <div className="flex gap-4">
          <Link href="/chat" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Start Chatting <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/documents" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition border border-slate-700">
            Upload Documents
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 p-6 mb-24">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <FileText className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Multimodal Intelligence</h3>
          <p className="text-slate-400 text-sm">Deep layout parsing extracts text, tables, and images for comprehensive document reasoning.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Database className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Hybrid RAG</h3>
          <p className="text-slate-400 text-sm">Combines FAISS vector similarity with BM25 keyword search and cross-encoder reranking.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Shield className="w-8 h-8 text-emerald-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Self-Verifying Evidence</h3>
          <p className="text-slate-400 text-sm">Agentic verification cross-checks LLM claims against source citations to prevent hallucinations.</p>
        </div>
      </div>
    </div>
  );
}
