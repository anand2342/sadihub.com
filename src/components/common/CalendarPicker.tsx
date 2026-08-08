import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';


interface CalendarPickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select Date from Calendar',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date or default to today
  const initialDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Close calendar popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false); // Auto-close upon date click selection!
  };

  // Helper for quick preset buttons
  const setQuickPreset = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    setCurrentYear(y);
    setCurrentMonth(target.getMonth());
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Format value for display
  const displayFormatted = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : placeholder;

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button Field */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)] cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] shrink-0" />
          <span className={cn('font-medium', value ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]')}>
            {displayFormatted}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold-light)] text-[var(--gold-dark)] dark:text-[var(--gold-primary)] border border-[var(--border-gold)]">
          Calendar
        </span>
      </button>

      {/* Popover Visual Calendar Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 sm:w-80 bg-[var(--bg-card)] border-2 border-[var(--border-gold)] rounded-2xl p-4 shadow-2xl animate-fade-in gold-shadow">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <h4 className="font-serif font-bold text-sm text-[var(--text-primary)]">
              {monthNames[currentMonth]} {currentYear}
            </h4>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-accent)] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center justify-between gap-1 mb-3 text-[10px]">
            <button
              type="button"
              onClick={() => setQuickPreset(0)}
              className="flex-1 py-1 rounded-md bg-[var(--bg-accent)] text-[var(--gold-dark)] font-semibold border border-[var(--border-gold)] cursor-pointer hover:bg-[var(--gold-light)]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickPreset(30)}
              className="flex-1 py-1 rounded-md bg-[var(--bg-accent)] text-[var(--gold-dark)] font-semibold border border-[var(--border-gold)] cursor-pointer hover:bg-[var(--gold-light)]"
            >
              +30 Days
            </button>
            <button
              type="button"
              onClick={() => setQuickPreset(60)}
              className="flex-1 py-1 rounded-md bg-[var(--bg-accent)] text-[var(--gold-dark)] font-semibold border border-[var(--border-gold)] cursor-pointer hover:bg-[var(--gold-light)]"
            >
              +60 Days
            </button>
          </div>

          {/* Day Name Headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2">
            {dayNames.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 text-xs text-center">
            {/* Blank leading slots */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8" />
            ))}

            {/* Days of month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const formattedM = String(currentMonth + 1).padStart(2, '0');
              const formattedD = String(dayNum).padStart(2, '0');
              const dateKey = `${currentYear}-${formattedM}-${formattedD}`;
              const isSelected = value === dateKey;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={cn(
                    'h-8 w-8 mx-auto rounded-xl flex items-center justify-center font-medium transition-all cursor-pointer',
                    isSelected
                      ? 'bg-gold-gradient text-white font-bold shadow-md scale-105'
                      : 'hover:bg-[var(--gold-light)] text-[var(--text-primary)]'
                  )}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-center text-[var(--text-muted)]">
            Click any date to select instantly
          </div>
        </div>
      )}
    </div>
  );
};
