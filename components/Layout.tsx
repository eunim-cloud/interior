
import React from 'react';
import { Hammer, LayoutDashboard, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: any) => void;
  onHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onHome }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 soft-shadow">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <button 
            onClick={onHome}
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-80 transition-all"
          >
            <div className="bg-brand text-white p-2 rounded-xl">
              <Hammer size={18} strokeWidth={2.5} />
            </div>
            <span>SiteFlow</span>
          </button>
          
          <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
            <button 
              onClick={() => onNavigate('DASHBOARD')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${currentView === 'DASHBOARD' || currentView === 'PROJECT_DETAIL' ? 'bg-white text-brand soft-shadow border border-gray-100' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <LayoutDashboard size={16} />
              현장 관리
            </button>
            <button 
              onClick={() => onNavigate('SETTINGS')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${currentView === 'SETTINGS' ? 'bg-white text-brand soft-shadow border border-gray-100' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Settings size={16} />
              설정
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-brand">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      <footer className="py-12 text-center text-gray-400">
        <p className="text-[11px] font-medium tracking-widest uppercase">
          SiteFlow &middot; Professional Interior OS
        </p>
      </footer>
    </div>
  );
};
