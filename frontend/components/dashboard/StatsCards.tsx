import React from 'react';
import { Users, DollarSign, Briefcase, CalendarCheck, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { RSVPStats, BudgetStats } from '@/types/dashboard';
import { 
  formatRupiah, 
  calculateRSVPPercentage, 
  calculateBudgetPercentage, 
  calculateRemainingBudget 
} from '@/lib/dashboard-utils';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Tamu & RSVP Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Tamu &amp; RSVP
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {rsvp.attending}
          </span>
          <span className="text-xs text-zinc-500">
            dari {rsvp.totalInvited} undangan
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
            <span>Konfirmasi Hadir</span>
            <span className="font-semibold text-rose-600">{rsvpPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500" 
              style={{ width: `${rsvpPercentage}%` }}
            />
          </div>
        </div>

        {/* Sub-pills */}
        <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] dark:border-zinc-800/80">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> {rsvp.attending} Hadir
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <Clock className="h-3.5 w-3.5" /> {rsvp.pending} Menunggu
          </span>
          <span className="flex items-center gap-1 text-zinc-400 font-medium">
            <XCircle className="h-3.5 w-3.5" /> {rsvp.declined} Batal
          </span>
        </div>
      </div>

      {/* 2. Anggaran Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Anggaran Terpakai
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {formatRupiah(budget.totalSpent)}
          </span>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total Target: {formatRupiah(budget.totalBudget)}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
            <span>Realisasi</span>
            <span className="font-semibold text-amber-600">{budgetPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" 
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] text-zinc-500 dark:border-zinc-800/80">
          <span>Sisa Anggaran:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(remainingBudget)}
          </span>
        </div>
      </div>

      {/* 3. Kategori Pengeluaran & Vendor */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Kategori Vendor
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {budget.categories.length}
          </span>
          <span className="text-xs text-zinc-500">Kategori Aktif</span>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Gedung, Catering, MUA, Foto, Dekorasi
        </p>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Semua vendor utama terkontrak</span>
        </div>
      </div>

      {/* 4. Rangkaian Acara */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Rangkaian Acara
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {totalEvents}
          </span>
          <span className="text-xs text-zinc-500">Sesi Terjadwal</span>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Akad Nikah, Resepsi Siang &amp; Resepsi Malam
        </p>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Jadwal rundown sudah siap</span>
        </div>
      </div>
    </div>
  );
};
