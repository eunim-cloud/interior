/**
 * Supabase 샘플 데이터 삽입 스크립트
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lapruinyoqkerrfwbcjg.supabase.co';
const supabaseKey = 'sb_publishable_QO3TJMlPizPlcdiPPpsFrg_c_M2Px3l';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('🌱 샘플 데이터 삽입 중...\n');

  // 1. 인건비 단가 확인/삽입
  const { data: existingLaborTypes } = await supabase.from('labor_types').select('id');
  
  if (!existingLaborTypes || existingLaborTypes.length === 0) {
    console.log('📌 인건비 단가 데이터 삽입...');
    const { error } = await supabase.from('labor_types').insert([
      { name: '목수', daily_rate: 250000, description: '목공 작업' },
      { name: '전기기사', daily_rate: 280000, description: '전기 배선 작업' },
      { name: '설비기사', daily_rate: 270000, description: '배관/설비 작업' },
      { name: '도배사', daily_rate: 200000, description: '도배 작업' },
      { name: '타일공', daily_rate: 230000, description: '타일 시공' },
      { name: '페인트공', daily_rate: 200000, description: '페인트/도장 작업' },
      { name: '철거반', daily_rate: 180000, description: '철거 작업' },
      { name: '잡부', daily_rate: 150000, description: '보조 작업' },
    ]);
    if (error) console.log('  ❌ 에러:', error.message);
    else console.log('  ✅ 인건비 단가 삽입 완료');
  } else {
    console.log('✅ 인건비 단가 데이터 이미 존재 (' + existingLaborTypes.length + '개)');
  }

  // 2. 현장 데이터 확인/삽입
  const { data: existingSites } = await supabase.from('sites').select('id');
  
  if (!existingSites || existingSites.length === 0) {
    console.log('📌 현장 데이터 삽입...');
    const { data: sites, error } = await supabase.from('sites').insert([
      {
        name: '서초구 반포 자이 인테리어',
        address: '서울시 서초구 반포동 123-45',
        client_name: '김철수',
        client_phone: '010-1234-5678',
        contract_amount: 150000000,
        budget_amount: 120000000,
        start_date: '2024-03-01',
        deadline: '2024-04-15',
        status: 'ACTIVE',
        crew_team: 'A팀',
      },
      {
        name: '마포구 연남동 상가 리노베이션',
        address: '서울시 마포구 연남동 456-78',
        client_name: '이영희',
        client_phone: '010-2345-6789',
        contract_amount: 80000000,
        budget_amount: 65000000,
        start_date: '2024-02-15',
        deadline: '2024-03-30',
        status: 'ACTIVE',
        crew_team: 'B팀',
      },
      {
        name: '강남구 역삼 오피스 빌딩 4F',
        address: '서울시 강남구 역삼동 789-10',
        client_name: '박지성',
        client_phone: '010-3456-7890',
        contract_amount: 200000000,
        budget_amount: 160000000,
        start_date: '2024-01-10',
        deadline: '2024-02-28',
        status: 'COMPLETED',
        crew_team: 'A팀',
      },
    ]).select();
    
    if (error) {
      console.log('  ❌ 에러:', error.message);
    } else {
      console.log('  ✅ 현장 데이터 삽입 완료 (' + sites?.length + '개)');
      
      // 3. 실행 비용 데이터 삽입
      if (sites && sites.length > 0) {
        console.log('📌 실행 비용 데이터 삽입...');
        const { error: costError } = await supabase.from('execution_costs').insert([
          {
            site_id: sites[0].id,
            category: 'MATERIAL',
            amount: 8500000,
            description: '창호 자재 대금',
            cost_date: '2024-03-05',
          },
          {
            site_id: sites[0].id,
            category: 'OTHER',
            amount: 150000,
            description: '폐기물 처리',
            cost_date: '2024-03-08',
          },
          {
            site_id: sites[1].id,
            category: 'MATERIAL',
            amount: 12000000,
            description: '주방 가구 선결제',
            cost_date: '2024-02-20',
          },
          {
            site_id: sites[2].id,
            category: 'MATERIAL',
            amount: 55000000,
            description: '내장재 전체',
            cost_date: '2024-01-15',
          },
        ]);
        if (costError) console.log('  ❌ 에러:', costError.message);
        else console.log('  ✅ 실행 비용 삽입 완료');

        // 4. 입금 내역 삽입
        console.log('📌 입금 내역 데이터 삽입...');
        const { error: paymentError } = await supabase.from('payments').insert([
          {
            site_id: sites[0].id,
            payment_type: 'DEPOSIT',
            amount: 45000000,
            payment_date: '2024-03-01',
            description: '착수금 입금',
          },
          {
            site_id: sites[1].id,
            payment_type: 'INTERIM',
            amount: 28000000,
            payment_date: '2024-02-15',
            description: '1차 중도금',
          },
          {
            site_id: sites[2].id,
            payment_type: 'FINAL',
            amount: 200000000,
            payment_date: '2024-01-10',
            description: '전체 공사 대금 완납',
          },
        ]);
        if (paymentError) console.log('  ❌ 에러:', paymentError.message);
        else console.log('  ✅ 입금 내역 삽입 완료');
      }
    }
  } else {
    console.log('✅ 현장 데이터 이미 존재 (' + existingSites.length + '개)');
  }

  // 최종 확인
  console.log('\n📊 최종 데이터 현황:');
  const tables = ['labor_types', 'sites', 'daily_reports', 'execution_costs', 'payments'];
  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(`  - ${table}: ${count || 0}개`);
  }
  
  console.log('\n✅ 샘플 데이터 설정 완료!');
}

seedData();
