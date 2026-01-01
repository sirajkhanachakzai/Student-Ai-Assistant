
import React, { useState, useEffect } from 'react';
import { ChatSession } from './types';
import { storageService } from './services/storageService';
import ChatInterface from './components/ChatInterface';
import TicketForm from './components/TicketForm';
import ChannelConnect from './components/ChannelConnect';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'history'>('chat');
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    const savedSessions = storageService.getChatSessions();
    setSessions(savedSessions);
    if (savedSessions.length > 0) {
      setActiveSessionId(savedSessions[0].id);
    } else {
      createNewSession();
    }
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Discussion',
      messages: [],
      updatedAt: Date.now()
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    setActiveTab('chat');
    storageService.saveChatSession(newSession);
  };

  const handleSessionUpdate = (updatedSession: ChatSession) => {
    const updated = sessions.map(s => s.id === updatedSession.id ? updatedSession : s);
    const sorted = [updatedSession, ...updated.filter(s => s.id !== updatedSession.id)];
    setSessions(sorted);
    storageService.saveChatSession(updatedSession);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    storageService.deleteChatSession(id);
    if (activeSessionId === id) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Premium Glass Sidebar */}
      <aside className="w-[320px] glass-sidebar border-r border-slate-200/60 flex flex-col hidden lg:flex shadow-2xl shadow-slate-200/50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">EduAssist</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Global Tech Univ.</p>
            </div>
          </div>

          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all font-bold text-sm mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            New Topic
          </button>

          <nav className="space-y-1.5 mb-10">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all group ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' : 'text-slate-500 hover:bg-white hover:text-indigo-600 font-medium'}`}
            >
              <svg className={`w-5 h-5 ${activeTab === 'chat' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              Chat Support
            </button>
            <button 
              onClick={() => setActiveTab('channels')}
              className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all group ${activeTab === 'channels' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' : 'text-slate-500 hover:bg-white hover:text-indigo-600 font-medium'}`}
            >
              <svg className={`w-5 h-5 ${activeTab === 'channels' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Omnichannel
            </button>
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto px-6 mb-4">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Recent History</p>
          <div className="space-y-2">
            {sessions.map(s => (
              <div 
                key={s.id}
                onClick={() => { setActiveSessionId(s.id); setActiveTab('chat'); }}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${activeSessionId === s.id && activeTab === 'chat' ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-white/50 border border-transparent hover:border-slate-100'}`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${activeSessionId === s.id && activeTab === 'chat' ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {s.title || "Untitled Chat"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {new Date(s.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-slate-200/60 bg-white/40">
          <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl p-5 border border-indigo-100 mb-6">
            <h4 className="text-sm font-bold text-indigo-900 mb-1">Complex Query?</h4>
            <p className="text-xs text-indigo-700/70 mb-4 font-medium leading-relaxed">If the AI can't help, our staff is ready to step in.</p>
            <button 
              onClick={() => setShowTicketModal(true)}
              className="w-full bg-white text-indigo-600 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs border border-indigo-200 shadow-sm"
            >
              Open Support Ticket
            </button>
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Alex Student</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Navbar */}
        <div className="lg:hidden p-5 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
             <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">EduAssist</h1>
          </div>
          <button onClick={() => createNewSession()} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && activeSession && (
            <div className="h-full max-w-5xl mx-auto md:px-6">
              <ChatInterface 
                activeSession={activeSession} 
                onSessionUpdate={handleSessionUpdate} 
              />
            </div>
          )}
          {activeTab === 'channels' && <ChannelConnect />}
        </div>
      </main>

      {/* Modern Ticket Modal Overlay */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 transition-all animate-message">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
            <TicketForm onClose={() => setShowTicketModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
