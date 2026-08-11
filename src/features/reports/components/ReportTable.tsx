import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Car, Download, Hash, Search, Shield } from "lucide-react";
import React, { useMemo, useState } from "react";
import { TrafficReportItem } from "../types/reports";

interface ReportTableProps {
  data: TrafficReportItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  reportTypeTitle: string;
}

const columnHelper = createColumnHelper<TrafficReportItem>();

export const ReportTable: React.FC<ReportTableProps> = ({
  data,
  isLoading,
  isError,
  errorMessage,
  reportTypeTitle,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "traffic", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const maxTraffic = useMemo(() => {
    return Math.max(...data.map((item) => item.traffic), 1);
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: () => "#",
        cell: (info) => (
          <span className='font-mono text-slate-500 text-[11px]'>
            {info.row.index + 1}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='flex items-center gap-1.5 hover:text-slate-200 transition-colors'
          >
            <span>Name / Unit</span>
            <ArrowUpDown className='w-3 h-3 text-slate-500' />
          </button>
        ),
        cell: (info) => (
          <span className='font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors'>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("plateNumber", {
        header: ({ column }) => (
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='flex items-center gap-1.5 hover:text-slate-200 transition-colors'
          >
            <span>License Plate</span>
            <ArrowUpDown className='w-3 h-3 text-slate-500' />
          </button>
        ),
        cell: (info) => (
          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs font-bold tracking-wide shadow-inner'>
            <Car className='w-3 h-3 text-cyan-400' />
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("vehicleId", {
        header: () => <div className='text-center'>Vehicle ID</div>,
        cell: (info) => (
          <div className='text-center'>
            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono text-slate-400'>
              <Hash className='w-3 h-3 text-slate-500' />
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("traffic", {
        header: ({ column }) => (
          <div className='text-right'>
            <button
              type='button'
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className='inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors ml-auto'
            >
              <span>Traffic Volume</span>
              <ArrowUpDown className='w-3 h-3 text-slate-500' />
            </button>
          </div>
        ),
        cell: (info) => {
          const val = info.getValue();
          const percentage = Math.min(
            Math.round((val / maxTraffic) * 100),
            100,
          );
          return (
            <div className='flex items-center justify-end gap-3'>
              <div className='w-24 bg-slate-950 rounded-full h-2 overflow-hidden hidden sm:block border border-slate-800'>
                <div
                  className='bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300'
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className='font-bold text-sm text-indigo-400 font-mono min-w-8'>
                {val}
              </span>
            </div>
          );
        },
      }),
    ],
    [maxTraffic],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue).toLowerCase().trim();
      if (!q) return true;
      const name = String(row.original.name ?? "").toLowerCase();
      const plate = String(row.original.plateNumber ?? "").toLowerCase();
      const vehicleId = String(row.original.vehicleId ?? "");
      return name.includes(q) || plate.includes(q) || vehicleId.includes(q);
    },
  });

  const filteredRows = table.getFilteredRowModel().rows;

  const exportToCsv = () => {
    if (!filteredRows.length) return;

    const headers = ["ID", "Name / Unit", "Vehicle ID", "Plate Number", "Traffic Count"];
    const rows = filteredRows.map((row) => [
      row.original.id,
      `"${String(row.original.name ?? "").replace(/"/g, '""')}"`,
      row.original.vehicleId,
      `"${String(row.original.plateNumber ?? "").replace(/"/g, '""')}"`,
      row.original.traffic,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${reportTypeTitle.toLowerCase().replace(/\s+/g, "_")}_report.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden space-y-4 p-6'>
      {/* Table Header Controls */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold'>
            <Shield className='w-4 h-4' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-slate-100'>
              {reportTypeTitle} Detailed Logs
            </h2>
            <p className='text-xs text-slate-400'>
              Showing {filteredRows.length} of {data.length} records
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* TanStack Table Search Bar */}
          <div className='relative flex-1 sm:w-64'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500' />
            <input
              type='text'
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder='Search plate, name...'
              className='w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none placeholder-slate-600'
            />
          </div>

          {/* Export CSV Button */}
          <button
            type='button'
            onClick={exportToCsv}
            disabled={!filteredRows.length}
            className='px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <Download className='w-3.5 h-3.5' />
            Export CSV
          </button>
        </div>
      </div>

      {/* TanStack Table Area */}
      <div className='overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/50'>
        <table className='w-full text-left text-xs'>
          <thead className='bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className='py-3.5 px-4'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='divide-y divide-slate-800/60 font-medium text-slate-300'>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='py-4 px-4 text-center'>
                    <div className='h-4 bg-slate-800 rounded w-6 mx-auto' />
                  </td>
                  <td className='py-4 px-4'>
                    <div className='h-4 bg-slate-800 rounded w-24' />
                  </td>
                  <td className='py-4 px-4'>
                    <div className='h-4 bg-slate-800 rounded w-20' />
                  </td>
                  <td className='py-4 px-4 text-center'>
                    <div className='h-4 bg-slate-800 rounded w-12 mx-auto' />
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div className='h-4 bg-slate-800 rounded w-16 ml-auto' />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={5} className='py-8 text-center text-red-400 text-xs'>
                  {errorMessage || "Failed to load report data from http://localhost:4000."}
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5} className='py-12 text-center text-slate-500 text-xs'>
                  No traffic records match your query or date filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='hover:bg-slate-900/60 transition-colors group'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='py-3.5 px-4'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
