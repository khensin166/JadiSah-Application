'use client';

import React, { useState } from 'react';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { CountdownBanner } from '@/components/dashboard/CountdownBanner';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentGuestsTable } from '@/components/dashboard/RecentGuestsTable';
import { BudgetOverviewCard } from '@/components/dashboard/BudgetOverviewCard';
import { TimelineChecklist } from '@/components/dashboard/TimelineChecklist';
import { 
  mockUser, 
  mockWedding, 
  mockRSVP, 
  mockBudget, 
  mockGuests, 
  mockEvents, 
  mockChecklist 
} from '@/lib/mock-data';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* 1. Header / Navbar */}
      <DashboardNavbar
        user={mockUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Countdown Banner */}
        <CountdownBanner wedding={mockWedding} />

        {/* Dynamic Content Based on Tabs */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Metrics */}
            <StatsCards
              rsvp={mockRSVP}
              budget={mockBudget}
              totalEvents={mockEvents.length}
            />

            {/* Middle Section: Guests Table & Budget Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentGuestsTable initialGuests={mockGuests} />
              </div>
              <div className="lg:col-span-1">
                <BudgetOverviewCard budget={mockBudget} />
              </div>
            </div>

            {/* Bottom Section: Rundown & Checklist */}
            <TimelineChecklist
              events={mockEvents}
              initialChecklist={mockChecklist}
            />
          </>
        )}

        {activeTab === 'guests' && (
          <div className="space-y-6">
            <StatsCards
              rsvp={mockRSVP}
              budget={mockBudget}
              totalEvents={mockEvents.length}
            />
            <RecentGuestsTable initialGuests={mockGuests} />
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6">
            <StatsCards
              rsvp={mockRSVP}
              budget={mockBudget}
              totalEvents={mockEvents.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetOverviewCard budget={mockBudget} />
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Tips Efisiensi Anggaran
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Rekomendasi sistem JadiSah untuk pernikahan Sarah &amp; Dimas
                  </p>

                  <div className="mt-4 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 dark:border-zinc-800 dark:bg-zinc-800/40">
                      <p className="font-semibold text-rose-800 dark:text-rose-300">
                        1. Buffer Dana Tak Terduga
                      </p>
                      <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                        Siapkan cadangan kas minimal 10% dari total anggaran untuk antisipasi penambahan porsi catering di hari-H.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 dark:border-zinc-800 dark:bg-zinc-800/40">
                      <p className="font-semibold text-amber-800 dark:text-amber-300">
                        2. Pelunasan Bertahap Vendor
                      </p>
                      <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                        Pastikan sisa pelunasan vendor foto dan hiburan dibayarkan setelah H-1 atau serah terima hasil dokumentasi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
                  Data sinkron dengan perancangan schema: <code className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">budgets</code> &amp; <code className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">budget_categories</code>.
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'schedule' || activeTab === 'checklist') && (
          <div className="space-y-6">
            <TimelineChecklist
              events={mockEvents}
              initialChecklist={mockChecklist}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© 2026 JadiSah Wedding Planner Application. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Branch: <code className="font-semibold text-rose-600">feature/dahsboard-user</code></span>
            <span>App Router: <code className="font-mono text-[11px]">/dashboard</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
