
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Users, Package, Truck, MoreHorizontal,
  Clock, TrendingUp, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Site, DailyReport, ExecutionCost, SiteCalculation } from '../types';
import { formatCurrency } from '../utils/format';
import { calculateSiteMetrics } from '../utils/calculations';

interface SiteDetailProps {
  site: Site;
  dailyReports: DailyReport[];
  executionCosts: ExecutionCost[];
  onBack: () => void;
}

export const SiteDetail: React.FC<SiteDetailProps> = ({
  site,
  dailyReports,
  executionCosts,
  onBack,
}) => {
  const calculation = calculateSiteMetrics(site, dailyReports, executionCosts);
  const siteReports = dailyReports
    .filter(r => r.siteId === site.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const siteCosts = executionCosts
    .filter(c => c.siteId === site.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'DANGER': return 'text-red-500 bg-red-50';
      case 'WARNING': return 'text-blue-500 bg-blue-50';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MATERIAL': return <Package size={16} />;
      case 'OUTSOURCE': return <Truck size={16} />;
      default: return <MoreHorizontal size={16} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'MATERIAL': return '자재비';
      case 'OUTSOURCE': return '외주비';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-gray-900">{site.name}</h1>
            <p className="text-sm text-gray-500">{site.crewTeam}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${getRiskColor(calculation.riskLevel)}`}>
            {getRiskLabel(calculation.riskLevel)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 상단 고정 - 핵심 지표 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">견적 금액</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(calculation.budgetAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">누적 실행 비용</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(calculation.totalExecutionCost)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">남은 실행 금액</p>
              <p className={`text-xl font-bold ${calculation.remainingBudget >= 0 ? 'text-brand' : 'text-red-500'}`}>
                {formatCurrency(calculation.remainingBudget)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">실행 마진율</p>
              <p className={`text-xl font-bold ${
                calculation.marginRate < 5 ? 'text-red-500' : 'text-brand'
              }`}>
                {calculation.marginRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">데드라인</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-gray-900">
                  {calculation.dDay !== undefined ? (calculation.dDay < 0 ? `D+${Math.abs(calculation.dDay)}` : `D-${calculation.dDay}`) : '-'}
                </p>
                {site.deadline && (
                  <span className="text-xs text-gray-400">{site.deadline}</span>
                )}
              </div>
            </div>
          </div>

          {/* 프로그레스 바 */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">예산 소진율</span>
              <span className="font-bold text-gray-700">
                {((calculation.totalExecutionCost / calculation.budgetAmount) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  calculation.marginRate < 5 ? 'bg-red-500' : 'bg-brand'
                }`}
                style={{ width: `${Math.min((calculation.totalExecutionCost / calculation.budgetAmount) * 100, 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* 실행 비용 요약 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-900 mb-4">실행 비용 요약</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-brand" />
                <span className="text-xs font-bold text-brand">인건비</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(calculation.totalLaborCost)}</p>
              <p className="text-xs text-gray-400">
                {((calculation.totalLaborCost / calculation.totalExecutionCost) * 100 || 0).toFixed(0)}%
              </p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600">자재비</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(calculation.totalMaterialCost)}</p>
              <p className="text-xs text-gray-400">
                {((calculation.totalMaterialCost / calculation.totalExecutionCost) * 100 || 0).toFixed(0)}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={16} className="text-purple-600" />
                <span className="text-xs font-bold text-purple-600">외주비</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(calculation.totalOutsourceCost)}</p>
              <p className="text-xs text-gray-400">
                {((calculation.totalOutsourceCost / calculation.totalExecutionCost) * 100 || 0).toFixed(0)}%
              </p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MoreHorizontal size={16} className="text-gray-600" />
                <span className="text-xs font-bold text-gray-600">기타</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(calculation.totalOtherCost)}</p>
              <p className="text-xs text-gray-400">
                {((calculation.totalOtherCost / calculation.totalExecutionCost) * 100 || 0).toFixed(0)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* 시공팀 실행 기록 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-900 mb-4">시공팀 실행 기록</h3>
          
          {siteReports.length > 0 ? (
            <div className="space-y-4">
              {siteReports.map((report, index) => (
                <div key={report.id} className="border-l-2 border-brand pl-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-brand uppercase">{report.date}</p>
                      <p className="font-bold text-gray-900 mt-1">{report.workContent}</p>
                    </div>
                    <p className="font-bold text-gray-600">-{formatCurrency(report.laborCost)}</p>
                  </div>
                  
                  {/* 투입 인원 */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {report.crewEntries.map((entry, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                        <Users size={12} className="text-gray-500" />
                        <span className="font-medium text-gray-700">{entry.laborTypeName}</span>
                        <span className="text-gray-500">{entry.count}명</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">아직 일일보고가 없습니다</p>
          )}
        </motion.div>

        {/* 비용 내역 */}
        {siteCosts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-gray-900 mb-4">비용 내역</h3>
            <div className="space-y-3">
              {siteCosts.map(cost => (
                <div key={cost.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      cost.category === 'MATERIAL' ? 'bg-emerald-100 text-emerald-600' :
                      cost.category === 'OUTSOURCE' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {getCategoryIcon(cost.category)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{cost.description}</p>
                      <p className="text-xs text-gray-400">{cost.date} · {getCategoryLabel(cost.category)}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-600">-{formatCurrency(cost.amount)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
