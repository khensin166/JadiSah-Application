'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bell, ExternalLink, Calendar, Users, DollarSign, CheckSquare, Sparkles } from 'lucide-react';
import { UserSession } from '@/types/dashboard';

interface DashboardNavbarProps {
  user: UserSession;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  user,
  activeTab,
  onTabChange,
}) => {
  const navTabs = [
    { id: 'overview', label: 'Ringkasan', icon: Sparkles },
    { id: 'guests', label: 'Tamu & RSVP', icon: Users },
    { id: 'budget', label: 'Anggaran', icon: DollarSign },
    { id: 'schedule', label: 'Jadwal & Acara', icon: Calendar },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 transition-transform group-hover:scale-105 dark:shadow-none">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                JadiSah
              </span>
              <span className="ml-1.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600 border border-rose-200 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs dark:bg-rose-950/60 dark:text-rose-300'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/invitation/sarah-dimas"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 px-3 py-1.5 rounded-lg border border-rose-200/80 transition-colors dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300"
          >
            <span>Undangan Publik</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            className="relative rounded-full p-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              SD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                {user.fullName}
              </p>
              <p className="text-[10px] text-zinc-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-rose-50 dark:border-zinc-800 gap-1 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950 dark:text-rose-300'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
