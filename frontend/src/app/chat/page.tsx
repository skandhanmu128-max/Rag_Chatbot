"use client";

import { useState } from "react";
import { Send, Bot, User, CheckCircle, AlertTriangle, FileText } from "lucide-react";

import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am the DocuMind AI agent. Upload a document or ask a question about your existing knowledge base." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);
    
    try {
      const response = await axios.post("http://localhost:8000/api/chat", { query: userMessage });
      const data = response.data;
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.answer,
        evidence: data.evidence 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 bg-slate-900 p-4 flex flex-col hidden md:flex">
        <h2 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500"/> DocuMind Chat
        </h2>
        
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Chats</div>
        <div className="flex flex-col gap-2 flex-1">
          <button className="text-left px-3 py-2 rounded-lg bg-slate-800 text-sm text-slate-300">Compare Leave Policies</button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm text-slate-400">CEO Information</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {msg.content}
                </div>
                
                {/* Real Evidence Panel */}
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm w-full max-w-lg mt-1">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2 border-b border-slate-800 pb-2">
                      <CheckCircle className="w-4 h-4" /> Sources Used ({msg.evidence.length})
                    </div>
                    {msg.evidence.map((ev: any, idx: number) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <div className="text-slate-400 mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3"/> Doc {ev.document_id} (Page {ev.page_number})
                        </div>
                        <div className="text-xs bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 italic line-clamp-2">
                          "{ev.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
              </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 max-w-4xl mx-auto w-full">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your documents..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 placeholder:text-slate-500"
            />
            <button type="submit" className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-slate-500 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Agentic RAG may take longer for complex multi-document reasoning.
          </div>
        </div>
      </div>
    </div>
  );
}
