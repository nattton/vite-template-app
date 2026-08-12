import { DatePicker } from "@/components/ui/DatePicker";
import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@tanstack/react-router";
import {
  Building,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  Filter,
  LogOut,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useCheckoutVisitorMutation } from "../api/visitorsApi";
import { Visitor, VisitorFilterParams } from "../schemas/visitorsSchema";
import { VisitorModal } from "./VisitorModal";

interface VisitorListTableProps {
  visitors: Visitor[];
  filters: VisitorFilterParams;
  onFilterChange: (newFilters: VisitorFilterParams) => void;
}

export const VisitorListTable: React.FC<VisitorListTableProps> = ({
  visitors,
  filters,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkoutMutation = useCheckoutVisitorMutation();

  const getTodayDateString = () => new Date().toISOString().split("T")[0];

  const handleDateFromChange = (val: string) => {
    onFilterChange({ ...filters, date: val });
    setCurrentPage(1);
  };

  const handleDateToChange = (val: string) => {
    onFilterChange({ ...filters, dateTo: val });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const isCheckedOut = Boolean(v.exitTime);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "onsite" && !isCheckedOut) ||
        (statusFilter === "exited" && isCheckedOut);

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchStatus;

      const matchPlate = v.plateNumber?.toLowerCase().includes(term);
      const matchName =
        v.thaiName?.toLowerCase().includes(term) ||
        v.engName?.toLowerCase().includes(term);
      const matchIdCard = v.idCard?.toLowerCase().includes(term);
      const matchMember = v.member?.name?.toLowerCase().includes(term);

      return (
        matchStatus && (matchPlate || matchName || matchIdCard || matchMember)
      );
    });
  }, [visitors, searchTerm, statusFilter]);

  const paginatedVisitors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVisitors.slice(start, start + pageSize);
  }, [filteredVisitors, currentPage, pageSize]);

  const handleQuickCheckout = async (visitor: Visitor) => {
    if (!visitor.createdAt) return;

    const dateObj = new Date(visitor.createdAt);
    const pad = (n: number, z = 2) => String(n).padStart(z, "0");
    const barcodeStr = `${dateObj.getFullYear()}${pad(dateObj.getMonth() + 1)}${pad(dateObj.getDate())}${pad(dateObj.getHours())}${pad(dateObj.getMinutes())}${pad(dateObj.getSeconds())}.000`;

    if (
      window.confirm(
        `Confirm checkout for vehicle plate "${visitor.plateNumber}"?`,
      )
    ) {
      try {
        await checkoutMutation.mutateAsync({
          barcode: barcodeStr,
          gateLogId: visitor.gateLogId,
        });
      } catch (err: any) {
        alert(err?.response?.data?.error || err?.message || "Checkout failed");
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldAlert className='w-3.5 h-3.5' /> Visitor Entry Log
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Visitor Gate Operations
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Track incoming visitor vehicles, check-in timestamps, and departure records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>Register Visitor Entry</span>
        </button>
      </div>

      {/* Date & Filter Bar */}
      <div className='flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Search plate number, visitor name, member unit...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        {/* Date Filter Inputs */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Calendar className='w-3.5 h-3.5 text-amber-400' />
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

          {/* Status Filter Dropdown */}
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400 ml-2'>
            <Filter className='w-3.5 h-3.5 text-amber-400' />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className='px-3 py-1.5 bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl text-slate-200 text-xs appearance-none transition-colors'
          >
            <option value='all'>All Records</option>
            <option value='onsite'>Currently On-Site</option>
            <option value='exited'>Checked Out</option>
          </select>
        </div>
      </div>

      {/* Visitors Table Card */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>ID</th>
                <th className='px-6 py-4'>Vehicle Plate</th>
                <th className='px-6 py-4'>Type</th>
                <th className='px-6 py-4'>Visited Unit</th>
                <th className='px-6 py-4'>Entry Time</th>
                <th className='px-6 py-4'>Status / Exit Time</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {paginatedVisitors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No visitor logs found for the selected date range.
                  </td>
                </tr>
              ) : (
                paginatedVisitors.map((visitor) => {
                  const isOnSite = !visitor.exitTime;
                  const entryFormatted = visitor.createdAt
                    ? new Date(visitor.createdAt).toLocaleString("th-TH")
                    : "—";
                  const exitFormatted = visitor.exitTime
                    ? new Date(visitor.exitTime).toLocaleString("th-TH")
                    : null;

                  return (
                    <tr
                      key={visitor.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{visitor.id}
                      </td>

                      {/* Plate Number */}
                      <td className='px-6 py-4'>
                        <Link
                          to='/visitors/$id'
                          params={{ id: String(visitor.id) }}
                          preload='intent'
                          className='font-mono font-bold text-base text-amber-300 group-hover:text-amber-400 transition-colors flex items-center gap-2'
                        >
                          <Car className='w-4 h-4 text-amber-400/80 shrink-0' />
                          <span>{visitor.plateNumber || "NO PLATE"}</span>
                        </Link>
                      </td>

                      {/* Vehicle Type */}
                      <td className='px-6 py-4'>
                        <span className='px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider'>
                          {visitor.type || "car"}
                        </span>
                      </td>

                      {/* Member Unit */}
                      <td className='px-6 py-4'>
                        {visitor.member?.name ? (
                          <span className='font-semibold text-slate-200 flex items-center gap-1.5'>
                            <Building className='w-3.5 h-3.5 text-indigo-400' />
                            {visitor.member.name}
                          </span>
                        ) : (
                          <span className='text-xs text-slate-600 italic'>
                            General Visitor
                          </span>
                        )}
                      </td>

                      {/* Entry Time */}
                      <td className='px-6 py-4 text-xs font-mono text-slate-300'>
                        <div className='flex items-center gap-1.5'>
                          <Clock className='w-3.5 h-3.5 text-emerald-400' />
                          <span>{entryFormatted}</span>
                        </div>
                      </td>

                      {/* Status / Exit Time */}
                      <td className='px-6 py-4'>
                        {isOnSite ? (
                          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30'>
                            <span className='w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping' />
                            Currently On-Site
                          </span>
                        ) : (
                          <div className='space-y-0.5'>
                            <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700'>
                              Exited
                            </span>
                            <p className='text-[11px] font-mono text-slate-500'>
                              {exitFormatted}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          {isOnSite && (
                            <button
                              onClick={() => handleQuickCheckout(visitor)}
                              className='p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors flex items-center gap-1 text-xs font-semibold'
                              title='Checkout visitor'
                            >
                              <LogOut className='w-3.5 h-3.5' />
                              <span>Checkout</span>
                            </button>
                          )}
                          <Link
                            to='/visitors/$id'
                            params={{ id: String(visitor.id) }}
                            preload='intent'
                            className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                            title='View details'
                          >
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                        </div>
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
          totalItems={visitors.length}
          filteredCount={filteredVisitors.length}
          showingCount={paginatedVisitors.length}
          itemLabel='visitor entries'
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Register Modal */}
      <VisitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
