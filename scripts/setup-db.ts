/**
 * Supabase 데이터베이스 초기 설정 스크립트
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lapruinyoqkerrfwbcjg.supabase.co';
const supabaseKey = 'sb_publishable_QO3TJMlPizPlcdiPPpsFrg_c_M2Px3l';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log('🔍 Supabase 연결 확인 중...\n');
  
  // 테이블 존재 여부 확인
  const tables = ['labor_types', 'sites', 'daily_reports', 'crew_entries', 'execution_costs', 'payments', 'schedules'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table}: 테이블이 없거나 접근 불가`);
    } else {
      console.log(`✅ ${table}: 테이블 존재 (${count}개 레코드)`);
    }
  }
  
  console.log('\n----------------------------------------');
  console.log('📋 테이블이 없다면 아래 단계를 따라주세요:');
  console.log('1. https://supabase.com/dashboard 접속');
  console.log('2. 프로젝트 선택');
  console.log('3. SQL Editor 메뉴 클릭');
  console.log('4. New query 클릭');
  console.log('5. supabase/schema.sql 내용 붙여넣기');
  console.log('6. Run 버튼 클릭');
  console.log('----------------------------------------\n');
}

checkConnection();
