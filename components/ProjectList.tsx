
import React, { useState } from 'react';
import { Project, Transaction } from '../types';
import { Plus, ChevronRight, Calculator, Calendar, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface ProjectListProps {
  projects: Project[];
  transactions: Transaction[];
  onProjectClick: (id: string) => void;
  onAddProject: (p: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, transactions, onProjectClick, onAddProject }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', startDate: '', endDate: '' });

  const getProjectStats = (projectId: string) => {
    const projectTransactions = transactions.filter(t => t.projectId === projectId);
    const income = projectTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = projectTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    onAddProject({
      ...newProject,
      id: Math.random().toString(36).substr(2, 9),
      status: 'ACTIVE',
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      endDate: newProject.endDate || new Date().toISOString().split('T')[0],
    });
    setNewProject({ name: '', startDate: '', endDate: '' });
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">현장 대시보드</h1>
          <p className="text-sm text-gray-500 font-medium">관리 중인 프로젝트 {projects.length}개</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all soft-shadow flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          새 현장 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => {
          const stats = getProjectStats(project.id);
          const margin = stats.income > 0 ? (stats.profit / stats.income) * 100 : 0;
          
          return (
            <div 
              key={project.id}
              onClick={() => onProjectClick(project.id)}
              className="bg-white border border-gray-100 p-8 rounded-[32px] text-left hover-shadow cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-gray-50 text-gray-400 p-2.5 rounded-2xl group-hover:bg-blue-50 group-hover:text-brand transition-colors">
                    <Calendar size={20} />
                  </div>
                  <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase ${project.status === 'ACTIVE' ? 'bg-blue-50 text-brand' : 'bg-gray-100 text-gray-400'}`}>
                    {project.status === 'ACTIVE' ? '진행중' : '완료'}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors">{project.name}</h3>
                <p className="text-xs text-gray-400 font-medium mb-10">{project.startDate} ~ {project.endDate}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-2xl group-hover:bg-blue-50/50 transition-colors">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-400">현재 예상 수익</span>
                    <span className="text-xs font-bold text-brand">{margin.toFixed(1)}% 마진</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.profit)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">매출액</span>
                    <span className="text-sm font-bold text-gray-700">{formatCurrency(stats.income)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">지출액</span>
                    <span className="text-sm font-bold text-gray-400">{formatCurrency(stats.expense)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-200 rounded-[40px] bg-white">
            <Calculator size={48} className="mx-auto text-gray-200 mb-6" />
            <p className="text-gray-400 font-bold">등록된 현장이 없습니다. 새 프로젝트를 시작해보세요.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] soft-shadow overflow-hidden p-10 space-y-8 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">새 현장 등록</h3>
              <p className="text-sm text-gray-500">정확한 현장명을 입력하여 관리를 시작하세요.</p>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">현장명</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-900 font-bold placeholder:text-gray-300"
                  placeholder="예: 용산 써밋아파트 리모델링"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">시작일</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-700 text-sm font-bold"
                    value={newProject.startDate}
                    onChange={e => setNewProject({...newProject, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">종료 예정일</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-700 text-sm font-bold"
                    value={newProject.endDate}
                    onChange={e => setNewProject({...newProject, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-4 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-4 bg-brand text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all soft-shadow"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
