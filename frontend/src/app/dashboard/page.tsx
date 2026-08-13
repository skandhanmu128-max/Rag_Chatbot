import Link from "next/link";
import { LayoutDashboard, FileText, Search, Activity, UploadCloud } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900 p-4 flex flex-col">
        <h2 className="font-bold text-xl mb-8 text-white">DocuMind Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
          <Link href="/documents" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 text-slate-400 rounded-lg transition"><FileText className="w-4 h-4" /> Documents</Link>
          <Link href="/chat" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 text-slate-400 rounded-lg transition"><Search className="w-4 h-4" /> Ask RAG</Link>
          <Link href="/compare" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 text-slate-400 rounded-lg transition"><Activity className="w-4 h-4" /> Compare Docs</Link>
          <Link href="/student-tools" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 text-slate-400 rounded-lg transition"><Activity className="w-4 h-4" /> Student Tools</Link>
          <Link href="/knowledge-map" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 text-slate-400 rounded-lg transition"><Activity className="w-4 h-4" /> Knowledge Map</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">System Overview</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload PDF
          </button>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="text-slate-400 text-sm font-medium mb-1">Total Documents</div>
            <div className="text-3xl font-bold text-white">12</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="text-slate-400 text-sm font-medium mb-1">Vector Chunks</div>
            <div className="text-3xl font-bold text-white">1,492</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="text-slate-400 text-sm font-medium mb-1">Avg Retrieval Time</div>
            <div className="text-3xl font-bold text-emerald-400">0.4s</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="text-slate-400 text-sm font-medium mb-1">Groundedness Score</div>
            <div className="text-3xl font-bold text-blue-400">96%</div>
          </div>
        </div>

        {/* Recent Documents Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-lg text-white">Recent Documents</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Filename</th>
                <th className="px-6 py-3 font-medium">Health Score</th>
                <th className="px-6 py-3 font-medium">Pages</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 flex items-center gap-2 font-medium text-slate-200"><FileText className="w-4 h-4 text-slate-500"/> Policy_2026.pdf</td>
                <td className="px-6 py-4"><span className="text-emerald-400">98/100</span></td>
                <td className="px-6 py-4">42</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">Indexed</span></td>
              </tr>
              <tr className="hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 flex items-center gap-2 font-medium text-slate-200"><FileText className="w-4 h-4 text-slate-500"/> Employee_Handbook.pdf</td>
                <td className="px-6 py-4"><span className="text-emerald-400">95/100</span></td>
                <td className="px-6 py-4">120</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">Indexed</span></td>
              </tr>
              <tr className="hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 flex items-center gap-2 font-medium text-slate-200"><FileText className="w-4 h-4 text-slate-500"/> Financial_Report_Q3.pdf</td>
                <td className="px-6 py-4"><span className="text-yellow-400">72/100</span></td>
                <td className="px-6 py-4">18</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium border border-blue-500/20">Processing</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
