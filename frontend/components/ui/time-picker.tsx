'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimePickerProps {
  value: string;
  onChange: (timeStr: string) => void;
  placeholder?: string;
  className?: string;
}

// Generate time options at 15-minute intervals from 06:00 to 23:00
const PRESET_TIMES: string[] = [];
for (let h = 6; h <= 23; h++) {
  const hourStr = h < 10 ? `0${h}` : `${h}`;
  PRESET_TIMES.push(`${hourStr}:00 WIB`);
  PRESET_TIMES.push(`${hourStr}:15 WIB`);
  PRESET_TIMES.push(`${hourStr}:30 WIB`);
  PRESET_TIMES.push(`${hourStr}:45 WIB`);
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pilih waktu...',
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

  const handleSelect = (timeStr: string) => {
    onChange(timeStr);
    setIsOpen(false);
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
          <Clock className="h-3.5 w-3.5 text-champagne-dark shrink-0" />
          <span className="truncate">{value || placeholder}</span>
        </div>
        <ChevronDown className="h-3 w-3 text-charcoal-400 shrink-0 opacity-70" />
      </Button>

      {/* Popover Selection Box */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-full sm:w-56 max-h-56 overflow-y-auto rounded-2xl border border-champagne-light bg-ivory-50 p-1.5 soft-shadow animate-in fade-in-0 zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-champagne-dark border-b border-champagne-light/60 mb-1">
            Pilih Jam Pelaksanaan
          </div>
          <div className="space-y-0.5">
            {PRESET_TIMES.map((timeOption) => {
              const isSelected = value === timeOption;
              return (
                <button
                  key={timeOption}
                  type="button"
                  onClick={() => handleSelect(timeOption)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer text-left',
                    isSelected
                      ? 'bg-champagne text-charcoal-900 font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:bg-champagne-soft hover:text-charcoal-900'
                  )}
                >
                  <span>{timeOption}</span>
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
