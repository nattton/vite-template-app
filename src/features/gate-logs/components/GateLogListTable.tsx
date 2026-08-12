import { DatePicker } from "@/components/ui/DatePicker";
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
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [gateFilter, setGateFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const getTodayDateString = () => new Date().toISOString().split("T")[0];

  const handleDateFromChange = (val: string) => {
    onFilterChange({ ...filters, date: val });
  };

  const handleDateToChange = (val: string) => {
    onFilterChange({ ...filters, dateTo: val });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchGate =
        gateFilter === "all" || item.gateName.toLowerCase() === gateFilter;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchGate;

      const matchPlate = item.plateNumber.toLowerCase().includes(term);
      const matchAnpr = item.anpr.toLowerCase().includes(term);
      const matchMember = item.memberName.toLowerCase().includes(term);
      const matchVisitorMember = item.visitorMemberName
        .toLowerCase()
        .includes(term);

      return (
        matchGate &&
        (matchPlate || matchAnpr || matchMember || matchVisitorMember)
      );
    });
  }, [logs, searchTerm, gateFilter]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldCheck className='w-3.5 h-3.5' /> ANPR Gate Audit Stream
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Gate Transaction Logs
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Real-time optical license plate recognition (ANPR) event history
            across all gates.
          </p>
        </div>
      </div>

      {/* Date & Filter Controls */}
      <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search license plate, ANPR, member unit...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        {/* Date & Gate Filter Inputs */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Calendar className='w-3.5 h-3.5 text-cyan-400' />
            <span>Date:</span>
          </div>

          <div className='w-40'>
            <DatePicker
              value={filters.date || getTodayDateString()}
              onChange={(val) => handleDateFromChange(val || getTodayDateString())}
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
            <span>Gate:</span>
          </div>
          <select
            value={gateFilter}
            onChange={(e) => setGateFilter(e.target.value)}
            className='px-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-200 text-xs appearance-none transition-colors'
          >
            <option value='all'>All Gates</option>
            <option value='in'>IN Gate Entry</option>
            <option value='out'>OUT Gate Exit</option>
          </select>
        </div>
      </div>

      {/* Gate Logs Table */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>ID</th>
                <th className='px-6 py-4'>Timestamp</th>
                <th className='px-6 py-4'>Gate</th>
                <th className='px-6 py-4'>License Plate (ANPR)</th>
                <th className='px-6 py-4'>Associated Unit / Member</th>
                <th className='px-6 py-4 text-center'>Capture Preview</th>
                <th className='px-6 py-4 text-right'>Details</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No gate transactions found for the selected date range.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isIn = log.gateName.toLowerCase() === "in";
                  const formattedTime = log.createdAt
                    ? new Date(log.createdAt).toLocaleString("th-TH")
                    : "—";

                  const imageUrl = log.captureImage
                    ? log.captureImage.startsWith("http")
                      ? log.captureImage
                      : `http://localhost:4000/anpr_store${log.captureImage}`
                    : null;

                  return (
                    <tr
                      key={log.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{log.id}
                      </td>

                      {/* Timestamp */}
                      <td className='px-6 py-4 text-xs font-mono text-slate-300'>
                        <div className='flex items-center gap-1.5'>
                          <Clock className='w-3.5 h-3.5 text-slate-500' />
                          <span>{formattedTime}</span>
                        </div>
                      </td>

                      {/* Gate Name Badge */}
                      <td className='px-6 py-4'>
                        {isIn ? (
                          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'>
                            <ArrowDownLeft className='w-3.5 h-3.5' />
                            IN GATE
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30'>
                            <ArrowUpRight className='w-3.5 h-3.5' />
                            OUT GATE
                          </span>
                        )}
                      </td>

                      {/* License Plate */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <Car className='w-4 h-4 text-cyan-400 shrink-0' />
                          <span className='font-mono font-bold text-base text-cyan-300 group-hover:text-cyan-200 transition-colors'>
                            {log.plateNumber || log.anpr || "UNKNOWN"}
                          </span>
                        </div>
                      </td>

                      {/* Member / Visitor Unit */}
                      <td className='px-6 py-4'>
                        {log.memberName && log.memberName !== "visitor" ? (
                          <div className='flex items-center gap-2'>
                            <Building className='w-3.5 h-3.5 text-indigo-400' />
                            <span className='font-semibold text-slate-200'>
                              Unit {log.memberName}
                            </span>
                            {log.memberId > 0 && (
                              <Link
                                to='/members/$id'
                                params={{ id: String(log.memberId) }}
                                preload='intent'
                                className='text-[11px] font-mono text-indigo-400 hover:underline'
                              >
                                (#{log.memberId})
                              </Link>
                            )}
                          </div>
                        ) : log.visitorMemberName ? (
                          <div className='flex items-center gap-2'>
                            <User className='w-3.5 h-3.5 text-amber-400' />
                            <span className='font-medium text-amber-300'>
                              Visitor to {log.visitorMemberName}
                            </span>
                            {log.visitorId > 0 && (
                              <Link
                                to='/visitors/$id'
                                params={{ id: String(log.visitorId) }}
                                preload='intent'
                                className='text-[11px] font-mono text-amber-400 hover:underline'
                              >
                                (Visitor #{log.visitorId})
                              </Link>
                            )}
                          </div>
                        ) : (
                          <span className='text-xs text-slate-500 italic'>
                            General Visitor
                          </span>
                        )}
                      </td>

                      {/* Image Thumbnail */}
                      <td className='px-6 py-4 text-center'>
                        {imageUrl ? (
                          <button
                            onClick={() =>
                              setSelectedImage({
                                url: imageUrl,
                                title: `Plate ${log.plateNumber || log.anpr} (${log.gateName.toUpperCase()} Gate)`,
                              })
                            }
                            className='relative inline-block rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all group/img'
                          >
                            <img
                              src={imageUrl}
                              alt={log.anpr}
                              className='w-16 h-10 object-cover group-hover/img:scale-110 transition-transform'
                            />
                            <div className='absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-cyan-300'>
                              <ImageIcon className='w-4 h-4' />
                            </div>
                          </button>
                        ) : (
                          <span className='text-xs text-slate-600 italic'>
                            No Capture
                          </span>
                        )}
                      </td>

                      {/* Action Details */}
                      <td className='px-6 py-4 text-right'>
                        {log.visitorId > 0 ? (
                          <Link
                            to='/visitors/$id'
                            params={{ id: String(log.visitorId) }}
                            preload='intent'
                            className='p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors inline-flex items-center gap-1 text-xs font-semibold'
                            title='View visitor record'
                          >
                            <span>Visitor</span>
                            <ChevronRight className='w-3.5 h-3.5' />
                          </Link>
                        ) : log.memberId > 0 ? (
                          <Link
                            to='/members/$id'
                            params={{ id: String(log.memberId) }}
                            preload='intent'
                            className='p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors inline-flex items-center gap-1 text-xs font-semibold'
                            title='View member unit'
                          >
                            <span>Member</span>
                            <ChevronRight className='w-3.5 h-3.5' />
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

        {/* Footer */}
        <div className='px-6 py-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between'>
          <span>
            Showing{" "}
            <strong className='text-slate-200'>{filteredLogs.length}</strong> of{" "}
            <strong className='text-slate-200'>{logs.length}</strong> ANPR gate
            logs
          </span>
          <span className='font-mono text-slate-500'>CARPARK ANPR Engine</span>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200'>
          <div className='relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
              <h3 className='text-base font-bold text-slate-100 flex items-center gap-2'>
                <Camera className='w-5 h-5 text-cyan-400' />
                <span>{selectedImage.title}</span>
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className='p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[70vh]'>
              <img
                src={selectedImage.url}
                alt='ANPR Full Capture'
                className='w-full h-full object-contain max-h-[70vh]'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
