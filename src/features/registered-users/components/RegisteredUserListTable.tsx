import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  Edit2,
  Filter,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useDeleteRegisteredUserMutation } from "../api/registeredUsersApi";
import { RegisteredUser } from "../schemas/registeredUsersSchema";
import { RegisteredUserModal } from "./RegisteredUserModal";
import { RegisteredUserQrModal } from "./RegisteredUserQrModal";

interface RegisteredUserListTableProps {
  users: RegisteredUser[];
}

export const RegisteredUserListTable: React.FC<
  RegisteredUserListTableProps
> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<RegisteredUser | null>(null);
  const [qrUser, setQrUser] = useState<RegisteredUser | null>(null);

  const deleteMutation = useDeleteRegisteredUserMutation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  // Extract unique types for filter dropdown
  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.type) set.add(u.type);
    });
    return Array.from(set).sort();
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchType = typeFilter === "all" || u.type === typeFilter;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchType;

      const matchName =
        u.thaiName?.toLowerCase().includes(term) ||
        u.engName?.toLowerCase().includes(term);
      const matchIdCard = u.idCard?.toLowerCase().includes(term);
      const matchPhone = u.telephone?.toLowerCase().includes(term);
      const matchGenId = u.generatedId?.toLowerCase().includes(term);
      const matchAddress = u.address?.toLowerCase().includes(term);

      return (
        matchType &&
        (matchName ||
          matchIdCard ||
          matchPhone ||
          matchGenId ||
          matchAddress)
      );
    });
  }, [users, searchTerm, typeFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const getExpirationStatus = (expiredDateStr?: string) => {
    if (!expiredDateStr)
      return {
        label: "Unlimited",
        style: "bg-slate-800 text-slate-400 border-slate-700",
      };

    const exp = new Date(expiredDateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      return {
        label: "Expired",
        style: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      };
    } else if (diffDays <= 7) {
      return {
        label: `Expiring in ${diffDays}d`,
        style: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: "Active",
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    };
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: RegisteredUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: RegisteredUser) => {
    const displayName = user.thaiName || user.engName || `#${user.id}`;
    if (
      window.confirm(
        `Are you sure you want to delete registered user "${displayName}"?`,
      )
    ) {
      try {
        await deleteMutation.mutateAsync(user.id);
      } catch (err: any) {
        alert(err?.response?.data?.error || err?.message || "Delete failed");
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldCheck className='w-3.5 h-3.5' /> Security Clearance Registry
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Registered Users & Access Passes
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Authorized visitor credentials, VIP identities, contractors, and QR pass generators.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>Register New Pass</span>
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
            placeholder='Search name, ID card number, phone, generated UUID token...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Filter className='w-3.5 h-3.5 text-emerald-400' />
            <span>Category:</span>
          </div>
          <select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className='px-3.5 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-200 text-xs font-medium appearance-none transition-colors capitalize'
          >
            <option value='all'>All Categories ({users.length})</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
                <th className='px-6 py-4'>Cardholder Name</th>
                <th className='px-6 py-4'>Category</th>
                <th className='px-6 py-4'>ID Card Number</th>
                <th className='px-6 py-4'>Telephone</th>
                <th className='px-6 py-4'>Access Pass Validity</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No registered access passes match your query.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const expStatus = getExpirationStatus(user.expiredDate);
                  const displayName =
                    user.thaiName || user.engName || "Unnamed Cardholder";

                  return (
                    <tr
                      key={user.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      <td className='px-6 py-4 font-mono text-xs text-slate-500'>
                        #{user.id}
                      </td>

                      {/* Name */}
                      <td className='px-6 py-4'>
                        <Link
                          to='/registered-users/$id'
                          params={{ id: String(user.id) }}
                          preload='intent'
                          className='font-bold text-slate-100 hover:text-emerald-400 transition-colors flex items-center gap-2'
                        >
                          <UserCheck className='w-4 h-4 text-emerald-400 shrink-0' />
                          <span>{displayName}</span>
                        </Link>
                        {user.engName && user.thaiName && (
                          <p className='text-xs text-slate-400 font-normal pl-6'>
                            {user.engName}
                          </p>
                        )}
                      </td>

                      {/* Category Type */}
                      <td className='px-6 py-4'>
                        <span className='px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-emerald-300 border border-slate-700 capitalize tracking-wider'>
                          {user.type || "visitor"}
                        </span>
                      </td>

                      {/* ID Card */}
                      <td className='px-6 py-4 font-mono text-xs text-slate-300'>
                        {user.idCard ? (
                          <span className='flex items-center gap-1.5'>
                            <CreditCard className='w-3.5 h-3.5 text-slate-500' />
                            {user.idCard}
                          </span>
                        ) : (
                          <span className='text-slate-600 italic'>N/A</span>
                        )}
                      </td>

                      {/* Telephone */}
                      <td className='px-6 py-4 text-slate-400'>
                        {user.telephone || (
                          <span className='text-slate-600 text-xs italic'>
                            No phone
                          </span>
                        )}
                      </td>

                      {/* Expiration Date */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${expStatus.style}`}
                          >
                            {expStatus.label}
                          </span>
                          {user.expiredDate && (
                            <span className='text-xs text-slate-400 font-mono flex items-center gap-1'>
                              <Calendar className='w-3 h-3 text-slate-500' />
                              {user.expiredDate.split("T")[0]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className='px-6 py-4 text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            onClick={() => setQrUser(user)}
                            className='p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors'
                            title='Generate QR Pass'
                          >
                            <QrCode className='w-4 h-4' />
                          </button>
                          <Link
                            to='/registered-users/$id'
                            params={{ id: String(user.id) }}
                            preload='intent'
                            className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                            title='View details'
                          >
                            <ChevronRight className='w-4 h-4' />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(user)}
                            className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors'
                            title='Edit registered user'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className='p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors'
                            title='Delete registered user'
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
          totalItems={users.length}
          filteredCount={filteredUsers.length}
          showingCount={paginatedUsers.length}
          itemLabel='registered access passes'
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Edit Modal */}
      <RegisteredUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={userToEdit}
      />

      {/* QR Code Pass Modal */}
      <RegisteredUserQrModal
        isOpen={Boolean(qrUser)}
        onClose={() => setQrUser(null)}
        user={qrUser}
      />
    </div>
  );
};
