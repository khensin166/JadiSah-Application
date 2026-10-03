'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
}

const formatDisplayDate = (date: Date): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pilih tanggal...',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectDate = (date: Date) => {
    const formatted = formatDisplayDate(date);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full justify-between font-normal bg-ivory-50 border-champagne-light text-left h-9 text-xs text-charcoal-900 rounded-xl hover:bg-champagne-soft/40',
          !value && 'text-charcoal-400'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="h-3.5 w-3.5 text-champagne-dark shrink-0" />
          <span className="truncate">{value || placeholder}</span>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-charcoal-400 hover:text-charcoal-700 rounded-full p-0.5 hover:bg-ivory-200"
            title="Hapus tanggal"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Button>

      {/* Popover Calendar dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 animate-in fade-in-0 zoom-in-95">
          <Calendar
            value={value ? new Date(value) : null}
            onChange={handleSelectDate}
          />
        </div>
      )}
    </div>
  );
};
