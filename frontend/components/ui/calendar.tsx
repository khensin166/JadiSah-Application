'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface CalendarProps {
  value?: Date | string | null;
  onChange?: (date: Date) => void;
  className?: string;
  minDate?: Date;
}

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  className,
  minDate,
}) => {
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());

  const selectedDate = value ? new Date(value) : null;
  const today = new Date();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month filler days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(currentYear, currentMonth, d),
      isCurrentMonth: true,
    });
  }

  // Next month filler days (grid to 35 or 42)
  const remainingCells = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
  for (let n = 1; n <= remainingCells; n++) {
    days.push({
      date: new Date(currentYear, currentMonth + 1, n),
      isCurrentMonth: false,
    });
  }

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div
      className={cn(
        'w-64 rounded-2xl border border-champagne-light bg-ivory-50 p-3.5 soft-shadow select-none',
        className
      )}
    >
      {/* Month & Year Navigation */}
      <div className="flex items-center justify-between px-1 pb-2 border-b border-champagne-light/60">
        <span className="font-serif text-sm font-bold text-charcoal-900">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-6 w-6 rounded-lg text-charcoal-500 hover:bg-champagne-soft hover:text-charcoal-900"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-6 w-6 rounded-lg text-charcoal-500 hover:bg-champagne-soft hover:text-charcoal-900"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="mt-2 grid grid-cols-7 text-center text-[10px] uppercase font-semibold text-champagne-dark">
        {DAY_NAMES.map((name) => (
          <div key={name} className="py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((item, idx) => {
          const isSelected = isSameDay(selectedDate, item.date);
          const isToday = isSameDay(today, item.date);
          const isPast = minDate ? item.date < minDate : false;

          return (
            <button
              key={idx}
              type="button"
              disabled={isPast}
              onClick={() => {
                if (onChange && !isPast) {
                  onChange(item.date);
                }
              }}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg text-xs transition-colors mx-auto cursor-pointer',
                isSelected && 'bg-champagne font-bold text-charcoal-900 shadow-xs',
                !isSelected && item.isCurrentMonth && 'text-charcoal-800 hover:bg-champagne-soft hover:text-charcoal-900',
                !isSelected && !item.isCurrentMonth && 'text-charcoal-400/50',
                isToday && !isSelected && 'border border-champagne text-champagne-dark font-bold',
                isPast && 'opacity-30 cursor-not-allowed'
              )}
            >
              {item.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
