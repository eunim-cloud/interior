
import { Site, DailyReport, ExecutionCost, SiteCalculation, RiskLevel } from '../types';

// D-Day 계산
export const calculateDDay = (deadline?: string): number | undefined => {
  if (!deadline) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 위험 상태 계산
export const calculateRiskLevel = (marginRate: number, dDay?: number): RiskLevel => {
  // 마진율 기준
  if (marginRate < 5) return 'DANGER';
  if (marginRate < 15) return 'WARNING';
  
  // D-Day 기준 (마진은 괜찮지만 시간이 촉박)
  if (dDay !== undefined) {
    if (dDay < 0) return 'DANGER'; // 데드라인 초과
    if (dDay < 7) return 'WARNING'; // 7일 이내
  }
  
  return 'SAFE';
};

// 현장별 계산
export const calculateSiteMetrics = (
  site: Site,
  dailyReports: DailyReport[],
  executionCosts: ExecutionCost[]
): SiteCalculation => {
  // 해당 현장의 일일보고 필터
  const siteReports = dailyReports.filter(r => r.siteId === site.id);
  const siteCosts = executionCosts.filter(c => c.siteId === site.id);
  
  // 인건비 합계
  const totalLaborCost = siteReports.reduce((sum, r) => sum + r.laborCost, 0);
  
  // 자재비 합계
  const totalMaterialCost = siteCosts
    .filter(c => c.category === 'MATERIAL')
    .reduce((sum, c) => sum + c.amount, 0);
  
  // 외주비 합계
  const totalOutsourceCost = siteCosts
    .filter(c => c.category === 'OUTSOURCE')
    .reduce((sum, c) => sum + c.amount, 0);
  
  // 기타 합계
  const totalOtherCost = siteCosts
    .filter(c => c.category === 'OTHER')
    .reduce((sum, c) => sum + c.amount, 0);
  
  // 총 실행 비용
  const totalExecutionCost = totalLaborCost + totalMaterialCost + totalOutsourceCost + totalOtherCost;
  
  // 남은 실행 금액
  const remainingBudget = site.budgetAmount - totalExecutionCost;
  
  // 실행 마진율 (%)
  const marginRate = site.budgetAmount > 0 
    ? (remainingBudget / site.budgetAmount) * 100 
    : 0;
  
  // D-Day
  const dDay = calculateDDay(site.deadline);
  
  // 위험 상태
  const riskLevel = calculateRiskLevel(marginRate, dDay);
  
  return {
    siteId: site.id,
    budgetAmount: site.budgetAmount,
    totalLaborCost,
    totalMaterialCost,
    totalOutsourceCost,
    totalOtherCost,
    totalExecutionCost,
    remainingBudget,
    marginRate,
    deadline: site.deadline,
    dDay,
    riskLevel,
  };
};

// 모든 현장 계산
export const calculateAllSites = (
  sites: Site[],
  dailyReports: DailyReport[],
  executionCosts: ExecutionCost[]
): SiteCalculation[] => {
  return sites.map(site => calculateSiteMetrics(site, dailyReports, executionCosts));
};
