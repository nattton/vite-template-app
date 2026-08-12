import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  filteredCount: number;
  showingCount: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000, 5000];

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  filteredCount,
  showingCount,
  itemLabel = "items",
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) => {
  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  return (
    <div className='px-6 py-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3'>
      {/* Summary and Per Page Selector */}
      <div className='flex flex-wrap items-center gap-3'>
        <span>
          Showing <strong className='text-slate-200'>{showingCount}</strong> of{" "}
          <strong className='text-slate-200'>{filteredCount}</strong> filtered{" "}
          {itemLabel} {totalItems !== filteredCount ? `(Total: ${totalItems})` : ""}
        </span>

        <div className='flex items-center gap-1.5 pl-3 border-l border-slate-800 text-slate-400'>
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className='px-2 py-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg text-slate-200 text-xs font-mono appearance-none transition-colors'
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page Navigation Controls */}
      {totalPages > 1 && (
        <div className='flex items-center gap-2'>
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className='px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium'
          >
            <ChevronLeft className='w-3.5 h-3.5' />
            <span>Prev</span>
          </button>

          <span className='font-mono text-slate-300 px-2'>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium'
          >
            <span>Next</span>
            <ChevronRight className='w-3.5 h-3.5' />
          </button>
        </div>
      )}
    </div>
  );
};
