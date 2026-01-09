
import React, { useState, useMemo } from 'react';
import { Project, Transaction, ScheduleItem, Category } from '../types';
import { ChevronLeft, Camera, Clock, DollarSign, Activity, ListFilter, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface ProjectDetailProps {
  project: Project;
  transactions: Transaction[];
  schedules: ScheduleItem[];
  onAddTransaction: (t: Transaction) => void;
  onAddSchedule: (s: ScheduleItem) => void;
  onBack: () => void;
}

type Tab = 'SCHEDULE' | 'FINANCE';

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, transactions, schedules, onAddTransaction, onAddSchedule, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('SCHEDULE');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  }, [transactions]);

  const [tForm, setTForm] = useState({ description: '', amount: 0, category: 'Material' as Category, type: 'EXPENSE' as 'INCOME' | 'EXPENSE', date: new Date().toISOString().split('T')[0] });
  const [sForm, setSForm] = useState({ content: '', note: '', date: new Date().toISOString().split('T')[0] });

  return (
    <div className="flex flex-col h-full bg-surface min-h-screen">
      {/* Information Header */}
      <div className="bg-white border-b border-gray-100 sticky top-18 z-40 soft-shadow">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <button onClick={onBack} className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand transition-colors">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                현장 리스트로 돌아가기
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.name}</h1>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-w-[200px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">총 수입</p>
                <p className="text-xl font-bold">{formatCurrency(stats.income)}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-w-[200px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">총 지출</p>
                <p className="text-xl font-bold text-gray-500">{formatCurrency(stats.expense)}</p>
              </div>
              <div className="bg-blue-600 rounded-2xl p-5 shadow-lg shadow-blue-100 min-w-[200px] text-white">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">현재 예상 수익</p>
                <p className="text-xl font-bold">{formatCurrency(stats.profit)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex gap-4 p-1.5 bg-gray-100 rounded-2xl w-fit mb-12">
          <button 
            onClick={() => setActiveTab('SCHEDULE')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'SCHEDULE' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Activity size={16} />
            공정 기록
          </button>
          <button 
            onClick={() => setActiveTab('FINANCE')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'FINANCE' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <DollarSign size={16} />
            정산 내역
          </button>
        </div>

        {activeTab === 'SCHEDULE' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">현장 타임라인</h3>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-brand text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all soft-shadow flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={3} />
                기록 추가
              </button>
            </div>
            
            <div className="space-y-6">
              {schedules.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-[32px] p-24 text-center soft-shadow">
                  <Clock className="mx-auto text-gray-100 mb-6" size={48} />
                  <p className="text-gray-400 font-bold">아직 기록된 공정이 없습니다.</p>
                </div>
              ) : (
                schedules.sort((a, b) => b.date.localeCompare(a.date)).map(item => (
                  <div key={item.id} className="bg-white border border-gray-100 p-8 rounded-[32px] soft-shadow hover-shadow">
                    <div className="flex gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-bold text-brand leading-none">{new Date(item.date).getDate()}</span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-bold text-gray-900">{item.content}</h4>
                          <span className="text-xs font-bold text-gray-400">{item.date}</span>
                        </div>
                        {item.note && <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{item.note}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'FINANCE' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">수입 및 지출 현황</h3>
              <button 
                onClick={() => setShowTransactionModal(true)}
                className="bg-brand text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all soft-shadow flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={3} />
                내역 추가
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden soft-shadow">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                    <th className="px-10 py-5">날짜</th>
                    <th className="px-10 py-5">항목</th>
                    <th className="px-10 py-5 text-right">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-10 py-32 text-center text-gray-300 font-bold italic">
                        기록된 수입/지출 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    transactions.sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-6 text-sm font-bold text-gray-400">{t.date}</td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-6 rounded-full ${t.type === 'INCOME' ? 'bg-blue-100 border border-blue-200' : 'bg-gray-100 border border-gray-200'}`} />
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-900">{t.description}</p>
                              <span className="text-[10px] bg-gray-100 px-2.5 py-1 rounded-md text-gray-500 font-bold uppercase tracking-wider">{t.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className={`px-10 py-6 text-right font-bold text-lg ${t.type === 'INCOME' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals - Simplified for SaaS style */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl p-12 space-y-10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">수입/지출 기록</h3>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setTForm({...tForm, type: 'EXPENSE'})} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${tForm.type === 'EXPENSE' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>지출</button>
                <button onClick={() => setTForm({...tForm, type: 'INCOME', category: 'Income'})} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${tForm.type === 'INCOME' ? 'bg-white text-brand shadow-sm' : 'text-gray-400'}`}>수입</button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">항목 명칭</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-900 font-bold" value={tForm.description} onChange={e => setTForm({...tForm, description: e.target.value})} placeholder="예: 자재 대금, 선금 입금 등" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">금액 (KRW)</label>
                <input required type="number" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-900 text-3xl font-bold" value={tForm.amount || ''} onChange={e => setTForm({...tForm, amount: parseInt(e.target.value) || 0})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">날짜</label>
                  <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-700 font-bold text-sm" value={tForm.date} onChange={e => setTForm({...tForm, date: e.target.value})} />
                </div>
                {tForm.type === 'EXPENSE' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">분류</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-gray-700 font-bold text-sm" value={tForm.category} onChange={e => setTForm({...tForm, category: e.target.value as Category})}>
                      <option value="Material">자재비</option>
                      <option value="Labor">인건비</option>
                      <option value="Other">기타</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowTransactionModal(false)} className="flex-1 py-5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={() => {
                onAddTransaction({ ...tForm, id: Math.random().toString(36).substr(2, 9), projectId: project.id });
                setShowTransactionModal(false);
              }} className="flex-1 py-5 bg-brand text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all soft-shadow">저장하기</button>
            </div>
          </div>
        </div>
      )}
      {/* ... similar updates for Schedule Modal ... */}
    </div>
  );
};
