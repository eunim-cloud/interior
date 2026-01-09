
export type Category = 'Material' | 'Labor' | 'Other' | 'Income';

export interface Transaction {
  id: string;
  projectId: string;
  type: 'INCOME' | 'EXPENSE';
  category: Category;
  amount: number;
  date: string;
  description: string;
}

export interface ScheduleItem {
  id: string;
  projectId: string;
  date: string;
  content: string;
  imageUrl?: string;
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface AppState {
  projects: Project[];
  transactions: Transaction[];
  schedules: ScheduleItem[];
}
