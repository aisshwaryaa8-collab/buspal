
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';

interface GeminiAssistantProps {
  context: any;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ context }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: "Neural Uplink established. I am BusPal AI. Command me regarding MTC route logistics, real-time load balancing, or tactical travel optimizations in Chennai." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Next bus to Parrys?",
    "Check crowd on Route 25",
    "Fastest way to Central",
    "Identify low crowd routes"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const query = text.trim();
    if (!query || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    const response = await chatWithAssistant(query, context);
    setMessages(prev => [...prev, { role: 'bot', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] relative">
      <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
      
      <div className="px-6 py-5 bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
          <div>
            <span className="block text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">BusPal Neural Unit</span>
            <span className="block text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">Operational Status: Stable</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-50">🤖</div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 space-y-10 overflow-y-auto no-scrollbar relative z-10 pb-40">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-900/40' 
                : 'bg-slate-900/80 text-slate-200 rounded-tl-none border border-white/5 ring-1 ring-white/10'
            }`}>
              <p className="font-medium">{m.content}</p>
              <div className="mt-3 text-[8px] font-black uppercase tracking-widest opacity-25">
                {m.role === 'user' ? `TRANSMISSION_SEQ: ${i}` : 'AUTH_REPLY: OK'}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-[2.5rem] rounded-tl-none flex items-center gap-5 shadow-inner">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Parsing Fleet Data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-20 z-20">
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 px-2">
          {suggestions.map((s, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/50 text-slate-400 hover:text-blue-400 px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all active:scale-95"
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto flex gap-4 items-center">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ENTER TACTICAL COMMAND..."
              className="w-full bg-slate-900 border border-white/10 rounded-[2rem] px-8 py-5 text-white placeholder-slate-700 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all shadow-2xl"
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all shadow-xl shadow-blue-900/40 active:scale-90"
          >
            <span className="text-xl font-black">▲</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;