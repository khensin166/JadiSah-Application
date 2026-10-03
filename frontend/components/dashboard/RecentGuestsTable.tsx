'use client';

import React, { useState } from 'react';
import { Search, UserPlus, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import { GuestItem, GuestStatus } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
          <Badge variant="outline" className="gap-1 bg-sage-soft text-sage-dark border border-sage/20 font-semibold text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            Hadir
          </Badge>
        );
      case 'declined':
        return (
          <Badge variant="outline" className="gap-1 bg-charcoal-200/60 text-charcoal-700 border border-charcoal-300 font-semibold text-[10px]">
            <XCircle className="h-3 w-3 text-charcoal-500" />
            Batal
          </Badge>
        );
      case 'invited':
      default:
        return (
          <Badge variant="outline" className="gap-1 bg-champagne-soft text-champagne-dark border border-champagne-light font-semibold text-[10px]">
            <Clock className="h-3 w-3" />
            Menunggu
          </Badge>
        );
    }
  };

  return (
    <Card className="rounded-3xl border border-champagne-light/70 bg-ivory-50 soft-shadow overflow-hidden">
      {/* Header & Controls */}
      <CardHeader className="border-b border-champagne-light/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-champagne-dark font-semibold">
              Guest Ledger
            </span>
            <CardTitle className="font-cormorant text-2xl font-normal text-charcoal-900">
              Daftar Tamu &amp; Konfirmasi RSVP
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-charcoal-500">
              Total {filteredGuests.length} tamu terdaftar dalam atelier
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-charcoal-400" />
              <Input
                type="text"
                placeholder="Cari tamu / grup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 pl-9 rounded-full bg-ivory-100 border border-champagne-light text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-champagne/40"
              />
            </div>

            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="gap-1.5 rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition"
            >
              <UserPlus className="h-3.5 w-3.5 text-charcoal-800" />
              <span>Tambah Tamu</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-6 py-3 bg-ivory-100/60 border-b border-champagne-light/50 text-xs overflow-x-auto">
        <span className="flex items-center gap-1 text-champagne-dark font-semibold text-[10px] uppercase tracking-wider mr-1.5 shrink-0">
          <Filter className="h-3 w-3" /> Filter:
        </span>
        {(['all', 'attending', 'invited', 'declined'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              statusFilter === status
                ? 'bg-champagne text-charcoal-900 font-semibold shadow-xs border border-champagne-dark/30'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-champagne-soft border border-champagne-light'
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

      {/* Inline Add Guest Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddGuest}
          className="p-4 sm:p-6 bg-ivory-100/90 border-b border-champagne-light/60 flex flex-wrap items-center gap-3"
        >
          <Input
            type="text"
            placeholder="Nama Tamu (misal: Bpk. Andi & Keluarga)"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            className="flex-1 min-w-[200px] bg-ivory-50 border border-champagne-light text-xs text-charcoal-900 rounded-xl"
            required
          />
          <select
            value={newGuestGroup}
            onChange={(e) => setNewGuestGroup(e.target.value)}
            className="h-9 rounded-xl border border-champagne-light bg-ivory-50 px-3 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne"
          >
            <option value="Keluarga">Keluarga</option>
            <option value="Sahabat">Sahabat</option>
            <option value="Rekan Kerja">Rekan Kerja</option>
            <option value="Relasi Bisnis">Relasi Bisnis</option>
          </select>
          <Input
            type="number"
            min="1"
            max="10"
            value={newGuestPax}
            onChange={(e) => setNewGuestPax(Number(e.target.value))}
            className="w-16 text-center bg-ivory-50 border border-champagne-light text-xs text-charcoal-900 rounded-xl"
            title="Jumlah Pax"
          />
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition"
          >
            Simpan
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(false)}
            className="rounded-full border border-champagne-light bg-ivory-50 text-xs font-semibold uppercase tracking-wider text-charcoal-700 hover:bg-champagne-soft transition"
          >
            Batal
          </Button>
        </form>
      )}

      {/* Shadcn Table */}
      <Table>
        <TableHeader className="bg-ivory-100/50 border-b border-champagne-light/70">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-champagne-dark text-[10px] uppercase tracking-widest">
              Nama Tamu
            </TableHead>
            <TableHead className="font-semibold text-champagne-dark text-[10px] uppercase tracking-widest">
              Kategori Grup
            </TableHead>
            <TableHead className="font-semibold text-champagne-dark text-[10px] uppercase tracking-widest">
              Status RSVP
            </TableHead>
            <TableHead className="text-center font-semibold text-champagne-dark text-[10px] uppercase tracking-widest">
              Pax
            </TableHead>
            <TableHead className="text-right font-semibold text-champagne-dark text-[10px] uppercase tracking-widest">
              Diperbarui
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-champagne-light/40">
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <TableRow key={guest.id} className="hover:bg-ivory-100/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-champagne-soft border border-champagne-light text-champagne-dark flex items-center justify-center font-serif font-bold text-xs shrink-0">
                      {guest.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-charcoal-900">
                        {guest.name}
                      </div>
                      {guest.phone && (
                        <div className="text-[11px] text-charcoal-500">{guest.phone}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-[11px] bg-ivory-100 border-champagne-light text-charcoal-700">
                    {guest.groupName}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(guest.status)}</TableCell>
                <TableCell className="text-center font-semibold text-charcoal-900">
                  {guest.pax}
                </TableCell>
                <TableCell className="text-right text-[11px] text-charcoal-500">
                  {guest.updatedAt}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-charcoal-400">
                Tidak ada data tamu yang cocok.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
