"use client";

import { useState } from "react";
import axios from "axios";
import { GraduationCap, Headphones, FileSignature, Loader2 } from "lucide-react";

export default function StudentToolsPage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("viva");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/advanced/study", { topic, mode });
      setResult(res.data.result);
    } catch (e) {
      setResult("Error generating study material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center">
      <header className="mb-12 text-center mt-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <GraduationCap className="text-orange-500 w-8 h-8" />
          AI Student Tools
        </h1>
        <p className="text-slate-400">Generate Viva questions, Cheat Sheets, or Podcast Scripts from your documents.</p>
      </header>

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setMode("viva")}
            className={`flex-1 py-3 rounded-lg font-medium border flex items-center justify-center gap-2 transition ${mode === 'viva' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
          >
            <GraduationCap className="w-4 h-4"/> Viva Prep
          </button>
          <button 
             onClick={() => setMode("cheatsheet")}
            className={`flex-1 py-3 rounded-lg font-medium border flex items-center justify-center gap-2 transition ${mode === 'cheatsheet' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
          >
            <FileSignature className="w-4 h-4"/> Cheat Sheet
          </button>
          <button 
             onClick={() => setMode("podcast")}
            className={`flex-1 py-3 rounded-lg font-medium border flex items-center justify-center gap-2 transition ${mode === 'podcast' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
          >
            <Headphones className="w-4 h-4"/> Podcast Script
          </button>
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="What topic should I prepare you for?" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 focus:outline-none focus:border-orange-500 text-sm"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Generate Material"}
          </button>
        </div>
      </div>

      {result && (
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
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
