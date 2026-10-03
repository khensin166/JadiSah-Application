// Types matching database schema in docs/database.md

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: 'owner' | 'editor';
}

export interface WeddingSummary {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  venueName: string;
  slug: string;
}

export interface RSVPStats {
  totalInvited: number;
  attending: number;
  declined: number;
  pending: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  icon?: string;
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export type GuestStatus = 'attending' | 'declined' | 'invited';

export interface GuestItem {
  id: string;
  name: string;
  groupName: string;
  email?: string;
  phone?: string;
  status: GuestStatus;
  pax: number;
  updatedAt: string;
}

export interface WeddingEventItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ChecklistTask {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  isCompleted: boolean;
}
