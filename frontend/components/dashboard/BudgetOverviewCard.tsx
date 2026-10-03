import React from 'react';
import { PieChart, ArrowUpRight } from 'lucide-react';
import { BudgetStats } from '@/types/dashboard';
import { formatRupiah, calculateBudgetPercentage } from '@/lib/dashboard-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface BudgetOverviewCardProps {
  budget: BudgetStats;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ budget }) => {
  return (
    <Card className="rounded-3xl border border-champagne-light/70 bg-ivory-50 soft-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-champagne-light/60">
        <div>
          <CardTitle className="font-cormorant text-xl font-normal text-charcoal-900">
            Realisasi Anggaran
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs text-charcoal-500">
            Rincian per pos alokasi atelier pernikahan
          </CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-champagne-soft border border-champagne-light text-champagne-dark">
          <PieChart className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {budget.categories.map((cat) => {
          const percentage = calculateBudgetPercentage(cat.spentAmount, cat.allocatedAmount);
          const isNearLimit = percentage >= 80;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-charcoal-900">
                  {cat.name}
                </span>
                <div className="text-right">
                  <span className="font-semibold text-charcoal-900">
                    {formatRupiah(cat.spentAmount)}
                  </span>
                  <span className="text-charcoal-400 text-[10px] ml-1">
                    / {formatRupiah(cat.allocatedAmount)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <Progress
                value={percentage}
                indicatorClassName={
                  isNearLimit
                    ? 'bg-champagne-dark'
                    : 'bg-champagne'
                }
              />

              <div className="flex items-center justify-between text-[11px] text-charcoal-500">
                <span>{percentage}% terpakai</span>
                <span className="text-sage-dark font-medium">
                  Sisa: {formatRupiah(cat.allocatedAmount - cat.spentAmount)}
                </span>
              </div>
            </div>
          );
        })}

        <div className="mt-4 rounded-2xl bg-ivory-100 border border-champagne-light/60 p-3 text-xs text-charcoal-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block"></span>
            <span>Pengeluaran pos terencana dalam batas pagu.</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-champagne-dark text-xs px-2 gap-1 hover:bg-champagne-soft font-medium uppercase tracking-wider"
          >
            <span>Detail</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
