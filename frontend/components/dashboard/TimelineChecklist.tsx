'use client';

import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  CheckCircle2,
  ListTodo,
  Plus,
  Trash2,
  CalendarPlus,
  Calendar as CalendarIcon,
  Filter,
} from 'lucide-react';
import { WeddingEventItem, ChecklistTask } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { TimeWindowFilter, isTaskInTimeWindow } from '@/lib/dashboard-utils';

interface TimelineChecklistProps {
  events: WeddingEventItem[];
  tasks: ChecklistTask[];
  onAddEvent?: (newEvent: WeddingEventItem) => void;
  onDeleteEvent?: (id: string) => void;
  onToggleTask?: (id: string) => void;
  onAddTask?: (newTask: ChecklistTask) => void;
  onDeleteTask?: (id: string) => void;
}

export const TimelineChecklist: React.FC<TimelineChecklistProps> = ({
  events: propEvents,
  tasks: propTasks,
  onAddEvent: propOnAddEvent,
  onDeleteEvent: propOnDeleteEvent,
  onToggleTask: propOnToggleTask,
  onAddTask: propOnAddTask,
  onDeleteTask: propOnDeleteTask,
}) => {
  // Local state fallback if parent does not provide callbacks
  const [localEvents, setLocalEvents] = useState<WeddingEventItem[]>(propEvents);
  const [localTasks, setLocalTasks] = useState<ChecklistTask[]>(propTasks);

  // Form toggle states
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [timeFilter, setTimeFilter] = useState<TimeWindowFilter>('all');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Tamu');
  const [taskDueDate, setTaskDueDate] = useState('');

  const activeEvents = propOnAddEvent ? propEvents : localEvents;
  const activeTasks = propOnAddTask ? propTasks : localTasks;

  // Handlers for Rundown Events
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventStartTime.trim() || !eventLocation.trim()) return;

    const newEvent: WeddingEventItem = {
      id: `evt-${Date.now()}`,
      title: eventTitle.trim(),
      startTime: eventStartTime.trim(),
      endTime: eventEndTime.trim() || 'Selesai',
      location: eventLocation.trim(),
      status: 'upcoming',
    };

    if (propOnAddEvent) {
      propOnAddEvent(newEvent);
    } else {
      setLocalEvents((prev) => [...prev, newEvent]);
    }

    setEventTitle('');
    setEventStartTime('');
    setEventEndTime('');
    setEventLocation('');
    setShowAddEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (propOnDeleteEvent) {
      propOnDeleteEvent(id);
    } else {
      setLocalEvents((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Handlers for Checklist Tasks
  const handleToggleTask = (id: string) => {
    if (propOnToggleTask) {
      propOnToggleTask(id);
    } else {
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
      );
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: ChecklistTask = {
      id: `chk-${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      dueDate: taskDueDate.trim() || 'Fleksibel',
      isCompleted: false,
    };

    if (propOnAddTask) {
      propOnAddTask(newTask);
    } else {
      setLocalTasks((prev) => [newTask, ...prev]);
    }

    setTaskTitle('');
    setTaskDueDate('');
    setShowAddTaskForm(false);
  };

  const handleDeleteTask = (id: string) => {
    if (propOnDeleteTask) {
      propOnDeleteTask(id);
    } else {
      setLocalTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const completedCount = activeTasks.filter((t) => t.isCompleted).length;

  const filteredTasks = activeTasks.filter((t) => {
    const matchesStatus =
      taskFilter === 'all'
        ? true
        : taskFilter === 'completed'
        ? t.isCompleted
        : !t.isCompleted;

    const matchesTime = isTaskInTimeWindow(t.dueDate, timeFilter);
    return matchesStatus && matchesTime;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Rundown & Sesi Acara */}
      <Card className="rounded-3xl border border-champagne-light/70 bg-ivory-50 soft-shadow">
        <CardHeader className="border-b border-champagne-light/60 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-cormorant text-2xl font-normal text-charcoal-900">
                  Rundown &amp; Sesi Acara
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-semibold text-champagne-dark bg-champagne-soft border-champagne-light">
                  {activeEvents.length} Sesi
                </Badge>
              </div>
              <CardDescription className="mt-0.5 text-xs text-charcoal-500">
                Jadwal sesi pelaksanaan hari-H pernikahan
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={() => setShowAddEventForm(!showAddEventForm)}
              className="gap-1.5 self-start sm:self-auto shrink-0 rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition"
            >
              {showAddEventForm ? (
                <span>Tutup Form</span>
              ) : (
                <>
                  <CalendarPlus className="h-3.5 w-3.5 text-charcoal-800" />
                  <span>Tambah Sesi</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Form Tambah Rundown */}
        {showAddEventForm && (
          <form
            onSubmit={handleAddEvent}
            className="p-4 sm:p-6 bg-ivory-100/90 border-b border-champagne-light/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">
                Formulir Sesi Acara Baru
              </span>
              <span className="text-[10px] text-charcoal-400">* Wajib diisi</span>
            </div>

            <Input
              type="text"
              placeholder="Nama Sesi (misal: Temu Manten / Foto Keluarga)*"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="bg-ivory-50 border border-champagne-light text-charcoal-900 rounded-xl"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600 mb-1">
                  Jam Mulai *
                </label>
                <TimePicker
                  value={eventStartTime}
                  onChange={setEventStartTime}
                  placeholder="Pilih Jam Mulai*"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600 mb-1">
                  Jam Selesai
                </label>
                <TimePicker
                  value={eventEndTime}
                  onChange={setEventEndTime}
                  placeholder="Pilih Jam Selesai"
                />
              </div>
            </div>

            <Input
              type="text"
              placeholder="Lokasi Acara (misal: Pelaminan Utama / Ruang VIP)*"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="bg-ivory-50 border border-champagne-light text-charcoal-900 rounded-xl"
              required
            />

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" size="sm" className="rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition">
                Simpan Sesi Acara
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddEventForm(false)}
                className="rounded-full border border-champagne-light bg-ivory-50 text-charcoal-700 hover:bg-champagne-soft text-xs font-semibold uppercase tracking-wider transition"
              >
                Batal
              </Button>
            </div>
          </form>
        )}

        <CardContent className="p-6 space-y-3">
          {activeEvents.length > 0 ? (
            activeEvents.map((evt, idx) => (
              <div
                key={evt.id}
                className="group flex items-start justify-between gap-3.5 rounded-2xl border border-champagne-light/70 bg-ivory-100/70 p-3.5 hover:border-champagne hover:bg-ivory-100 transition soft-shadow"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne-soft border border-champagne-light text-xs font-serif font-bold text-champagne-dark">
                    {idx + 1}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-charcoal-900 truncate">
                        {evt.title}
                      </h3>
                      <Badge variant="outline" className="gap-1 text-[10px] py-0 px-2 bg-ivory-50 text-champagne-dark border-champagne-light font-medium">
                        <Clock className="h-3 w-3 text-champagne-dark" />
                        {evt.startTime} - {evt.endTime}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne-dark" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="opacity-0 group-hover:opacity-100 text-charcoal-400 hover:text-charcoal-800 p-1.5 rounded-lg hover:bg-ivory-200 transition"
                  title="Hapus sesi"
                  aria-label="Hapus sesi acara"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-charcoal-400">
              Belum ada rundown acara yang ditambahkan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Checklist Persiapan */}
      <Card className="rounded-3xl border border-champagne-light/70 bg-ivory-50 soft-shadow">
        <CardHeader className="border-b border-champagne-light/60 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-cormorant text-2xl font-normal text-charcoal-900">
                  Checklist Persiapan
                </CardTitle>
                <Badge variant="outline" className="gap-1 text-[10px] font-semibold text-champagne-dark bg-champagne-soft border border-champagne-light">
                  <ListTodo className="h-3 w-3" />
                  <span>{completedCount} / {activeTasks.length} Selesai</span>
                </Badge>
              </div>
              <CardDescription className="mt-0.5 text-xs text-charcoal-500">
                Tandai tugas yang telah selesai atau tambah tugas baru
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="gap-1.5 self-start sm:self-auto shrink-0 rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition"
            >
              {showAddTaskForm ? (
                <span>Tutup Form</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 text-charcoal-800" />
                  <span>Tambah Tugas</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Dual Filter: Waktu (Bulan Ini, 2 Bulan, 3 Bulan, All) & Status */}
        <div className="border-b border-champagne-light/50 bg-ivory-100/60 p-3 sm:px-6 space-y-2.5">
          {/* Row 1: Time Window Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 text-champagne-dark font-semibold text-[10px] uppercase tracking-wider mr-1 shrink-0">
              <CalendarIcon className="h-3 w-3" />
              <span>Waktu:</span>
            </span>
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'this-month', label: 'Bulan Ini' },
              { id: '2-months', label: '2 Bulan' },
              { id: '3-months', label: '3 Bulan' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeFilter(item.id as TimeWindowFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  timeFilter === item.id
                    ? 'bg-champagne text-charcoal-900 font-semibold shadow-xs border border-champagne-dark/30'
                    : 'bg-ivory-50 text-charcoal-700 hover:bg-champagne-soft border border-champagne-light'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Row 2: Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-champagne-light/40">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="flex items-center gap-1 text-champagne-dark font-semibold text-[10px] uppercase tracking-wider mr-1 shrink-0">
                <Filter className="h-3 w-3" />
                <span>Status:</span>
              </span>
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTaskFilter(filter)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition ${
                    taskFilter === filter
                      ? 'bg-champagne text-charcoal-900 font-semibold shadow-xs border border-champagne-dark/30'
                      : 'bg-ivory-50 text-charcoal-600 hover:bg-champagne-soft border border-champagne-light'
                  }`}
                >
                  {filter === 'all'
                    ? 'Semua'
                    : filter === 'pending'
                    ? 'Belum Selesai'
                    : 'Selesai'}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-charcoal-500 font-medium">
              {filteredTasks.length} tugas ditemukan
            </span>
          </div>
        </div>

        {/* Form Tambah Checklist Tugas */}
        {showAddTaskForm && (
          <form
            onSubmit={handleAddTask}
            className="p-4 sm:p-6 bg-ivory-100/90 border-b border-champagne-light/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-800">
                Tambah Tugas Persiapan Baru
              </span>
              <span className="text-[10px] text-charcoal-400">* Wajib diisi</span>
            </div>

            <Input
              type="text"
              placeholder="Deskripsi Tugas (misal: Konfirmasi Souvenir & Undangan VIP)*"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="bg-ivory-50 border border-champagne-light text-charcoal-900 rounded-xl"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600 mb-1">
                  Kategori Tugas
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full h-9 rounded-xl border border-champagne-light bg-ivory-50 px-3 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-champagne"
                >
                  <option value="Tamu">Tamu &amp; Undangan</option>
                  <option value="Anggaran">Anggaran &amp; Keuangan</option>
                  <option value="Catering">Catering &amp; Makanan</option>
                  <option value="Busana">Busana &amp; MUA</option>
                  <option value="Dekorasi">Dekorasi &amp; Gedung</option>
                  <option value="Dokumentasi">Foto &amp; Video</option>
                  <option value="Acara">Acara &amp; Rundown</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-600 mb-1">
                  Tenggat Waktu
                </label>
                <DatePicker
                  value={taskDueDate}
                  onChange={setTaskDueDate}
                  placeholder="Pilih Tanggal Kalender..."
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" size="sm" className="rounded-full bg-champagne hover:bg-champagne-light text-charcoal-900 text-xs font-semibold uppercase tracking-wider shadow-xs border border-champagne-dark/20 transition">
                Simpan Tugas
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddTaskForm(false)}
                className="rounded-full border border-champagne-light bg-ivory-50 text-charcoal-700 hover:bg-champagne-soft text-xs font-semibold uppercase tracking-wider transition"
              >
                Batal
              </Button>
            </div>
          </form>
        )}

        <CardContent className="p-6 space-y-2.5">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 rounded-2xl p-3.5 border transition ${
                  task.isCompleted
                    ? 'border-champagne-light/50 bg-champagne-soft/30 text-charcoal-700 opacity-90'
                    : 'border-champagne-light/70 bg-ivory-100/70 hover:border-champagne hover:bg-ivory-100 text-charcoal-900 soft-shadow'
                }`}
              >
                <div
                  onClick={() => handleToggleTask(task.id)}
                  className="flex flex-1 items-center gap-3 cursor-pointer min-w-0"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(task.id);
                    }}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                      task.isCompleted
                        ? 'bg-champagne border-champagne text-charcoal-900'
                        : 'border-champagne-dark/50 hover:border-champagne bg-ivory-50'
                    }`}
                    aria-label={task.isCompleted ? 'Batalkan selesai' : 'Tandai selesai'}
                  >
                    {task.isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm leading-snug truncate ${
                        task.isCompleted ? 'line-through text-charcoal-600 font-medium' : 'text-charcoal-900 font-semibold'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-charcoal-500">
                      <span className="px-1.5 py-0.5 rounded bg-ivory-200 text-charcoal-700 font-medium">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] ${
                      task.isCompleted ? 'text-charcoal-500' : 'text-champagne-dark font-semibold'
                    }`}
                  >
                    {task.dueDate}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-charcoal-400 hover:text-charcoal-800 p-1.5 rounded-lg hover:bg-ivory-200 transition"
                    title="Hapus tugas"
                    aria-label="Hapus tugas"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-charcoal-400">
              Tidak ada tugas pada filter ini.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
