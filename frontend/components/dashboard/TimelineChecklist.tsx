'use client';

import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { WeddingEventItem, ChecklistTask } from '@/types/dashboard';

interface TimelineChecklistProps {
  events: WeddingEventItem[];
  initialChecklist: ChecklistTask[];
}

export const TimelineChecklist: React.FC<TimelineChecklistProps> = ({
  events,
  initialChecklist,
}) => {
  const [tasks, setTasks] = useState<ChecklistTask[]>(initialChecklist);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Rundown & Jadwal Acara */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Rundown &amp; Sesi Acara
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Jadwal pelaksanaan hari-H pernikahan
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {events.length} Sesi
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className="flex items-start gap-3.5 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40 hover:border-rose-200 transition"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-xs font-bold text-white shadow-xs">
                {idx + 1}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {evt.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md dark:bg-rose-950 dark:text-rose-300">
                    <Clock className="h-3 w-3" />
                    {evt.startTime} - {evt.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Checklist Persiapan */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Checklist Persiapan
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Klik kotak untuk menandai tugas yang selesai
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full dark:bg-rose-950 dark:text-rose-300">
            <ListTodo className="h-3.5 w-3.5" />
            <span>{completedCount} / {tasks.length} Selesai</span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center justify-between gap-3 rounded-xl p-3 text-left transition border ${
                task.isCompleted
                  ? 'border-emerald-100 bg-emerald-50/40 text-zinc-400 dark:border-emerald-950 dark:bg-emerald-950/20'
                  : 'border-zinc-100 bg-white hover:bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300 hover:text-rose-500 shrink-0" />
                )}
                <div>
                  <p
                    className={`text-xs font-medium leading-snug ${
                      task.isCompleted ? 'line-through text-zinc-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    {task.category}
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] shrink-0 font-medium ${
                  task.isCompleted ? 'text-zinc-400' : 'text-rose-500'
                }`}
              >
                {task.dueDate}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
