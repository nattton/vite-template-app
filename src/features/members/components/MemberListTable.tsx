import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@tanstack/react-router";
import {
  Car,
  ChevronRight,
  Edit2,
  Filter,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useDeleteMemberMutation } from "../api/membersApi";
import { Member, Vehicle } from "../schemas/membersSchema";
import { MemberModal } from "./MemberModal";
import { VehicleModal } from "./VehicleModal";

interface MemberListTableProps {
  members: Member[];
}

export const MemberListTable: React.FC<MemberListTableProps> = ({
  members,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleMemberId, setVehicleMemberId] = useState<number | null>(null);

  const deleteMutation = useDeleteMemberMutation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchStatus =
        statusFilter === "all" ||
        member.status?.toLowerCase() === statusFilter.toLowerCase();

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchStatus;

      const matchName = member.name?.toLowerCase().includes(term);
      const matchPhone = member.telephone?.toLowerCase().includes(term);
      const matchAddress = member.address?.toLowerCase().includes(term);
      const matchVehicles = member.vehicles?.some(
        (v) =>
          v.plateNumber?.toLowerCase().includes(term) ||
          v.brand?.toLowerCase().includes(term) ||
          v.color?.toLowerCase().includes(term),
      );

      return (
        matchStatus &&
        (matchName || matchPhone || matchAddress || matchVehicles)
      );
    });
  }, [members, searchTerm, statusFilter]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  const handleOpenCreate = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleOpenAddVehicle = (memberId: number) => {
    setVehicleMemberId(memberId);
    setIsVehicleModalOpen(true);
  };

  const handleDelete = async (member: Member) => {
    if (
      window.confirm(
        `Are you sure you want to delete member unit "${member.name}"?`,
      )
    ) {
      try {
        await deleteMutation.mutateAsync(member.id);
      } catch (err: any) {
        alert(err?.response?.data?.error || err?.message || "Delete failed");
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Bar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <UserCheck className='w-3.5 h-3.5' /> Community Directory
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Resident Members Directory
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Manage residential unit profiles, registered vehicles, contact
            numbers, and access rights.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>Add Member Unit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Search unit, member name, phone number, vehicle plate...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Filter className='w-3.5 h-3.5 text-indigo-400' />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className='px-3.5 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-200 text-xs font-medium appearance-none transition-colors'
          >
            <option value='all'>All Statuses</option>
            <option value='active'>Active Only</option>
            <option value='overdue'>Overdue Only</option>
            <option value='suspended'>Suspended Only</option>
            <option value='inactive'>Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>ID</th>
                <th className='px-6 py-4'>Unit / Name</th>
                <th className='px-6 py-4'>Telephone</th>
                <th className='px-6 py-4'>Type</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Registered Vehicles</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No members match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => {
                  const statusStyle =
                    member.status?.toLowerCase() === "active"
                      ? {
                          badge:
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                          dot: "bg-emerald-400 animate-pulse",
                        }
                      : member.status?.toLowerCase() === "overdue"
                        ? {
                            badge:
                              "bg-rose-500/10 text-rose-400 border-rose-500/30",
                            dot: "bg-rose-400 animate-ping",
                          }
                        : member.status?.toLowerCase() === "suspended"
                          ? {
                              badge:
                                "bg-red-500/10 text-red-400 border-red-500/30",
                              dot: "bg-red-400",
                            }
                          : {
                              badge:
                                "bg-amber-500/10 text-amber-400 border-amber-500/30",
                              dot: "bg-amber-400",
                            };

                  return (
                    <tr
                      key={member.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{member.id}
                      </td>

                      {/* Name / Unit */}
                      <td className='px-6 py-4'>
                        <Link
                          to='/members/$id'
                          params={{ id: String(member.id) }}
                          preload='intent'
                          className='font-bold text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-2'
                        >
                          <Users className='w-4 h-4 text-indigo-400 shrink-0' />
                          <span>{member.name}</span>
                        </Link>
                      </td>

                      {/* Telephone */}
                      <td className='px-6 py-4 text-slate-400'>
                        {member.telephone || (
                          <span className='text-slate-600 text-xs italic'>
                            No contact
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className='px-6 py-4'>
                        <span className='px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider'>
                          {member.type || "resident"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {member.status || "active"}
                        </span>
                      </td>

                      {/* Vehicles */}
                      <td className='px-6 py-4'>
                        <div className='flex flex-wrap items-center gap-1.5 max-w-xs'>
                          {member.vehicles && member.vehicles.length > 0 ? (
                            member.vehicles.map((v: Vehicle) => (
                              <span
                                key={v.id}
                                className='px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono flex items-center gap-1'
                                title={`${v.brand || "Vehicle"} (${v.color || ""})`}
                              >
                                <Car className='w-3 h-3 text-cyan-400' />
                                <span>{v.plateNumber}</span>
                              </span>
                            ))
                          ) : (
                            <span className='text-xs text-slate-600 italic'>
                              No vehicles
                            </span>
                          )}
                          <button
                            onClick={() => handleOpenAddVehicle(member.id)}
                            className='p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors ml-1'
                            title='Add vehicle'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link
                            to='/members/$id'
                            params={{ id: String(member.id) }}
                            preload='intent'
                            className='p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors'
                            title='View details'
                          >
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                            title='Edit member'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className='p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors'
                            title='Delete member'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
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
          totalItems={members.length}
          filteredCount={filteredMembers.length}
          showingCount={paginatedMembers.length}
          itemLabel='members'
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Member Create/Edit Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
      />

      {/* Vehicle Add Modal */}
      {vehicleMemberId && (
        <VehicleModal
          isOpen={isVehicleModalOpen}
          onClose={() => {
            setIsVehicleModalOpen(false);
            setVehicleMemberId(null);
          }}
          memberId={vehicleMemberId}
        />
      )}
    </div>
  );
};
