
import { Project, Transaction, ScheduleItem } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: '서초구 반포 자이 인테리어',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    status: 'ACTIVE'
  },
  {
    id: 'p2',
    name: '마포구 연남동 상가 리노베이션',
    startDate: '2024-02-15',
    endDate: '2024-03-30',
    status: 'ACTIVE'
  },
  {
    id: 'p3',
    name: '강남구 역삼 오피스 빌딩 4F',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    status: 'COMPLETED'
  }
];

export const mockTransactions: Transaction[] = [
  { id: 't1', projectId: 'p1', type: 'INCOME', category: 'Income', amount: 45000000, date: '2024-03-01', description: '착수금 입금' },
  { id: 't2', projectId: 'p1', type: 'EXPENSE', category: 'Material', amount: 8500000, date: '2024-03-05', description: '창호 자재 대금' },
  { id: 't3', projectId: 'p1', type: 'EXPENSE', category: 'Labor', amount: 3200000, date: '2024-03-07', description: '철거 인건비' },
  { id: 't4', projectId: 'p1', type: 'EXPENSE', category: 'Other', amount: 150000, date: '2024-03-08', description: '폐기물 처리' },
  
  { id: 't5', projectId: 'p2', type: 'INCOME', category: 'Income', amount: 28000000, date: '2024-02-15', description: '1차 중도금' },
  { id: 't6', projectId: 'p2', type: 'EXPENSE', category: 'Material', amount: 12000000, date: '2024-02-20', description: '주방 가구 선결제' },
  
  { id: 't7', projectId: 'p3', type: 'INCOME', category: 'Income', amount: 120000000, date: '2024-01-10', description: '전체 공사 대금 완납' },
  { id: 't8', projectId: 'p3', type: 'EXPENSE', category: 'Material', amount: 55000000, date: '2024-01-15', description: '내장재 전체' },
  { id: 't9', projectId: 'p3', type: 'EXPENSE', category: 'Labor', amount: 25000000, date: '2024-02-20', description: '마감 인건비 일괄' }
];

export const mockSchedules: ScheduleItem[] = [
  { id: 's1', projectId: 'p1', date: '2024-03-05', content: '기존 창호 및 가구 철거 완료', note: '폐기물 반출 완료. 바닥 보양 필요.' },
  { id: 's2', projectId: 'p1', date: '2024-03-07', content: '전기 배선 기초 작업', note: '주방 위치 변경에 따른 배선 연장 완료.' },
  { id: 's3', projectId: 'p2', date: '2024-02-20', content: '목공 작업 시작', note: '가벽 설치 중.' }
];
