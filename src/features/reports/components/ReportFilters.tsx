import { DatePicker } from "@/components/ui/DatePicker";
import { CalendarDays, RefreshCw, UserCheck, Users } from "lucide-react";
import React from "react";
import {
  getLastMonthRange,
  getThisMonthRange,
  ReportFilterParams,
  ReportType,
} from "../types/reports";

interface ReportFiltersProps {
  filters: ReportFilterParams;
  onChange: (newFilters: ReportFilterParams) => void;
  onRefresh: () => void;
  isFetching: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onChange,
  onRefresh,
  isFetching,
}) => {
  const handleTypeChange = (type: ReportType) => {
    onChange({ ...filters, type });
  };

  const thisMonth = getThisMonthRange();
  const lastMonth = getLastMonthRange();

  const isThisMonthSelected =
    filters.date === thisMonth.date && filters.dateTo === thisMonth.dateTo;
  const isLastMonthSelected =
    filters.date === lastMonth.date && filters.dateTo === lastMonth.dateTo;

  return (
    <div className='p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* Report Type Tabs */}
        <div className='flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800/80 w-fit'>
          <button
            type='button'
            onClick={() => handleTypeChange("member_traffic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filters.type === "member_traffic"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <UserCheck className='w-4 h-4' />
            Member Traffic
          </button>
          <button
            type='button'
            onClick={() => handleTypeChange("visitor_traffic")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filters.type === "visitor_traffic"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Users className='w-4 h-4' />
            Visitor Traffic
          </button>
        </div>

        {/* Preset Date Range Buttons: Only This Month / Last Month */}
        <div className='flex items-center gap-2 text-xs flex-wrap'>
          <span className='text-slate-500 text-xs font-medium mr-1 flex items-center gap-1'>
            <CalendarDays className='w-3.5 h-3.5' /> Presets:
          </span>
          <button
            type='button'
            onClick={() =>
              onChange({ ...filters, date: thisMonth.date, dateTo: thisMonth.dateTo })
            }
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isThisMonthSelected
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-sm shadow-indigo-500/10"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            This Month
          </button>
          <button
            type='button'
            onClick={() =>
              onChange({ ...filters, date: lastMonth.date, dateTo: lastMonth.dateTo })
            }
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isLastMonthSelected
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-sm shadow-indigo-500/10"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Date Pickers Form */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end pt-2 border-t border-slate-800/60'>
        {/* Date From (Default: Current Date) */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-400'>
            From Date (Default: Today)
          </label>
          <DatePicker
            value={filters.date}
            onChange={(newDate) => {
              if (newDate) {
                onChange({ ...filters, date: newDate });
              }
            }}
            placeholder='Select start date'
          />
        </div>

        {/* Date To (Optional) */}
        <div className='space-y-1.5'>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-400'>
            To Date <span className='text-slate-500 font-normal lowercase'>(optional)</span>
          </label>
          <DatePicker
            value={filters.dateTo}
            onChange={(newDate) =>
              onChange({
                ...filters,
                dateTo: newDate,
              })
            }
            placeholder='Select end date (optional)'
            isOptional
          />
        </div>

        {/* Refresh Button */}
        <div>
          <button
            type='button'
            onClick={onRefresh}
            disabled={isFetching}
            className='w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50'
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-indigo-400" : ""}`}
            />
            <span>Refresh Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
