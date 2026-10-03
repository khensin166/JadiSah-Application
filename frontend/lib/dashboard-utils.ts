/**
 * Formatting and calculation utilities for Wedding Dashboard
 */

/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 150000000 -> "Rp 150.000.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, ' ');
}

/**
 * Calculate RSVP attendance percentage
 */
export function calculateRSVPPercentage(attending: number, total: number): number {
  if (!total || total <= 0) return 0;
  const percentage = (attending / total) * 100;
  return Math.min(100, Math.round(percentage * 10) / 10);
}

/**
 * Calculate remaining budget
 */
export function calculateRemainingBudget(totalBudget: number, totalSpent: number): number {
  return Math.max(0, totalBudget - totalSpent);
}

/**
 * Calculate budget spent percentage
 */
export function calculateBudgetPercentage(totalSpent: number, totalBudget: number): number {
  if (!totalBudget || totalBudget <= 0) return 0;
  const percentage = (totalSpent / totalBudget) * 100;
  return Math.min(100, Math.round(percentage * 10) / 10);
}

export interface CountdownTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Calculate countdown days remaining until wedding
 */
export function calculateDaysRemaining(targetDateStr: string, currentDate: Date = new Date()): number {
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Calculate detailed countdown (days, hours, minutes, seconds) remaining until wedding
 */
export function calculateDetailedCountdown(
  targetDateStr: string,
  currentDate: Date = new Date()
): CountdownTimeRemaining {
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - currentDate.getTime();

  if (diffTime <= 0 || isNaN(diffTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffTime / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Format event time range cleanly
 * e.g. ("08:00 WIB", "10:00 WIB") -> "08:00 - 10:00 WIB"
 */
export function formatEventTimeRange(startTime: string, endTime?: string): string {
  if (!startTime) return '';
  if (!endTime || endTime.trim().toLowerCase() === 'selesai') {
    return `${startTime} - Selesai`;
  }
  const cleanStart = startTime.replace(/\s*WIB/i, '').trim();
  const cleanEnd = endTime.replace(/\s*WIB/i, '').trim();
  return `${cleanStart} - ${cleanEnd} WIB`;
}

const INDO_MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5,
  jul: 6, agt: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11,
};

/**
 * Parse Indonesian or ISO date string into a Date object
 * e.g. "5 Okt 2026", "2026-10-05"
 */
export function parseTaskDueDate(dueDateStr: string): Date | null {
  if (!dueDateStr || typeof dueDateStr !== 'string') return null;
  const trimmed = dueDateStr.trim();
  if (trimmed.toLowerCase() === 'fleksibel') return null;

  // Try parsing Indonesian format: "5 Okt 2026" or "05 Oktober 2026"
  const match = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthKey = match[2].toLowerCase().substring(0, 3);
    const year = parseInt(match[3], 10);
    const month = INDO_MONTH_MAP[monthKey];
    if (month !== undefined) {
      return new Date(year, month, day);
    }
  }

  // Fallback to standard Date parsing
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export type TimeWindowFilter = 'all' | 'this-month' | '2-months' | '3-months';

/**
 * Check if a task's due date falls within the specified time window
 * - 'all': includes all tasks
 * - 'this-month': tasks due in the current reference calendar month
 * - '2-months': tasks due within current month and the next month (2 calendar months)
 * - '3-months': tasks due within current month and the next 2 months (3 calendar months)
 */
export function isTaskInTimeWindow(
  dueDateStr: string,
  filter: TimeWindowFilter,
  referenceDate: Date = new Date()
): boolean {
  if (filter === 'all') return true;

  const taskDate = parseTaskDueDate(dueDateStr);
  if (!taskDate) {
    // Tasks without specific date (e.g. 'Fleksibel') are only included in 'all'
    return false;
  }

  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();
  const taskYear = taskDate.getFullYear();
  const taskMonth = taskDate.getMonth();

  // Calculate month difference
  const monthDiff = (taskYear - refYear) * 12 + (taskMonth - refMonth);

  if (filter === 'this-month') {
    return monthDiff === 0;
  }
  if (filter === '2-months') {
    return monthDiff >= 0 && monthDiff <= 1;
  }
  if (filter === '3-months') {
    return monthDiff >= 0 && monthDiff <= 2;
  }

  return true;
}
