'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CountdownBanner } from '@/components/dashboard/CountdownBanner';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentGuestsTable } from '@/components/dashboard/RecentGuestsTable';
import { BudgetOverviewCard } from '@/components/dashboard/BudgetOverviewCard';
import { TimelineChecklist } from '@/components/dashboard/TimelineChecklist';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider } from '@/components/ui/sidebar';
import { WeddingEventItem, ChecklistTask } from '@/types/dashboard';
import {
  mockUser,
  mockWedding,
  mockRSVP,
  mockBudget,
  mockGuests,
  mockEvents,
  mockChecklist,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Lifted state for Rundown Events and Preparation Checklist
  const [events, setEvents] = useState<WeddingEventItem[]>(mockEvents);
  const [checklist, setChecklist] = useState<ChecklistTask[]>(mockChecklist);

  const handleAddEvent = (newEvent: WeddingEventItem) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setChecklist((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddTask = (newTask: ChecklistTask) => {
    setChecklist((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setChecklist((prev) => prev.filter((t) => t.id !== id));
  };

  const completedTasksCount = checklist.filter((t) => t.isCompleted).length;
  const checklistProgress = `${completedTasksCount}/${checklist.length}`;

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "18rem", "--sidebar-width-icon": "4rem" } as React.CSSProperties}
      className="flex min-h-screen bg-ivory-100 font-sans text-charcoal-800 antialiased selection:bg-champagne-light selection:text-charcoal-900"
    >
      {/* 1. Left Sidebar Navigation (Desktop & Mobile Drawer) */}
      <DashboardSidebar
        user={mockUser}
        wedding={mockWedding}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalEvents={events.length}
        checklistProgress={checklistProgress}
      />

      {/* 2. Right Main Application Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header App Bar */}
        <DashboardHeader
          wedding={mockWedding}
          activeTab={activeTab}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Hero Countdown Banner */}
          <CountdownBanner wedding={mockWedding} />

          {/* Tab 1: Ringkasan (Overview) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metrics Cards */}
              <StatsCards
                rsvp={mockRSVP}
                budget={mockBudget}
                totalEvents={events.length}
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

              {/* Bottom Section: Rundown & Interactive Checklist */}
              <TimelineChecklist
                events={events}
                tasks={checklist}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {/* Tab 2: Tamu & RSVP (Guests) */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              <StatsCards
                rsvp={mockRSVP}
                budget={mockBudget}
                totalEvents={events.length}
              />
              <RecentGuestsTable initialGuests={mockGuests} />
            </div>
          )}

          {/* Tab 3: Anggaran (Budget) */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <StatsCards
                rsvp={mockRSVP}
                budget={mockBudget}
                totalEvents={events.length}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetOverviewCard budget={mockBudget} />
                <Card className="rounded-3xl border border-champagne-light/70 bg-ivory-50 soft-shadow">
                  <CardHeader className="border-b border-champagne-light/60 p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-cormorant text-2xl font-normal text-charcoal-900">
                        Tips Alokasi Anggaran
                      </CardTitle>
                      <Badge variant="outline" className="bg-champagne-soft text-champagne-dark border border-champagne-light font-semibold">
                        Rekomendasi
                      </Badge>
                    </div>
                    <CardDescription className="mt-0.5 text-xs text-charcoal-500">
                      Strategi pengelolaan anggaran terbaik untuk atelier pernikahan Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3.5 text-xs text-charcoal-700">
                    <div className="p-4 bg-ivory-100/90 rounded-2xl border border-champagne-light/60">
                      <p className="font-serif font-bold text-sm text-charcoal-900">
                        1. Alokasi Dana Darurat (Emergency Fund)
                      </p>
                      <p className="mt-1 leading-relaxed text-charcoal-600">
                        Sisihkan 10% dari total pagu (Rp 17.500.000) untuk biaya tak terduga seperti tambahan porsi catering dan lembur kru venue.
                      </p>
                    </div>

                    <div className="p-4 bg-ivory-100/90 rounded-2xl border border-champagne-light/60">
                      <p className="font-serif font-bold text-sm text-charcoal-900">
                        2. Skema Retainer &amp; Pelunasan Vendor
                      </p>
                      <p className="mt-1 leading-relaxed text-charcoal-600">
                        Tahan pelunasan 15-20% untuk vendor fotografi &amp; dekorasi hingga hari H-1 atau setelah penyerahan album dan master video dokumentasi.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Tab 4 & 5: Jadwal & Checklist */}
          {(activeTab === 'schedule' || activeTab === 'checklist') && (
            <div className="space-y-6">
              <TimelineChecklist
                events={events}
                tasks={checklist}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}
        </main>

        {/* Application Footer */}
        <footer className="mt-auto border-t border-champagne-light/50 bg-ivory-50/70 py-6 px-4 sm:px-8 text-xs text-charcoal-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-wider text-charcoal-900">JADISAH</span>
            <span>&bull; Bespoke Wedding Management System</span>
          </div>
          <div>
            <span>Concierge Active &bull; Synced with {mockWedding.brideName} &amp; {mockWedding.groomName}</span>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}
