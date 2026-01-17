
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Calendar, TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle2, Clock, ChevronRight, Camera, Users
} from 'lucide-react';
import { Site, DailyReport, ExecutionCost, LaborType, SiteCalculation, DailyCrewEntry } from '../types';
import { formatCurrency } from '../utils/format';
import { calculateSiteMetrics } from '../utils/calculations';

interface CrewMainProps {
  sites: Site[];
  dailyReports: DailyReport[];
  executionCosts: ExecutionCost[];
  laborTypes: LaborType[];
  onAddDailyReport: (report: DailyReport) => void;
  onAddExecutionCost: (cost: ExecutionCost) => void;
  onSiteClick: (siteId: string) => void;
}

export const CrewMain: React.FC<CrewMainProps> = ({
  sites,
  dailyReports,
  executionCosts,
  laborTypes,
  onAddDailyReport,
  onAddExecutionCost,
  onSiteClick,
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(
    sites.filter(s => s.status === 'ACTIVE')[0]?.id || null
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);

  const activeSites = sites.filter(s => s.status === 'ACTIVE');
  const selectedSite = sites.find(s => s.id === selectedSiteId);
  
  const calculation = selectedSite 
    ? calculateSiteMetrics(selectedSite, dailyReports, executionCosts)
    : null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'DANGER': return 'text-red-500 bg-red-50';
      case 'WARNING': return 'text-blue-400 bg-blue-50';
      default: return 'text-brand bg-blue-50';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'DANGER': return '위험';
      case 'WARNING': return '주의';
      default: return '정상';
    }
  };

  // 일일보고 입력 모달
  const DailyReportModal = () => {
    const [workContent, setWorkContent] = useState('');
    const [crewEntries, setCrewEntries] = useState<DailyCrewEntry[]>([]);
    const [selectedLaborType, setSelectedLaborType] = useState(laborTypes[0]?.id || '');
    const [crewCount, setCrewCount] = useState(1);

    const addCrewEntry = () => {
      const laborType = laborTypes.find(l => l.id === selectedLaborType);
      if (!laborType) return;
      
      const existing = crewEntries.find(e => e.laborTypeId === selectedLaborType);
      if (existing) {
        setCrewEntries(crewEntries.map(e => 
          e.laborTypeId === selectedLaborType 
            ? { ...e, count: e.count + crewCount, totalCost: (e.count + crewCount) * e.dailyRate }
            : e
        ));
      } else {
        setCrewEntries([...crewEntries, {
          laborTypeId: laborType.id,
          laborTypeName: laborType.name,
          count: crewCount,
          dailyRate: laborType.dailyRate,
          totalCost: crewCount * laborType.dailyRate,
        }]);
      }
      setCrewCount(1);
    };

    const removeCrewEntry = (laborTypeId: string) => {
      setCrewEntries(crewEntries.filter(e => e.laborTypeId !== laborTypeId));
    };

    const totalLaborCost = crewEntries.reduce((sum, e) => sum + e.totalCost, 0);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedSiteId || !workContent || crewEntries.length === 0) return;

      const report: DailyReport = {
        id: Math.random().toString(36).substr(2, 9),
        siteId: selectedSiteId,
        date: new Date().toISOString().split('T')[0],
        workContent,
        crewEntries,
        laborCost: totalLaborCost,
        photos: [],
        createdAt: new Date().toISOString(),
      };

      onAddDailyReport(report);
      setShowReportModal(false);
      setWorkContent('');
      setCrewEntries([]);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">오늘 일일보고</h3>
            <p className="text-sm text-gray-500 mt-1">{selectedSite?.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 작업 내용 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">작업 내용</label>
              <textarea
                required
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                placeholder="오늘 진행한 작업을 입력하세요"
                value={workContent}
                onChange={e => setWorkContent(e.target.value)}
              />
            </div>

            {/* 투입 인원 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">투입 인원</label>
              
              <div className="flex gap-2">
                <select
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-brand"
                  value={selectedLaborType}
                  onChange={e => setSelectedLaborType(e.target.value)}
                >
                  {laborTypes.map(lt => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} ({formatCurrency(lt.dailyRate)}/일)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className="w-20 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center outline-none focus:border-brand"
                  value={crewCount}
                  onChange={e => setCrewCount(parseInt(e.target.value) || 1)}
                />
                <button
                  type="button"
                  onClick={addCrewEntry}
                  className="px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  추가
                </button>
              </div>

              {/* 추가된 인원 목록 */}
              {crewEntries.length > 0 && (
                <div className="space-y-2 mt-3">
                  {crewEntries.map(entry => (
                    <div key={entry.laborTypeId} className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-brand" />
                        <span className="font-bold text-gray-800">{entry.laborTypeName}</span>
                        <span className="text-sm text-gray-500">{entry.count}명</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand">{formatCurrency(entry.totalCost)}</span>
                        <button
                          type="button"
                          onClick={() => removeCrewEntry(entry.laborTypeId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-600">오늘 인건비 합계</span>
                    <span className="text-lg font-bold text-brand">{formatCurrency(totalLaborCost)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!workContent || crewEntries.length === 0}
                className="flex-1 py-4 rounded-2xl bg-brand text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                저장하기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  // 비용 입력 모달
  const CostModal = () => {
    const [category, setCategory] = useState<'MATERIAL' | 'OUTSOURCE' | 'OTHER'>('MATERIAL');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedSiteId || !amount || !description) return;

      const cost: ExecutionCost = {
        id: Math.random().toString(36).substr(2, 9),
        siteId: selectedSiteId,
        category,
        amount: parseInt(amount),
        description,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };

      onAddExecutionCost(cost);
      setShowCostModal(false);
    };

    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">비용 추가</h3>
            <p className="text-sm text-gray-500 mt-1">{selectedSite?.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 카테고리 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">비용 종류</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'MATERIAL', label: '자재비' },
                  { value: 'OUTSOURCE', label: '외주비' },
                  { value: 'OTHER', label: '기타' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value as any)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      category === opt.value 
                        ? 'bg-brand text-white' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 금액 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">금액</label>
              <input
                required
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:border-brand text-lg font-bold"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">내용</label>
              <input
                required
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:border-brand"
                placeholder="예: 창호 자재 대금"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCostModal(false)}
                className="flex-1 py-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-4 rounded-2xl bg-brand text-white font-bold hover:bg-blue-700 transition-colors"
              >
                저장하기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold text-brand uppercase tracking-wider mb-2">시공팀</p>
          <h1 className="text-2xl font-bold text-gray-900">이 현장, 지금 계속 가도 되나?</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 현장 선택 */}
        {activeSites.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {activeSites.map(site => (
              <button
                key={site.id}
                onClick={() => setSelectedSiteId(site.id)}
                className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  selectedSiteId === site.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {site.name}
              </button>
            ))}
          </div>
        )}

        {/* 메인 카드 - 남은 실행 금액 */}
        {calculation && selectedSite && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">남은 실행 금액</p>
                <p className={`text-4xl font-black ${calculation.remainingBudget >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                  {formatCurrency(calculation.remainingBudget)}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${getRiskColor(calculation.riskLevel)}`}>
                {getRiskLabel(calculation.riskLevel)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">실행 마진율</p>
                <p className="text-xl font-bold text-gray-900">{calculation.marginRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">누적 실행 비용</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(calculation.totalExecutionCost)}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 mb-1">데드라인</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculation.dDay !== undefined ? `D-${calculation.dDay}` : '-'}
                </p>
              </div>
            </div>

            {/* 비용 상세 */}
            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">인건비</p>
                  <p className="font-bold text-gray-700">{formatCurrency(calculation.totalLaborCost)}</p>
                </div>
                <div>
                  <p className="text-gray-400">자재비</p>
                  <p className="font-bold text-gray-700">{formatCurrency(calculation.totalMaterialCost)}</p>
                </div>
                <div>
                  <p className="text-gray-400">외주비</p>
                  <p className="font-bold text-gray-700">{formatCurrency(calculation.totalOutsourceCost)}</p>
                </div>
                <div>
                  <p className="text-gray-400">기타</p>
                  <p className="font-bold text-gray-700">{formatCurrency(calculation.totalOtherCost)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowReportModal(true)}
            disabled={!selectedSiteId}
            className="bg-brand text-white p-6 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Plus size={24} />
            오늘 일일보고
          </button>
          <button
            onClick={() => setShowCostModal(true)}
            disabled={!selectedSiteId}
            className="bg-gray-900 text-white p-6 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <TrendingDown size={24} />
            비용 추가
          </button>
        </div>

        {/* 최근 기록 */}
        {selectedSiteId && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">최근 기록</h3>
            <div className="space-y-3">
              {dailyReports
                .filter(r => r.siteId === selectedSiteId)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-gray-800">{report.workContent}</p>
                      <p className="text-sm text-gray-400">{report.date} · 인원 {report.crewEntries.reduce((sum, e) => sum + e.count, 0)}명</p>
                    </div>
                    <p className="font-bold text-gray-600">-{formatCurrency(report.laborCost)}</p>
                  </div>
                ))}
              {dailyReports.filter(r => r.siteId === selectedSiteId).length === 0 && (
                <p className="text-center text-gray-400 py-8">아직 기록이 없습니다</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 모달 */}
      {showReportModal && <DailyReportModal />}
      {showCostModal && <CostModal />}
    </div>
  );
};
