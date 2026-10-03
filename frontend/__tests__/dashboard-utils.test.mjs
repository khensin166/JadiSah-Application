import test from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of dashboard utility functions
import {
  formatRupiah,
  calculateRSVPPercentage,
  calculateBudgetPercentage,
  calculateRemainingBudget,
  calculateDaysRemaining,
  calculateDetailedCountdown,
  formatEventTimeRange,
  parseTaskDueDate,
  isTaskInTimeWindow,
} from '../lib/dashboard-utils.ts';

test('Dashboard Utils - formatRupiah', async (t) => {
  await t.test('formats numbers into Indonesian Rupiah format', () => {
    const formatted = formatRupiah(150000000);
    assert.match(formatted, /Rp/);
    assert.match(formatted, /150\.000\.000/);
  });

  await t.test('handles zero and null/undefined gracefully', () => {
    assert.match(formatRupiah(0), /Rp/);
    assert.equal(formatRupiah(NaN), 'Rp 0');
  });
});

test('Dashboard Utils - calculateRSVPPercentage', async (t) => {
  await t.test('calculates correct percentage', () => {
    const result = calculateRSVPPercentage(245, 350);
    assert.equal(result, 70);
  });

  await t.test('handles edge case when total is 0', () => {
    const result = calculateRSVPPercentage(0, 0);
    assert.equal(result, 0);
  });
});

test('Dashboard Utils - calculateBudgetPercentage and Remaining', async (t) => {
  await t.test('calculates remaining budget accurately', () => {
    const remaining = calculateRemainingBudget(175000000, 112500000);
    assert.equal(remaining, 62500000);
  });

  await t.test('calculates budget spent percentage', () => {
    const percentage = calculateBudgetPercentage(112500000, 175000000);
    assert.equal(percentage, 64.3);
  });
});

test('Dashboard Utils - calculateDaysRemaining', async (t) => {
  await t.test('calculates remaining days correctly between two dates', () => {
    const futureDate = '2026-12-12';
    const fakeCurrentDate = new Date('2026-10-01T00:00:00Z');
    const days = calculateDaysRemaining(futureDate, fakeCurrentDate);
    assert.ok(days > 0, 'Days remaining should be positive');
  });
});

test('Dashboard Utils - calculateDetailedCountdown', async (t) => {
  await t.test('calculates days, hours, minutes, seconds accurately', () => {
    const targetDate = '2026-10-03T14:30:45.000Z';
    const currentDate = new Date('2026-10-01T10:00:00.000Z');
    const result = calculateDetailedCountdown(targetDate, currentDate);

    assert.equal(result.days, 2);
    assert.equal(result.hours, 4);
    assert.equal(result.minutes, 30);
    assert.equal(result.seconds, 45);
    assert.equal(result.isExpired, false);
  });

  await t.test('handles expired target date cleanly', () => {
    const pastDate = '2026-09-01T00:00:00.000Z';
    const currentDate = new Date('2026-10-01T00:00:00.000Z');
    const result = calculateDetailedCountdown(pastDate, currentDate);

    assert.equal(result.days, 0);
    assert.equal(result.hours, 0);
    assert.equal(result.minutes, 0);
    assert.equal(result.seconds, 0);
    assert.equal(result.isExpired, true);
  });
});

test('Dashboard Utils - formatEventTimeRange', async (t) => {
  await t.test('formats start and end time range with WIB', () => {
    const range = formatEventTimeRange('08:00 WIB', '10:30 WIB');
    assert.equal(range, '08:00 - 10:30 WIB');
  });

  await t.test('handles single start time with Selesai', () => {
    const range = formatEventTimeRange('19:00 WIB', 'Selesai');
    assert.equal(range, '19:00 WIB - Selesai');
  });
});

test('Dashboard Utils - parseTaskDueDate', async (t) => {
  await t.test('parses Indonesian date format correctly', () => {
    const date = parseTaskDueDate('5 Okt 2026');
    assert.ok(date !== null);
    assert.equal(date.getFullYear(), 2026);
    assert.equal(date.getMonth(), 9); // October is month 9 (0-indexed)
    assert.equal(date.getDate(), 5);
  });

  await t.test('returns null for Fleksibel or invalid input', () => {
    assert.equal(parseTaskDueDate('Fleksibel'), null);
    assert.equal(parseTaskDueDate(''), null);
  });
});

test('Dashboard Utils - isTaskInTimeWindow', async (t) => {
  const refDate = new Date('2026-10-01T00:00:00Z');

  await t.test('all includes everything', () => {
    assert.equal(isTaskInTimeWindow('5 Okt 2026', 'all', refDate), true);
    assert.equal(isTaskInTimeWindow('Fleksibel', 'all', refDate), true);
  });

  await t.test('this-month includes only current month', () => {
    assert.equal(isTaskInTimeWindow('15 Okt 2026', 'this-month', refDate), true);
    assert.equal(isTaskInTimeWindow('1 Nov 2026', 'this-month', refDate), false);
  });

  await t.test('2-months includes current and next month', () => {
    assert.equal(isTaskInTimeWindow('15 Okt 2026', '2-months', refDate), true);
    assert.equal(isTaskInTimeWindow('10 Nov 2026', '2-months', refDate), true);
    assert.equal(isTaskInTimeWindow('12 Des 2026', '2-months', refDate), false);
  });

  await t.test('3-months includes up to 3 months', () => {
    assert.equal(isTaskInTimeWindow('15 Okt 2026', '3-months', refDate), true);
    assert.equal(isTaskInTimeWindow('10 Nov 2026', '3-months', refDate), true);
    assert.equal(isTaskInTimeWindow('12 Des 2026', '3-months', refDate), true);
    assert.equal(isTaskInTimeWindow('5 Jan 2027', '3-months', refDate), false);
  });
});
