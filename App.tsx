import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ChatBot } from './components/ChatBot';
import { Project, Transaction, ScheduleItem } from './types';
import { mockProjects, mockTransactions, mockSchedules } from './services/mockData';
import { getSession, signOut, onAuthStateChange, getUserProfile, UserProfile } from './services/authService';
import { createSiteContext } from './services/chatService';
import type { Session } from '@supabase/supabase-js';

type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'DASHBOARD' | 'PROJECT_DETAIL' | 'SETTINGS';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LANDING');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // App State
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);

  // 초기 세션 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { session: currentSession } = await getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const profile = await getUserProfile(currentSession.user.id);
          setUserProfile(profile);
          setView('DASHBOARD');
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Auth 상태 변경 리스너
    const { data: { subscription } } = onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        const profile = await getUserProfile(newSession.user.id);
        setUserProfile(profile);
        setView('DASHBOARD');
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setView('LANDING');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setView('PROJECT_DETAIL');
  };

  const navigateToDashboard = () => {
    setView('DASHBOARD');
    setSelectedProjectId(null);
  };

  const startApp = () => {
    // 로그인 여부 확인
    if (session) {
      setView('DASHBOARD');
    } else {
      setView('LOGIN');
    }
  };

  const handleLoginSuccess = async () => {
    const { session: currentSession } = await getSession();
    if (currentSession?.user) {
      const profile = await getUserProfile(currentSession.user.id);
      setUserProfile(profile);
    }
    setView('DASHBOARD');
  };

  const handleSignUpSuccess = () => {
    setView('LOGIN');
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
    setUserProfile(null);
    setView('LANDING');
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };

  const addSchedule = (schedule: ScheduleItem) => {
    setSchedules(prev => [...prev, schedule]);
  };

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 랜딩 페이지
  if (view === 'LANDING') {
    return (
      <>
        <LandingPage onStart={startApp} onLogin={() => setView('LOGIN')} />
        <ChatBot />
      </>
    );
  }

  // 로그인 페이지
  if (view === 'LOGIN') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={() => setView('SIGNUP')}
      />
    );
  }

  // 회원가입 페이지
  if (view === 'SIGNUP') {
    return (
      <SignUpPage 
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToLogin={() => setView('LOGIN')}
      />
    );
  }

  // 로그인되지 않은 상태에서 대시보드 접근 시 로그인 페이지로
  if (!session && (view === 'DASHBOARD' || view === 'PROJECT_DETAIL' || view === 'SETTINGS')) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={() => setView('SIGNUP')}
      />
    );
  }

  // 챗봇 컨텍스트 생성 (현재 보고 있는 프로젝트 정보)
  const chatContext = useMemo(() => {
    if (selectedProject) {
      const projectTransactions = transactions.filter(t => t.projectId === selectedProject.id);
      const totalRevenue = projectTransactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = projectTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return createSiteContext({
        name: selectedProject.name,
        status: selectedProject.status,
        totalRevenue,
        totalExpense,
      });
    }
    return undefined;
  }, [selectedProject, transactions]);

  return (
    <Layout 
      currentView={view} 
      onNavigate={setView} 
      onHome={navigateToDashboard}
      userProfile={userProfile}
      onLogout={handleLogout}
    >
      {view === 'DASHBOARD' && (
        <ProjectList 
          projects={projects} 
          transactions={transactions} 
          onProjectClick={navigateToProject}
          onAddProject={addProject}
        />
      )}
      
      {view === 'PROJECT_DETAIL' && selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          transactions={transactions.filter(t => t.projectId === selectedProject.id)}
          schedules={schedules.filter(s => s.projectId === selectedProject.id)}
          onAddTransaction={addTransaction}
          onAddSchedule={addSchedule}
          onBack={navigateToDashboard}
        />
      )}

      {view === 'SETTINGS' && (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">설정</h1>
          
          {/* 사용자 정보 카드 */}
          {userProfile && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">내 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">이름</span>
                  <span className="font-medium text-slate-800">{userProfile.name || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">이메일</span>
                  <span className="font-medium text-slate-800">{userProfile.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">회사명</span>
                  <span className="font-medium text-slate-800">{userProfile.company_name || '-'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">역할</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userProfile.role === 'OFFICE' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : userProfile.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {userProfile.role === 'OFFICE' ? '사무실 관리자' : 
                     userProfile.role === 'ADMIN' ? '관리자' : '시공팀'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-medium py-3 rounded-xl hover:bg-red-100 transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}

      {/* AI 챗봇 - 로그인된 상태에서만 표시 */}
      <ChatBot context={chatContext} />
    </Layout>
  );
};

export default App;
