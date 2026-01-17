-- =============================================
-- 인테리어 현장관리 서비스 - Supabase 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- =============================================

-- =============================================
-- 1. 인건비 단가 (Labor Types)
-- =============================================
CREATE TABLE IF NOT EXISTS labor_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 예: "목수", "전기기사", "도배사"
  daily_rate INTEGER NOT NULL,           -- 일당 (원)
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 인건비 단가 데이터 삽입
INSERT INTO labor_types (name, daily_rate, description) VALUES
  ('목수', 250000, '목공 작업'),
  ('전기기사', 280000, '전기 배선 작업'),
  ('설비기사', 270000, '배관/설비 작업'),
  ('도배사', 200000, '도배 작업'),
  ('타일공', 230000, '타일 시공'),
  ('페인트공', 200000, '페인트/도장 작업'),
  ('철거반', 180000, '철거 작업'),
  ('잡부', 150000, '보조 작업');

-- =============================================
-- 2. 현장/프로젝트 (Sites)
-- =============================================
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 현장명
  address TEXT,                          -- 주소
  client_name TEXT,                      -- 고객명
  client_phone TEXT,                     -- 고객 연락처
  
  -- 금액 정보
  contract_amount INTEGER NOT NULL,      -- 계약 금액 (도급액)
  budget_amount INTEGER NOT NULL,        -- 실행 예산 (목표 비용)
  
  -- 일정
  start_date DATE NOT NULL,
  deadline DATE,                         -- 준공 예정일
  completed_at TIMESTAMPTZ,              -- 실제 완료일
  
  -- 상태
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED')),
  
  -- 담당 팀
  crew_team TEXT,                        -- 담당 시공팀명
  
  -- 메모
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. 일일보고 (Daily Reports)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  report_date DATE NOT NULL,             -- 보고 날짜
  work_content TEXT NOT NULL,            -- 작업 내용
  labor_cost INTEGER NOT NULL DEFAULT 0, -- 당일 인건비 합계 (계산된 값)
  
  -- 사진
  photos TEXT[],                         -- 사진 URL 배열 (Supabase Storage)
  
  -- 메모
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(site_id, report_date)           -- 현장당 하루에 하나의 보고
);

-- =============================================
-- 4. 투입 인원 (Crew Entries) - 일일보고의 상세
-- =============================================
CREATE TABLE IF NOT EXISTS crew_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_report_id UUID NOT NULL REFERENCES daily_reports(id) ON DELETE CASCADE,
  labor_type_id UUID NOT NULL REFERENCES labor_types(id),
  
  labor_type_name TEXT NOT NULL,         -- 직종명 (스냅샷)
  count INTEGER NOT NULL DEFAULT 1,      -- 투입 인원 수
  daily_rate INTEGER NOT NULL,           -- 적용 단가 (당시 단가 스냅샷)
  total_cost INTEGER NOT NULL,           -- count * daily_rate
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 실행 비용 (Execution Costs) - 자재비, 외주비 등
-- =============================================
CREATE TABLE IF NOT EXISTS execution_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  category TEXT NOT NULL CHECK (category IN ('MATERIAL', 'OUTSOURCE', 'OTHER')),
  -- MATERIAL: 자재비, OUTSOURCE: 외주비, OTHER: 기타
  
  amount INTEGER NOT NULL,               -- 금액
  description TEXT NOT NULL,             -- 내용
  cost_date DATE NOT NULL,               -- 비용 발생일
  
  -- 증빙
  receipt_url TEXT,                      -- 영수증/세금계산서 이미지
  vendor_name TEXT,                      -- 거래처명
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. 입금 내역 (Payments) - 고객으로부터 받은 금액
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  payment_type TEXT NOT NULL CHECK (payment_type IN ('DEPOSIT', 'INTERIM', 'FINAL', 'OTHER')),
  -- DEPOSIT: 착수금, INTERIM: 중도금, FINAL: 잔금, OTHER: 기타
  
  amount INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. 일정/스케줄 (Schedules)
-- =============================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  
  schedule_date DATE NOT NULL,
  title TEXT NOT NULL,                   -- 일정 제목
  content TEXT,                          -- 상세 내용
  
  schedule_type TEXT DEFAULT 'WORK' CHECK (schedule_type IN ('WORK', 'INSPECTION', 'MEETING', 'DELIVERY', 'OTHER')),
  -- WORK: 작업, INSPECTION: 검수, MEETING: 미팅, DELIVERY: 자재입고, OTHER: 기타
  
  is_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 인덱스 (성능 최적화)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_daily_reports_site ON daily_reports(site_id);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_crew_entries_report ON crew_entries(daily_report_id);
CREATE INDEX IF NOT EXISTS idx_execution_costs_site ON execution_costs(site_id);
CREATE INDEX IF NOT EXISTS idx_execution_costs_date ON execution_costs(cost_date);
CREATE INDEX IF NOT EXISTS idx_payments_site ON payments(site_id);
CREATE INDEX IF NOT EXISTS idx_schedules_site_date ON schedules(site_id, schedule_date);

-- =============================================
-- 트리거: updated_at 자동 갱신
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_daily_reports_updated_at ON daily_reports;
CREATE TRIGGER update_daily_reports_updated_at
  BEFORE UPDATE ON daily_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS (Row Level Security) - 기본 정책
-- 개발 단계에서는 비활성화, 프로덕션에서 활성화 권장
-- =============================================
-- ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE execution_costs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능 (개발용)
-- CREATE POLICY "Allow all" ON sites FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON daily_reports FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON execution_costs FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON payments FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON schedules FOR ALL USING (true);

-- =============================================
-- 샘플 데이터 (테스트용)
-- =============================================
INSERT INTO sites (name, address, client_name, contract_amount, budget_amount, start_date, deadline, status, crew_team) VALUES
  ('서초구 반포 자이 인테리어', '서울시 서초구 반포동 123-45', '김철수', 150000000, 120000000, '2024-03-01', '2024-04-15', 'ACTIVE', 'A팀'),
  ('마포구 연남동 상가 리노베이션', '서울시 마포구 연남동 456-78', '이영희', 80000000, 65000000, '2024-02-15', '2024-03-30', 'ACTIVE', 'B팀'),
  ('강남구 역삼 오피스 빌딩 4F', '서울시 강남구 역삼동 789-10', '박지성', 200000000, 160000000, '2024-01-10', '2024-02-28', 'COMPLETED', 'A팀');
