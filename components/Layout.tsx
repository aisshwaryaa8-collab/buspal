
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-100 overflow-hidden">
      {/* GLOWING HEADER */}
      <header className="relative bg-slate-950/50 backdrop-blur-xl border-b border-white/5 p-5 flex justify-between items-center z-50">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none" />
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
          <span className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">🚍</span>
          BUS<span className="text-blue-500">PAL</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Grid Link</span>
            <span className="text-[10px] font-bold text-slate-400">CHENNAI_v4.2</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">
            📡
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto relative no-scrollbar bg-slate-950">
        {children}
      </main>

      {/* FUTURISTIC BOTTOM NAV */}
      <nav className="relative bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex justify-around p-4 pb-8 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        
        <button 
          onClick={() => setActiveTab('home')}
          className={`relative flex flex-col items-center gap-1 group transition-all ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          {activeTab === 'home' && <div className="absolute -top-4 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />}
          <span className="text-xl transition-transform group-hover:scale-110">🏠</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab('map')}
          className={`relative flex flex-col items-center gap-1 group transition-all ${activeTab === 'map' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          {activeTab === 'map' && <div className="absolute -top-4 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />}
          <span className="text-xl transition-transform group-hover:scale-110">🛰️</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Tactical</span>
        </button>

        <button 
          onClick={() => setActiveTab('ai')}
          className={`relative flex flex-col items-center gap-1 group transition-all ${activeTab === 'ai' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          {activeTab === 'ai' && <div className="absolute -top-4 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />}
          <span className="text-xl transition-transform group-hover:scale-110">🧠</span>
          <span className="text-[10px] font-black uppercase tracking-widest">Neural AI</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;