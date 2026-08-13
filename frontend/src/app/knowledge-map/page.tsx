"use client";

import { useState } from "react";
import axios from "axios";
import { Network, Loader2, Link as LinkIcon, Database } from "lucide-react";

export default function KnowledgeMapPage() {
  const [topic, setTopic] = useState("");
  const [graph, setGraph] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/advanced/knowledge-graph", { topic });
      setGraph(res.data);
    } catch (e) {
      setGraph({ nodes: [{ id: "error", label: "Failed to generate graph" }], links: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center">
      <header className="mb-12 text-center mt-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Network className="text-emerald-500 w-8 h-8" />
          Interactive Knowledge Map
        </h1>
        <p className="text-slate-400">Extract entities and relationships dynamically from your documents.</p>
      </header>

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Enter a topic to map (e.g., Leave Policy)" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 focus:outline-none focus:border-emerald-500 text-sm"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Generate Graph"}
          </button>
        </div>
      </div>

      {graph && graph.nodes && (
        <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-4">Entity Relationships</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2"><Database className="w-4 h-4"/> Extracted Entities</h4>
              <div className="flex flex-wrap gap-3">
                {graph.nodes.map((n: any, i: number) => (
                  <div key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-emerald-300 font-medium shadow-sm hover:border-emerald-500 transition cursor-default">
                    {n.label || n.id}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
               <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2"><LinkIcon className="w-4 h-4"/> Relationships</h4>
               <ul className="space-y-3">
                 {graph.links?.map((l: any, i: number) => (
                   <li key={i} className="flex items-center gap-3 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800">
                     <span className="text-blue-400 font-medium">{l.source}</span>
                     <span className="text-slate-500 text-xs uppercase tracking-wider px-2 py-1 bg-slate-800 rounded">{l.label}</span>
                     <span className="text-purple-400 font-medium">{l.target}</span>
                   </li>
                 ))}
                 {(!graph.links || graph.links.length === 0) && (
                   <div className="text-slate-500 italic text-sm">No clear relationships found.</div>
                 )}
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
