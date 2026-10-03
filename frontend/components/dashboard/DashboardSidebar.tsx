'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  CheckSquare,
  ExternalLink,
  Settings,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { UserSession, WeddingSummary } from '@/types/dashboard';
import { calculateDaysRemaining } from '@/lib/dashboard-utils';

interface DashboardSidebarProps {
  user: UserSession;
  wedding: WeddingSummary;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  totalEvents?: number;
  checklistProgress?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  wedding,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  totalEvents = 3,
  checklistProgress = '2/5',
}) => {
  const daysRemaining = calculateDaysRemaining(wedding.weddingDate);

  const mainNavItems = [
    {
      id: 'overview',
      label: 'Ringkasan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'guests',
      label: 'Tamu & RSVP',
      icon: Users,
      badge: '350',
    },
    {
      id: 'budget',
      label: 'Anggaran',
      icon: DollarSign,
      badge: '64%',
    },
    {
      id: 'schedule',
      label: 'Jadwal & Acara',
      icon: Calendar,
      badge: `${totalEvents} Sesi`,
    },
    {
      id: 'checklist',
      label: 'Checklist',
      icon: CheckSquare,
      badge: checklistProgress,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-stone-200/70 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Header & Brand */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-champagne-light/50 bg-ivory-50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne bg-gradient-to-br from-ivory-50 to-ivory-200 text-champagne-dark font-serif text-2xl font-bold shadow-xs transition-transform group-hover:scale-105">
              J
            </div>
            <div>
              <span className="font-cormorant text-2xl tracking-[0.16em] uppercase font-semibold text-charcoal-900 leading-tight block">
                JadiSah
              </span>
              <span className="block text-[9px] uppercase tracking-[0.28em] font-semibold text-champagne-dark">
                Wedding Atelier
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal-500 hover:bg-ivory-200 hover:text-charcoal-900 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2. Couple & Countdown Box */}
        <div className="p-4 bg-ivory-50 border-b border-champagne-light/50">
          <div className="rounded-2xl border border-champagne-light/60 bg-ivory-100/90 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-champagne-dark">
                Atelier Pernikahan
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ivory-50 border border-champagne-light text-charcoal-700">
                {user.role}
              </span>
            </div>
            <p className="mt-1 font-serif font-bold text-base text-charcoal-900 truncate">
              {wedding.brideName} &amp; {wedding.groomName}
            </p>
            <p className="text-[11px] text-champagne-dark font-serif italic">
              {new Date(wedding.weddingDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage"></span>
              <span className="text-[10px] text-charcoal-600 font-medium">
                {daysRemaining} hari menuju hari-H
              </span>
            </div>
          </div>
        </div>

        {/* 3. Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-ivory-50">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-champagne-dark">
            Concierge Portal
          </p>

          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'sidebar-active bg-ivory-200 text-charcoal-900 border-l-[3px] border-champagne font-semibold shadow-2xs'
                      : 'text-charcoal-700 hover:bg-ivory-200/70 hover:text-charcoal-900'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? 'text-champagne-dark'
                          : 'text-champagne-dark/70 group-hover:text-champagne-dark'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                        isActive
                          ? 'bg-champagne-soft text-champagne-dark border border-champagne-light'
                          : 'bg-ivory-200/80 text-charcoal-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="my-4 border-t border-champagne-light/50" />

          {/* Quick Shortcuts */}
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-champagne-dark">
            Tautan Cepat
          </p>
          <div className="space-y-1">
            <Link
              href={`/invitation/${wedding.slug}`}
              target="_blank"
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal-700 hover:bg-ivory-200/70 hover:text-charcoal-900 transition"
            >
              <div className="flex items-center gap-3.5">
                <ExternalLink className="h-4 w-4 text-champagne-dark" />
                <span>Undangan Publik</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-400" />
            </Link>

            <button
              onClick={() => onTabChange('overview')}
              className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-charcoal-700 hover:bg-ivory-200/70 hover:text-charcoal-900 transition"
            >
              <div className="flex items-center gap-3.5">
                <Settings className="h-4 w-4 text-champagne-dark" />
                <span>Pengaturan Acara</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-charcoal-400" />
            </button>
          </div>
        </div>

        {/* 4. Bottom User Footer */}
        <div className="border-t border-champagne-light/50 bg-ivory-100/50 p-4 space-y-3">
          <div className="p-3 rounded-2xl bg-ivory-50 border border-champagne-light flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light flex items-center justify-center text-champagne-dark font-serif font-bold text-xs shrink-0">
                {user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="truncate text-left">
                <p className="truncate text-xs font-bold text-charcoal-900 leading-tight">
                  {user.fullName}
                </p>
                <p className="truncate text-[10px] text-charcoal-500">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-champagne-soft text-champagne-dark transition"
              title="Keluar"
              aria-label="Keluar dari akun"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
