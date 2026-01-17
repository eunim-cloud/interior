import React, { useState } from 'react';
import { Hammer, LayoutDashboard, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { UserProfile } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: any) => void;
  onHome: () => void;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  onHome,
  userProfile,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OFFICE':
        return { label: '사무실', color: 'bg-indigo-100 text-indigo-700' };
      case 'ADMIN':
        return { label: '관리자', color: 'bg-purple-100 text-purple-700' };
      default:
        return { label: '시공팀', color: 'bg-blue-100 text-blue-700' };
    }
  };

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

          {/* 사용자 메뉴 */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {userProfile?.name?.charAt(0) || <User size={16} />}
              </div>
              {userProfile && (
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-800">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.company_name}</p>
                </div>
              )}
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {userProfile && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{userProfile.name}</p>
                      <p className="text-sm text-gray-500">{userProfile.email}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(userProfile.role).color}`}>
                          {getRoleBadge(userProfile.role).label}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('SETTINGS');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={18} className="text-gray-400" />
                    설정
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      로그아웃
                    </button>
                  )}
                </div>
              </>
            )}
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
