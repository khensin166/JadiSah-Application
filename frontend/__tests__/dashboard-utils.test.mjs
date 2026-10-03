import test from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of dashboard utility functions
import {
  formatRupiah,
  calculateRSVPPercentage,
  calculateBudgetPercentage,
  calculateRemainingBudget,
  calculateDaysRemaining,
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
