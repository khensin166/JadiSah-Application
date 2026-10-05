'use client';

import React, { useState } from 'react';
import { Search, UserPlus, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import { GuestItem, GuestStatus } from '@/types/dashboard';

interface RecentGuestsTableProps {
  initialGuests: GuestItem[];
}

export const RecentGuestsTable: React.FC<RecentGuestsTableProps> = ({ initialGuests }) => {
  const [guests, setGuests] = useState<GuestItem[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GuestStatus>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('Keluarga');
  const [newGuestPax, setNewGuestPax] = useState(2);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: GuestItem = {
      id: `gst-${Date.now()}`,
      name: newGuestName,
      groupName: newGuestGroup,
      status: 'invited',
      pax: Number(newGuestPax) || 1,
      updatedAt: 'Baru saja',
    };

    setGuests([newGuest, ...guests]);
    setNewGuestName('');
    setShowAddForm(false);
  };

  const getStatusBadge = (status: GuestStatus) => {
    switch (status) {
      case 'attending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Hadir
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="h-3.5 w-3.5" />
            Batal
          </span>
        );
      case 'invited':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3.5 w-3.5" />
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Daftar Tamu &amp; Konfirmasi RSVP
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {filteredGuests.length} tamu sesuai filter pencarian
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari nama atau grup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-44 sm:w-56 rounded-xl border border-zinc-200 bg-zinc-50/50 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-rose-500"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 h-9 rounded-xl bg-rose-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Tambah Tamu</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-50/50 border-b border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800 text-xs overflow-x-auto">
        <span className="flex items-center gap-1 text-zinc-400 font-medium mr-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {(['all', 'attending', 'invited', 'declined'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              statusFilter === status
                ? 'bg-white shadow-xs text-rose-600 font-semibold dark:bg-zinc-800 dark:text-rose-400'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
            }`}
          >
            {status === 'all'
              ? 'Semua'
              : status === 'attending'
              ? 'Hadir'
              : status === 'invited'
              ? 'Menunggu'
              : 'Batal'}
          </button>
        ))}
      </div>

      {/* Add Guest Form Inline */}
      {showAddForm && (
        <form onSubmit={handleAddGuest} className="p-4 bg-rose-50/60 border-b border-rose-100 dark:bg-rose-950/20 dark:border-rose-900 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Nama Tamu (misal: Bpk. Andi)"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            className="h-8 flex-1 min-w-[200px] rounded-lg border border-rose-200 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-rose-800 dark:bg-zinc-800"
            required
          />
          <select
            value={newGuestGroup}
            onChange={(e) => setNewGuestGroup(e.target.value)}
            className="h-8 rounded-lg border border-rose-200 bg-white px-2.5 text-xs text-zinc-700 dark:border-rose-800 dark:bg-zinc-800 dark:text-zinc-200"
          >
            <option value="Keluarga">Keluarga</option>
            <option value="Sahabat">Sahabat</option>
            <option value="Rekan Kerja">Rekan Kerja</option>
            <option value="Relasi Bisnis">Relasi Bisnis</option>
          </select>
          <input
            type="number"
            min="1"
            max="10"
            value={newGuestPax}
            onChange={(e) => setNewGuestPax(Number(e.target.value))}
            className="h-8 w-16 rounded-lg border border-rose-200 bg-white px-2 text-xs text-center dark:border-rose-800 dark:bg-zinc-800"
            title="Jumlah Pax"
          />
          <button
            type="submit"
            className="h-8 rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="h-8 rounded-lg bg-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
          >
            Batal
          </button>
        </form>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
          <thead className="bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500 dark:bg-zinc-800/60">
            <tr>
              <th className="px-5 py-3">Nama Tamu</th>
              <th className="px-5 py-3">Kategori Grup</th>
              <th className="px-5 py-3">Status RSVP</th>
              <th className="px-5 py-3 text-center">Pax</th>
              <th className="px-5 py-3 text-right">Diperbarui</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      {guest.name}
                    </div>
                    {guest.phone && (
                      <div className="text-[11px] text-zinc-400">{guest.phone}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {guest.groupName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {getStatusBadge(guest.status)}
                  </td>
                  <td className="px-5 py-3.5 text-center font-semibold text-zinc-800 dark:text-zinc-200">
                    {guest.pax}
                  </td>
                  <td className="px-5 py-3.5 text-right text-zinc-400 text-[11px]">
                    {guest.updatedAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-400">
                  Tidak ada tamu yang sesuai dengan pencarian Anda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
