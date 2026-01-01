
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatSession } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

interface ChatInterfaceProps {
  activeSession: ChatSession;
  onSessionUpdate: (session: ChatSession) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeSession, onSessionUpdate }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeSession.messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    const updatedMessages = [...activeSession.messages, userMessage];
    const updatedSession = { ...activeSession, messages: updatedMessages, updatedAt: Date.now() };
    
    onSessionUpdate(updatedSession);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await geminiService.generateResponse(updatedMessages);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: Date.now(),
    };

    const finalSession = { 
      ...updatedSession, 
      messages: [...updatedMessages, aiMessage],
      title: updatedMessages.length <= 2 ? input.substring(0, 35) + (input.length > 35 ? '...' : '') : activeSession.title
    };
    
    onSessionUpdate(finalSession);
    storageService.saveChatSession(finalSession);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Dynamic Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md rounded-t-3xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight">EduAssist AI</h3>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Academic Specialist
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scroll-smooth"
      >
        {activeSession.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-message">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-indigo-50/50">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-2xl font-extrabold text-slate-800 mb-2">How can I help you today?</h4>
            <p className="text-slate-500 leading-relaxed">
              I can help with your thesis, explain complex coding concepts, or help you track upcoming exams.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['Coding Help', 'Study Plan', 'Exam Dates'].map(chip => (
                <button key={chip} onClick={() => setInput(chip)} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm">
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSession.messages.map((msg, idx) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`px-5 py-4 rounded-3xl text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                  ? 'chat-bubble-user text-white rounded-tr-none' 
                  : 'chat-bubble-ai text-slate-700 rounded-tl-none'
                }`}
              >
                <div className="prose prose-sm max-w-none prose-slate">
                   <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 px-1 tracking-wider uppercase">
                {msg.role === 'user' ? 'You' : 'EduAssist'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-message">
            <div className="chat-bubble-ai rounded-3xl rounded-tl-none px-6 py-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
                <span className="text-xs font-bold text-indigo-600/60 uppercase tracking-widest ml-2">Thinking</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Floating Input Area */}
      <div className="px-8 pb-8 pt-4">
        <div className="relative max-w-4xl mx-auto flex items-center pill-input bg-white rounded-3xl border border-slate-200/50 p-2 group focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
          <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your academic question..."
            className="flex-1 bg-transparent border-none px-4 py-3 focus:outline-none text-slate-700 placeholder:text-slate-400 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="ml-2 p-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:scale-100 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest opacity-60">
          Powered by Gemini 3 Flash • Global Tech University Official Helpdesk
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
