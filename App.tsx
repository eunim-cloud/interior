
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import { LandingPage } from './components/LandingPage';
import { Project, Transaction, ScheduleItem } from './types';
import { mockProjects, mockTransactions, mockSchedules } from './services/mockData';

type View = 'LANDING' | 'DASHBOARD' | 'PROJECT_DETAIL' | 'SETTINGS';

const App: React.FC = () => {
  const [view, setView] = useState<View>('LANDING');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // App State
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedules);

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setView('PROJECT_DETAIL');
  };

  const navigateToDashboard = () => {
    setView('DASHBOARD');
    setSelectedProjectId(null);
  };

  const startApp = () => {
    setView('DASHBOARD');
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

  if (view === 'LANDING') {
    return <LandingPage onStart={startApp} />;
  }

  return (
    <Layout currentView={view} onNavigate={setView} onHome={navigateToDashboard}>
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-500">계정 및 팀 관리 기능은 준비 중입니다.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
