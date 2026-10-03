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

/**
 * Calculate countdown days remaining until wedding
 */
export function calculateDaysRemaining(targetDateStr: string, currentDate: Date = new Date()): number {
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
