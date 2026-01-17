import { supabase } from './supabase';
import type {
  Site,
  SiteInsert,
  SiteUpdate,
  DailyReport,
  DailyReportWithEntries,
  CrewEntry,
  CrewEntryInsert,
  ExecutionCost,
  ExecutionCostInsert,
  LaborType,
  Payment,
  PaymentInsert,
  Schedule,
  ScheduleInsert,
  SiteWithMetrics,
} from '../types/database';

// =============================================
// 현장 (Sites) CRUD
// =============================================

// 현장 목록 조회
export async function getSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 활성 현장만 조회
export async function getActiveSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 현장 상세 조회
export async function getSiteById(id: string): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// 현장 생성
export async function createSite(site: SiteInsert): Promise<Site> {
  const { data, error } = await supabase
    .from('sites')
    .insert(site)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 현장 수정
export async function updateSite(id: string, updates: SiteUpdate): Promise<Site> {
  const { data, error } = await supabase
    .from('sites')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 현장 삭제
export async function deleteSite(id: string): Promise<void> {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================
// 일일보고 (Daily Reports) CRUD
// =============================================

// 현장별 일일보고 조회
export async function getDailyReports(siteId: string): Promise<DailyReportWithEntries[]> {
  const { data, error } = await supabase
    .from('daily_reports')
    .select(`
      *,
      crew_entries (*)
    `)
    .eq('site_id', siteId)
    .order('report_date', { ascending: false });

  if (error) throw error;
  return (data || []) as DailyReportWithEntries[];
}

// 일일보고 생성 (crew_entries 포함)
export async function createDailyReport(
  report: Omit<DailyReport, 'id' | 'created_at' | 'updated_at'>,
  crewEntries: Omit<CrewEntryInsert, 'daily_report_id'>[]
): Promise<DailyReport> {
  // 1. 일일보고 생성
  const { data: newReport, error: reportError } = await supabase
    .from('daily_reports')
    .insert(report)
    .select()
    .single();

  if (reportError) throw reportError;

  // 2. crew_entries 추가
  if (crewEntries.length > 0) {
    const entriesWithReportId = crewEntries.map(entry => ({
      ...entry,
      daily_report_id: newReport.id,
    }));

    const { error: entriesError } = await supabase
      .from('crew_entries')
      .insert(entriesWithReportId);

    if (entriesError) throw entriesError;
  }

  return newReport;
}

// =============================================
// 실행 비용 (Execution Costs) CRUD
// =============================================

// 현장별 실행 비용 조회
export async function getExecutionCosts(siteId: string): Promise<ExecutionCost[]> {
  const { data, error } = await supabase
    .from('execution_costs')
    .select('*')
    .eq('site_id', siteId)
    .order('cost_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 실행 비용 추가
export async function createExecutionCost(cost: ExecutionCostInsert): Promise<ExecutionCost> {
  const { data, error } = await supabase
    .from('execution_costs')
    .insert(cost)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 실행 비용 삭제
export async function deleteExecutionCost(id: string): Promise<void> {
  const { error } = await supabase
    .from('execution_costs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =============================================
// 인건비 단가 (Labor Types)
// =============================================

// 인건비 단가 목록 조회
export async function getLaborTypes(): Promise<LaborType[]> {
  const { data, error } = await supabase
    .from('labor_types')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data || [];
}

// =============================================
// 입금 내역 (Payments)
// =============================================

// 현장별 입금 내역 조회
export async function getPayments(siteId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('site_id', siteId)
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// 입금 내역 추가
export async function createPayment(payment: PaymentInsert): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// 일정 (Schedules)
// =============================================

// 현장별 일정 조회
export async function getSchedules(siteId: string): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('site_id', siteId)
    .order('schedule_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// 일정 추가
export async function createSchedule(schedule: ScheduleInsert): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .insert(schedule)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 일정 완료 처리
export async function toggleScheduleComplete(id: string, isCompleted: boolean): Promise<Schedule> {
  const { data, error } = await supabase
    .from('schedules')
    .update({ is_completed: isCompleted })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// 현장 메트릭스 계산
// =============================================

export async function getSiteWithMetrics(siteId: string): Promise<SiteWithMetrics | null> {
  // 현장 정보
  const site = await getSiteById(siteId);
  if (!site) return null;

  // 일일보고 (인건비)
  const dailyReports = await getDailyReports(siteId);
  const totalLaborCost = dailyReports.reduce((sum, r) => sum + r.labor_cost, 0);

  // 실행 비용
  const executionCosts = await getExecutionCosts(siteId);
  const totalMaterialCost = executionCosts
    .filter(c => c.category === 'MATERIAL')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalOutsourceCost = executionCosts
    .filter(c => c.category === 'OUTSOURCE')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalOtherCost = executionCosts
    .filter(c => c.category === 'OTHER')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalExecutionCost = totalLaborCost + totalMaterialCost + totalOutsourceCost + totalOtherCost;
  const remainingBudget = site.budget_amount - totalExecutionCost;
  const marginRate = site.budget_amount > 0 
    ? ((site.budget_amount - totalExecutionCost) / site.budget_amount) * 100 
    : 0;

  // D-Day 계산
  let dDay: number | null = null;
  if (site.deadline) {
    const today = new Date();
    const deadline = new Date(site.deadline);
    dDay = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  // 위험도 판단
  let riskLevel: 'SAFE' | 'WARNING' | 'DANGER' = 'SAFE';
  if (marginRate < 5 || remainingBudget < 0) {
    riskLevel = 'DANGER';
  } else if (marginRate < 15) {
    riskLevel = 'WARNING';
  }

  return {
    ...site,
    total_labor_cost: totalLaborCost,
    total_material_cost: totalMaterialCost,
    total_outsource_cost: totalOutsourceCost,
    total_other_cost: totalOtherCost,
    total_execution_cost: totalExecutionCost,
    remaining_budget: remainingBudget,
    margin_rate: marginRate,
    d_day: dDay,
    risk_level: riskLevel,
  };
}

// 모든 현장의 메트릭스 조회
export async function getAllSitesWithMetrics(): Promise<SiteWithMetrics[]> {
  const sites = await getSites();
  const results = await Promise.all(
    sites.map(site => getSiteWithMetrics(site.id))
  );
  return results.filter((s): s is SiteWithMetrics => s !== null);
}
