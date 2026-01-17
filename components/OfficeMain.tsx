
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, Clock, ChevronRight, 
  TrendingUp, Building2, AlertCircle
} from 'lucide-react';
import { Site, DailyReport, ExecutionCost, SiteCalculation } from '../types';
import { formatCurrency } from '../utils/format';
import { calculateAllSites } from '../utils/calculations';

interface OfficeMainProps {
  sites: Site[];
  dailyReports: DailyReport[];
  executionCosts: ExecutionCost[];
  onSiteClick: (siteId: string) => void;
}

export const OfficeMain: React.FC<OfficeMainProps> = ({
  sites,
  dailyReports,
  executionCosts,
  onSiteClick,
}) => {
  const calculations = calculateAllSites(sites, dailyReports, executionCosts);
  const activeSites = sites.filter(s => s.status === 'ACTIVE');
  const activeCalculations = calculations.filter(c => 
    activeSites.some(s => s.id === c.siteId)
  );

  // 위험 현장 수
  const dangerCount = activeCalculations.filter(c => c.riskLevel === 'DANGER').length;
  const warningCount = activeCalculations.filter(c => c.riskLevel === 'WARNING').length;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'DANGER': return 'border-red-200 bg-red-50';
      case 'WARNING': return 'border-blue-200 bg-blue-50/50';
      default: return 'border-gray-100 bg-white';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'DANGER': return 'text-red-600 bg-red-100';
      case 'WARNING': return 'text-blue-600 bg-blue-100';
      default: return 'text-brand bg-blue-100';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'DANGER': return '위험';
      case 'WARNING': return '주의';
      default: return '정상';
    }
  };

  const getSiteById = (siteId: string) => sites.find(s => s.id === siteId);

  // 위험도 순으로 정렬
  const sortedCalculations = [...activeCalculations].sort((a, b) => {
    const riskOrder = { DANGER: 0, WARNING: 1, SAFE: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">사무소</p>
          <h1 className="text-2xl font-bold text-gray-900">어디가 위험한가?</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-gray-500" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{activeSites.length}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">진행 현장</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-5 shadow-sm border ${dangerCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dangerCount > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <AlertCircle size={20} className={dangerCount > 0 ? 'text-red-500' : 'text-gray-500'} />
              </div>
            </div>
            <p className={`text-2xl font-black ${dangerCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{dangerCount}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">위험 현장</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-5 shadow-sm border ${warningCount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${warningCount > 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <AlertTriangle size={20} className={warningCount > 0 ? 'text-blue-500' : 'text-gray-500'} />
              </div>
            </div>
            <p className={`text-2xl font-black ${warningCount > 0 ? 'text-blue-600' : 'text-gray-900'}`}>{warningCount}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">주의 현장</p>
          </motion.div>
        </div>

        {/* 현장 리스트 */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-900">현장별 현황</h2>
          
          {sortedCalculations.map((calc, index) => {
            const site = getSiteById(calc.siteId);
            if (!site) return null;

            return (
              <motion.div
                key={calc.siteId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSiteClick(calc.siteId)}
                className={`rounded-3xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-all ${getRiskColor(calc.riskLevel)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{site.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRiskBadgeColor(calc.riskLevel)}`}>
                        {getRiskLabel(calc.riskLevel)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{site.crewTeam}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1">남은 실행 금액</p>
                    <p className={`text-lg font-bold ${calc.remainingBudget >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                      {formatCurrency(calc.remainingBudget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1">실행 마진율</p>
                    <p className={`text-lg font-bold ${
                      calc.marginRate < 5 ? 'text-red-500' : 
                      calc.marginRate < 15 ? 'text-blue-500' : 'text-gray-900'
                    }`}>
                      {calc.marginRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1">데드라인</p>
                    <p className={`text-lg font-bold ${
                      calc.dDay !== undefined && calc.dDay < 7 ? 'text-red-500' : 'text-gray-900'
                    }`}>
                      {calc.dDay !== undefined ? (calc.dDay < 0 ? `D+${Math.abs(calc.dDay)}` : `D-${calc.dDay}`) : '-'}
                    </p>
                  </div>
                </div>

                {/* 프로그레스 바 */}
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">실행 비용 진행률</span>
                    <span className="font-bold text-gray-700">
                      {((calc.totalExecutionCost / calc.budgetAmount) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        calc.marginRate < 5 ? 'bg-red-500' : 'bg-brand'
                      }`}
                      style={{ width: `${Math.min((calc.totalExecutionCost / calc.budgetAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {activeSites.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold">진행 중인 현장이 없습니다</p>
            </div>
          )}
        </div>

        {/* 완료된 현장 */}
        {sites.filter(s => s.status === 'COMPLETED').length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="font-bold text-gray-400">완료된 현장</h2>
            {calculations
              .filter(c => sites.find(s => s.id === c.siteId)?.status === 'COMPLETED')
              .map(calc => {
                const site = getSiteById(calc.siteId);
                if (!site) return null;

                return (
                  <div
                    key={calc.siteId}
                    onClick={() => onSiteClick(calc.siteId)}
                    className="bg-gray-100 rounded-2xl p-5 cursor-pointer hover:bg-gray-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-600">{site.name}</h3>
                        <p className="text-sm text-gray-400">{site.crewTeam}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-600">{formatCurrency(calc.remainingBudget)}</p>
                        <p className="text-sm text-gray-400">최종 마진 {calc.marginRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
