// Supabase Database Types
// 자동 생성된 타입 정의

export type SiteStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type CostCategory = 'MATERIAL' | 'OUTSOURCE' | 'OTHER';
export type PaymentType = 'DEPOSIT' | 'INTERIM' | 'FINAL' | 'OTHER';
export type ScheduleType = 'WORK' | 'INSPECTION' | 'MEETING' | 'DELIVERY' | 'OTHER';

export interface LaborType {
  id: string;
  name: string;
  daily_rate: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Site {
  id: string;
  name: string;
  address: string | null;
  client_name: string | null;
  client_phone: string | null;
  contract_amount: number;
  budget_amount: number;
  start_date: string;
  deadline: string | null;
  completed_at: string | null;
  status: SiteStatus;
  crew_team: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyReport {
  id: string;
  site_id: string;
  report_date: string;
  work_content: string;
  labor_cost: number;
  photos: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrewEntry {
  id: string;
  daily_report_id: string;
  labor_type_id: string;
  labor_type_name: string;
  count: number;
  daily_rate: number;
  total_cost: number;
  notes: string | null;
  created_at: string;
}

export interface ExecutionCost {
  id: string;
  site_id: string;
  category: CostCategory;
  amount: number;
  description: string;
  cost_date: string;
  receipt_url: string | null;
  vendor_name: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  site_id: string;
  payment_type: PaymentType;
  amount: number;
  payment_date: string;
  description: string | null;
  created_at: string;
}

export interface Schedule {
  id: string;
  site_id: string;
  schedule_date: string;
  title: string;
  content: string | null;
  schedule_type: ScheduleType;
  is_completed: boolean;
  created_at: string;
}

// 조인된 타입들
export interface DailyReportWithEntries extends DailyReport {
  crew_entries: CrewEntry[];
}

export interface SiteWithMetrics extends Site {
  total_labor_cost: number;
  total_material_cost: number;
  total_outsource_cost: number;
  total_other_cost: number;
  total_execution_cost: number;
  remaining_budget: number;
  margin_rate: number;
  d_day: number | null;
  risk_level: 'SAFE' | 'WARNING' | 'DANGER';
}

// Insert 타입들
export type SiteInsert = Omit<Site, 'id' | 'created_at' | 'updated_at'>;
export type DailyReportInsert = Omit<DailyReport, 'id' | 'created_at' | 'updated_at'>;
export type CrewEntryInsert = Omit<CrewEntry, 'id' | 'created_at'>;
export type ExecutionCostInsert = Omit<ExecutionCost, 'id' | 'created_at'>;
export type PaymentInsert = Omit<Payment, 'id' | 'created_at'>;
export type ScheduleInsert = Omit<Schedule, 'id' | 'created_at'>;

// Update 타입들
export type SiteUpdate = Partial<SiteInsert>;
export type DailyReportUpdate = Partial<DailyReportInsert>;
export type ExecutionCostUpdate = Partial<ExecutionCostInsert>;
export type PaymentUpdate = Partial<PaymentInsert>;
export type ScheduleUpdate = Partial<ScheduleInsert>;

// Supabase Database 스키마 타입
export interface Database {
  public: {
    Tables: {
      labor_types: {
        Row: LaborType;
        Insert: Omit<LaborType, 'id' | 'created_at'>;
        Update: Partial<Omit<LaborType, 'id' | 'created_at'>>;
      };
      sites: {
        Row: Site;
        Insert: SiteInsert;
        Update: SiteUpdate;
      };
      daily_reports: {
        Row: DailyReport;
        Insert: DailyReportInsert;
        Update: DailyReportUpdate;
      };
      crew_entries: {
        Row: CrewEntry;
        Insert: CrewEntryInsert;
        Update: Partial<CrewEntryInsert>;
      };
      execution_costs: {
        Row: ExecutionCost;
        Insert: ExecutionCostInsert;
        Update: ExecutionCostUpdate;
      };
      payments: {
        Row: Payment;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
      };
      schedules: {
        Row: Schedule;
        Insert: ScheduleInsert;
        Update: ScheduleUpdate;
      };
    };
  };
}
