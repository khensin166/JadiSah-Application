'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { WeddingSummary } from '@/types/dashboard';

interface DashboardHeaderProps {
  wedding: WeddingSummary;
  activeTab: string;
  onToggleSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  wedding,
  activeTab,
  onToggleSidebar,
}) => {
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Ringkasan Pernikahan',
      subtitle: 'Semua informasi kunci dan progres acara Anda',
    },
    guests: {
      title: 'Daftar Tamu & RSVP',
      subtitle: 'Kelola daftar undangan dan pantau konfirmasi kehadiran',
    },
    budget: {
      title: 'Manajemen Anggaran',
      subtitle: 'Pantau pengeluaran dan serapan dana per kategori vendor',
    },
    schedule: {
      title: 'Jadwal & Rundown',
      subtitle: 'Susunan sesi acara mulai dari akad hingga resepsi',
    },
    checklist: {
      title: 'Checklist Persiapan',
      subtitle: 'Tugas-tugas yang harus diselesaikan menjelang hari-H',
    },
  };

  const current = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-champagne-light/60 bg-ivory-50/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="-ml-1 mr-2 text-charcoal-800 hover:bg-champagne/20" />

        <div className="flex flex-col">
          <div className="hidden sm:flex items-center gap-2 text-xs text-charcoal-500 font-medium">
            <span className="text-charcoal-400">Atelier</span>
            <span>/</span>
            <span className="text-charcoal-400">{wedding.brideName} &amp; {wedding.groomName}</span>
            <span>/</span>
            <span className="text-charcoal-900 font-semibold">{current.title}</span>
          </div>
          <h1 className="sm:hidden text-base font-bold tracking-tight text-charcoal-900">
            {current.title}
          </h1>
          <p className="hidden md:block text-[11px] text-charcoal-500 mt-0.5">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
          <Input
            type="text"
            placeholder="Cari fitur, tamu, vendor..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-ivory-100 border border-champagne-light text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-champagne/40"
          />
        </div>

        {/* Public Invitation Link Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hidden sm:inline-flex rounded-full border border-champagne-light bg-ivory-100/60 text-charcoal-700 hover:bg-champagne-soft text-xs font-semibold uppercase tracking-wider transition"
        >
          <Link href={`/invitation/${wedding.slug}`} target="_blank">
            <span>Undangan</span>
            <ExternalLink className="h-3.5 w-3.5 text-champagne-dark" />
          </Link>
        </Button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2.5 rounded-full border border-champagne-light hover:bg-ivory-100 transition text-charcoal-700"
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-champagne-gold" />
        </button>
      </div>
    </header>
  );
};
