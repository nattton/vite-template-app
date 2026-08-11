import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  isOptional?: boolean;
  disableFuture?: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDateString(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  isOptional = false,
  disableFuture = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const selectedDate = useMemo(() => parseDateString(value), [value]);
  const [viewDate, setViewDate] = useState<Date>(selectedDate);

  const todayStr = useMemo(() => formatDateString(new Date()), []);
  const today = useMemo(() => new Date(), []);

  // Sync viewDate when value changes
  useEffect(() => {
    if (value) {
      setViewDate(parseDateString(value));
    }
  }, [value]);

  // Synchronous position calculation for Portal floating popover
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 288; // 72 * 4 (w-72)
      let left = rect.left + window.scrollX;
      if (left + popoverWidth > window.innerWidth) {
        left = Math.max(10, window.innerWidth - popoverWidth - 20);
      }

      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left,
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  // Close popover when clicking outside trigger or popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isNextMonthDisabled = useMemo(() => {
    if (!disableFuture) return false;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    return (
      viewYear > currentYear ||
      (viewYear === currentYear && viewMonth >= currentMonth)
    );
  }, [disableFuture, today, viewDate]);

  const handlePrevMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
    );
  };

  // Generate 35 or 42 grid cells for current view month
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Previous month padding days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: formatDateString(d),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push({
        date: d,
        isCurrentMonth: true,
        dateStr: formatDateString(d),
      });
    }

    // Next month padding days
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const d = new Date(year, month + 1, day);
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: formatDateString(d),
      });
    }

    return days;
  }, [viewDate]);

  const handleSelectDay = (dateStr: string) => {
    if (disableFuture && dateStr > todayStr) return;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setIsOpen(false);
  };

  const formattedDisplay = useMemo(() => {
    if (!value) return null;
    const d = parseDateString(value);
    return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  }, [value]);

  return (
    <div className='w-full'>
      {/* Input Trigger Button */}
      <div
        ref={triggerRef}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-3 py-2 bg-slate-950 border ${
          isOpen
            ? "border-indigo-500 ring-1 ring-indigo-500/30"
            : "border-slate-800 hover:border-slate-700"
        } rounded-xl text-xs cursor-pointer transition-all select-none`}
      >
        <div className='flex items-center gap-2 text-slate-200 truncate'>
          <CalendarIcon className='w-4 h-4 text-indigo-400 flex-shrink-0' />
          {value ? (
            <span className='font-medium font-mono text-slate-100'>
              {value}{" "}
              <span className='text-slate-500 font-sans text-[11px]'>
                ({formattedDisplay})
              </span>
            </span>
          ) : (
            <span className='text-slate-500'>{placeholder}</span>
          )}
        </div>

        <div className='flex items-center gap-1'>
          {isOptional && value && (
            <button
              type='button'
              onClick={handleClear}
              className='p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors'
              title='Clear date'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>
      </div>

      {/* Floating Portal Calendar Popover (z-index 9999) */}
      {isOpen &&
        position.top > 0 &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className='w-72 p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl space-y-4 font-sans text-slate-100 animate-in fade-in zoom-in-95 duration-150'
          >
            {/* Header Controls */}
            <div className='flex items-center justify-between'>
              <button
                type='button'
                onClick={handlePrevMonth}
                className='p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              <span className='text-xs font-bold text-slate-100 tracking-wide'>
                {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type='button'
                onClick={handleNextMonth}
                disabled={isNextMonthDisabled}
                className={`p-1.5 rounded-lg transition-colors ${
                  isNextMonthDisabled
                    ? "opacity-30 cursor-not-allowed text-slate-600"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                }`}
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className='grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider'>
              {WEEKDAYS.map((wd) => (
                <div key={wd} className='py-1'>
                  {wd}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className='grid grid-cols-7 gap-1 text-center text-xs'>
              {calendarDays.map(({ date, isCurrentMonth, dateStr }) => {
                const isSelected = value === dateStr;
                const isToday = todayStr === dateStr;
                const isFuture = disableFuture && dateStr > todayStr;

                return (
                  <button
                    key={dateStr}
                    type='button'
                    disabled={isFuture}
                    onClick={() => handleSelectDay(dateStr)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center font-medium transition-all text-xs mx-auto ${
                      isFuture
                        ? "opacity-30 cursor-not-allowed text-slate-600 pointer-events-none"
                        : isSelected
                          ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30"
                          : isToday
                            ? "border border-cyan-400/80 text-cyan-300 font-semibold"
                            : isCurrentMonth
                              ? "text-slate-200 hover:bg-slate-800 hover:text-white"
                              : "text-slate-600 hover:bg-slate-800/40"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer Quick Actions */}
            <div className='pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs'>
              <button
                type='button'
                onClick={() => handleSelectDay(todayStr)}
                className='text-indigo-400 hover:text-indigo-300 font-semibold transition-colors text-[11px]'
              >
                Today
              </button>
              {isOptional && (
                <button
                  type='button'
                  onClick={() => {
                    onChange(undefined);
                    setIsOpen(false);
                  }}
                  className='text-slate-500 hover:text-slate-300 transition-colors text-[11px]'
                >
                  Clear
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
