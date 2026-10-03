import React from 'react';
import { PieChart, ArrowUpRight } from 'lucide-react';
import { BudgetStats } from '@/types/dashboard';
import { formatRupiah, calculateBudgetPercentage } from '@/lib/dashboard-utils';

interface BudgetOverviewCardProps {
  budget: BudgetStats;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ budget }) => {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Alokasi &amp; Realisasi Anggaran
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Rincian per pos pengeluaran pernikahan
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <PieChart className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {budget.categories.map((cat) => {
          const percentage = calculateBudgetPercentage(cat.spentAmount, cat.allocatedAmount);
          const isNearLimit = percentage >= 80;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {cat.name}
                </span>
                <div className="text-right">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {formatRupiah(cat.spentAmount)}
                  </span>
                  <span className="text-zinc-400 text-[11px] ml-1">
                    / {formatRupiah(cat.allocatedAmount)}
                  </span>
                </div>
              </div>

              {/* Category Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isNearLimit
                      ? 'bg-rose-500'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>{percentage}% terealisasi</span>
                <span>
                  Sisa: {formatRupiah(cat.allocatedAmount - cat.spentAmount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl bg-amber-50/80 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center justify-between">
        <span>💡 Pengeluaran aman dan masih sesuai alokasi rencana awal.</span>
        <button 
          type="button" 
          aria-label="Lihat Laporan Lengkap Anggaran"
          className="text-amber-900 dark:text-amber-200 hover:underline flex items-center gap-0.5 font-semibold shrink-0 ml-2"
        >
          <span>Detail</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
