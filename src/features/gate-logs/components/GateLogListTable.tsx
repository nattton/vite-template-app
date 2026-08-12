import { DatePicker } from "@/components/ui/DatePicker";
import { ImageLightboxModal } from "@/components/ui/ImageLightboxModal";
import { Pagination } from "@/components/ui/Pagination";
import { useClientTable } from "@/hooks/useClientTable";
import { getTodayDateString } from "@/utils/date";
import { getAnprImageUrl } from "@/utils/image";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Calendar,
  Camera,
  Car,
  ChevronRight,
  Clock,
  Filter,
  Image as ImageIcon,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { GateLogFilterParams, GateLogItem } from "../schemas/gateLogsSchema";

interface GateLogListTableProps {
  logs: GateLogItem[];
  filters: GateLogFilterParams;
  onFilterChange: (newFilters: GateLogFilterParams) => void;
}

export const GateLogListTable: React.FC<GateLogListTableProps> = ({
  logs,
  filters,
  onFilterChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const {
    searchTerm,
    filterValue: gateFilter,
    currentPage,
    pageSize,
    filteredData: filteredLogs,
    paginatedData: paginatedLogs,
    handleSearchChange,
    handleFilterChange: setGateFilter,
    handlePageChange: setCurrentPage,
    handlePageSizeChange: setPageSize,
  } = useClientTable({
    data: logs,
    filterFn: (item, term, gate) => {
      const matchGate =
        gate === "all" || item.gateName.toLowerCase() === gate.toLowerCase();

      const searchLower = term.toLowerCase().trim();
      if (!searchLower) return matchGate;

      const matchPlate = item.plateNumber.toLowerCase().includes(searchLower);
      const matchAnpr = item.anpr.toLowerCase().includes(searchLower);
      const matchMember = item.memberName.toLowerCase().includes(searchLower);
      const matchVisitorMember = item.visitorMemberName
        .toLowerCase()
        .includes(searchLower);

      return (
        matchGate &&
        (matchPlate || matchAnpr || matchMember || matchVisitorMember)
      );
    },
    defaultPageSize: 50,
  });

  const handleDateFromChange = (val: string) => {
    onFilterChange({ ...filters, date: val });
    setCurrentPage(1);
  };

  const handleDateToChange = (val: string) => {
    onFilterChange({ ...filters, dateTo: val });
    setCurrentPage(1);
  };

  const openImageModal = (imagePath: string, title: string) => {
    const fullUrl = getAnprImageUrl(imagePath);
    if (fullUrl) {
      setSelectedImage({ url: fullUrl, title });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldCheck className='w-3.5 h-3.5' /> ANPR Surveillance Stream
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Gate Access Logs
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Real-time automatic number-plate recognition (ANPR) detection log
            history and barrier triggers.
          </p>
        </div>
      </div>

      {/* Date Filter & Search Toolbar */}
      <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        {/* Search Bar */}
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder='Search license plate, ANPR raw code, resident unit...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Calendar className='w-3.5 h-3.5 text-cyan-400' />
            <span>Date:</span>
          </div>

          <div className='w-40'>
            <DatePicker
              value={filters.date || getTodayDateString()}
              onChange={(val) =>
                handleDateFromChange(val || getTodayDateString())
              }
              placeholder='Select start date'
            />
          </div>

          <span className='text-xs text-slate-500'>to</span>

          <div className='w-40'>
            <DatePicker
              value={filters.dateTo}
              onChange={(val) => handleDateToChange(val || "")}
              placeholder='Select end date'
              isOptional
            />
          </div>

          {/* Gate Direction Filter */}
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400 ml-2'>
            <Filter className='w-3.5 h-3.5 text-cyan-400' />
            <span>Direction:</span>
          </div>
          <select
            value={gateFilter}
            onChange={(e) => setGateFilter(e.target.value)}
            className='px-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-200 text-xs appearance-none transition-colors'
          >
            <option value='all'>All Gates</option>
            <option value='in'>IN Gate Only</option>
            <option value='out'>OUT Gate Only</option>
          </select>
        </div>
      </div>

      {/* Main Gate Log Table */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>ID</th>
                <th className='px-6 py-4'>Timestamp</th>
                <th className='px-6 py-4'>Gate</th>
                <th className='px-6 py-4'>License Plate</th>
                <th className='px-6 py-4'>Snapshots</th>
                <th className='px-6 py-4'>Resident Member</th>
                <th className='px-6 py-4'>Visitor Reference</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No gate activity logs found for the selected filter
                    criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const isInGate = log.gateName.toLowerCase() === "in";
                  const timeFormatted = log.createdAt
                    ? new Date(log.createdAt).toLocaleString("th-TH")
                    : "—";

                  return (
                    <tr
                      key={log.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      {/* ID */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{log.id}
                      </td>

                      {/* Timestamp */}
                      <td className='px-6 py-4 text-xs font-mono text-slate-300'>
                        <div className='flex items-center gap-1.5'>
                          <Clock className='w-3.5 h-3.5 text-cyan-400' />
                          <span>{timeFormatted}</span>
                        </div>
                      </td>

                      {/* Gate Direction */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            isInGate
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {isInGate ? (
                            <ArrowDownLeft className='w-3.5 h-3.5' />
                          ) : (
                            <ArrowUpRight className='w-3.5 h-3.5' />
                          )}
                          <span>Gate {log.gateName}</span>
                        </span>
                      </td>

                      {/* License Plate */}
                      <td className='px-6 py-4'>
                        <div className='font-mono font-bold text-base text-cyan-300 flex items-center gap-2'>
                          <Car className='w-4 h-4 text-cyan-400/80 shrink-0' />
                          <span>
                            {log.plateNumber || log.anpr || "NO PLATE"}
                          </span>
                        </div>
                        {log.anpr && log.anpr !== log.plateNumber && (
                          <p className='text-[11px] font-mono text-slate-500 mt-0.5'>
                            ANPR: {log.anpr}
                          </p>
                        )}
                      </td>

                      {/* Camera Snapshots Lightbox Trigger */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {log.captureImage ? (
                            <button
                              onClick={() =>
                                openImageModal(
                                  log.captureImage!,
                                  `Overview Snapshot - Plate ${log.plateNumber} (${log.gateName.toUpperCase()})`,
                                )
                              }
                              className='px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1 text-xs font-medium'
                              title='View vehicle capture image'
                            >
                              <Camera className='w-3.5 h-3.5 text-cyan-400' />
                              <span>Overview</span>
                            </button>
                          ) : (
                            <span className='text-xs text-slate-600'>
                              No image
                            </span>
                          )}

                          {log.licensePlateImage && (
                            <button
                              onClick={() =>
                                openImageModal(
                                  log.licensePlateImage!,
                                  `Plate Snapshot - Plate ${log.plateNumber} (${log.gateName.toUpperCase()})`,
                                )
                              }
                              className='px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors flex items-center gap-1 text-xs font-medium'
                              title='View license plate crop image'
                            >
                              <ImageIcon className='w-3.5 h-3.5 text-indigo-400' />
                              <span>Plate</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Resident Member Link */}
                      <td className='px-6 py-4'>
                        {log.memberId > 0 && log.memberName ? (
                          <Link
                            to='/members/$id'
                            params={{ id: String(log.memberId) }}
                            preload='intent'
                            className='inline-flex items-center gap-1.5 font-semibold text-slate-200 hover:text-cyan-400 transition-colors group/link'
                          >
                            <Building className='w-3.5 h-3.5 text-indigo-400' />
                            <span>{log.memberName}</span>
                            <ChevronRight className='w-3.5 h-3.5 text-slate-500 group-hover/link:translate-x-0.5 transition-transform' />
                          </Link>
                        ) : (
                          <span className='text-xs text-slate-600 italic'>
                            Non-Member
                          </span>
                        )}
                      </td>

                      {/* Visitor Link */}
                      <td className='px-6 py-4'>
                        {log.visitorId && log.visitorId > 0 ? (
                          <Link
                            to='/visitors/$id'
                            params={{ id: String(log.visitorId) }}
                            preload='intent'
                            className='inline-flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-400 transition-colors group/link'
                          >
                            <User className='w-3.5 h-3.5 text-amber-400' />
                            <span>Visitor #{log.visitorId}</span>
                            <ChevronRight className='w-3.5 h-3.5 text-slate-500 group-hover/link:translate-x-0.5 transition-transform' />
                          </Link>
                        ) : (
                          <span className='text-xs text-slate-600'>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={logs.length}
          filteredCount={filteredLogs.length}
          showingCount={paginatedLogs.length}
          itemLabel='ANPR gate logs'
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Lightbox Image Preview Modal */}
      <ImageLightboxModal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title || ""}
      />
    </div>
  );
};
