import React from 'react';
import { Users, DollarSign, Briefcase, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { RSVPStats, BudgetStats } from '@/types/dashboard';
import { 
  formatRupiah, 
  calculateRSVPPercentage, 
  calculateBudgetPercentage, 
  calculateRemainingBudget 
} from '@/lib/dashboard-utils';
import { Card } from '@/components/ui/card';

interface StatsCardsProps {
  rsvp: RSVPStats;
  budget: BudgetStats;
  totalEvents: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ rsvp, budget, totalEvents }) => {
  const rsvpPercentage = calculateRSVPPercentage(rsvp.attending, rsvp.totalInvited);
  const budgetPercentage = calculateBudgetPercentage(budget.totalSpent, budget.totalBudget);
  const remainingBudget = calculateRemainingBudget(budget.totalBudget, budget.totalSpent);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Tamu & RSVP Card */}
      <Card className="p-5 rounded-2xl bg-ivory-50 border border-champagne-light/70 soft-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold">
              Tamu &amp; RSVP
            </span>
            <span className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light/50 flex items-center justify-center text-champagne-dark">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-cormorant text-3xl font-semibold text-charcoal-900">
                {rsvp.attending}
              </span>
              <span className="text-xs text-charcoal-500 font-normal">
                / {rsvp.totalInvited} undangan
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 mt-0.5">Tingkat konfirmasi kehadiran</p>

            <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden mt-3 flex">
              <div className="bg-sage h-full rounded-full transition-all duration-500" style={{ width: `${rsvpPercentage}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2.5 border-t border-champagne-light/40 flex items-center justify-between text-[10px] text-charcoal-500">
          <span className="text-sage-dark font-medium">{rsvp.attending} Hadir</span>
          <span>&bull;</span>
          <span>{rsvp.pending} Menunggu</span>
          <span>&bull;</span>
          <span>{rsvp.declined} Berhalangan</span>
        </div>
      </Card>

      {/* 2. Anggaran Terpakai Card */}
      <Card className="p-5 rounded-2xl bg-ivory-50 border border-champagne-light/70 soft-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold">
              Anggaran Disbursed
            </span>
            <span className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light/50 flex items-center justify-center text-champagne-dark">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>

          <div>
            <p className="font-cormorant text-2xl sm:text-3xl font-semibold text-charcoal-900 truncate">
              {formatRupiah(budget.totalSpent)}
            </p>
            <p className="text-[11px] text-charcoal-500 mt-0.5">
              Pagu Limit: {formatRupiah(budget.totalBudget)}
            </p>

            <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-champagne h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-[10px] text-sage-dark font-medium mt-4 pt-2.5 border-t border-champagne-light/40">
          Sisa Alokasi: {formatRupiah(remainingBudget)}
        </p>
      </Card>

      {/* 3. Kategori Vendor Card */}
      <Card className="p-5 rounded-2xl bg-ivory-50 border border-champagne-light/70 soft-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold">
              Vendor Atelier
            </span>
            <span className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light/50 flex items-center justify-center text-champagne-dark">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>

          <div>
            <p className="font-cormorant text-3xl font-semibold text-charcoal-900">
              {budget.categories.length} Pos
            </p>
            <p className="text-[11px] text-charcoal-500 mt-0.5 truncate">
              Gedung, Catering, MUA, Foto, Dekor
            </p>

            <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-champagne-dark h-full rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        <p className="text-[10px] text-champagne-dark font-medium mt-4 pt-2.5 border-t border-champagne-light/40">
          5 dari 5 Pos Kontrak Disetujui
        </p>
      </Card>

      {/* 4. Rangkaian Acara Card */}
      <Card className="p-5 rounded-2xl bg-ivory-50 border border-champagne-light/70 soft-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold">
              Master Rundown
            </span>
            <span className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light/50 flex items-center justify-center text-champagne-dark">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>

          <div>
            <p className="font-cormorant text-3xl font-semibold text-charcoal-900">
              {totalEvents} Sesi
            </p>
            <p className="text-[11px] text-charcoal-500 mt-0.5 truncate">
              Akad, Temu Manten &amp; Resepsi
            </p>

            <div className="w-full bg-ivory-200 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-sage h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <p className="text-[10px] text-charcoal-500 mt-4 pt-2.5 border-t border-champagne-light/40 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
          <span>Seluruh sesi telah terjadwal rapi</span>
        </p>
      </Card>
    </div>
  );
};
