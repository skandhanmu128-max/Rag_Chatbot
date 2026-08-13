"use client";

import { useState } from "react";
import axios from "axios";
import { GitCompare, CheckCircle, Loader2 } from "lucide-react";

export default function ComparePage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/advanced/compare", { topic });
      setResult(res.data.comparison);
    } catch (e) {
      setResult("Error fetching comparison.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center">
      <header className="mb-12 text-center mt-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <GitCompare className="text-purple-500 w-8 h-8" />
          Document Comparison Engine
        </h1>
        <p className="text-slate-400">Identify added, removed, or conflicting information across your knowledge base.</p>
      </header>

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="e.g., Leave Policy differences between 2024 and 2025" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 focus:outline-none focus:border-purple-500 text-sm"
          />
          <button 
            onClick={handleCompare}
            disabled={loading || !topic}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Compare Contexts"}
          </button>
        </div>
      </div>

      {result && (
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-4">
            <CheckCircle className="text-emerald-400 w-5 h-5"/> Comparison Analysis
          </h3>
          <div className="prose prose-invert max-w-none text-slate-300">
            {result.split("\n").map((line, i) => (
               <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
