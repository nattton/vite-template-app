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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<RegisteredUser | null>(null);
  const [qrUser, setQrUser] = useState<RegisteredUser | null>(null);

  const deleteMutation = useDeleteRegisteredUserMutation();

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
        (matchName || matchIdCard || matchPhone || matchGenId || matchAddress)
      );
    });
  }, [users, searchTerm, typeFilter]);

  const handleDelete = async (user: RegisteredUser) => {
    if (
      window.confirm(
        `Are you sure you want to delete registered user "${user.thaiName || user.idCard}"?`,
      )
    ) {
      await deleteMutation.mutateAsync(user.id);
    }
  };

  const handleOpenEdit = (user: RegisteredUser) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  // Expiration helper
  const getExpirationStatus = (dateStr?: string) => {
    if (!dateStr)
      return {
        label: "No Date",
        style: "bg-slate-800 text-slate-400 border-slate-700",
      };

    const expDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil(
      (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );

    if (diffDays < 0) {
      return {
        label: "Expired",
        style: "bg-red-500/10 text-red-400 border-red-500/30",
      };
    }
    if (diffDays <= 14) {
      return {
        label: `Expires in ${diffDays}d`,
        style: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    }
    return {
      label: "Active",
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    };
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <ShieldCheck className='w-3.5 h-3.5' /> Verified Access Control
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Registered Users
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Identity cards, resident profiles, and gate clearance validation
            records.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20'
        >
          <Plus className='w-4 h-4' />
          <span>Add Registered User</span>
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md'>
        {/* Search */}
        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500'>
            <Search className='w-4 h-4' />
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Thai/Eng name, ID Card, phone, address...'
            className='w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
          />
        </div>

        {/* Type filter */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase text-slate-400'>
            <Filter className='w-3.5 h-3.5 text-emerald-400' />
            <span>Category:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className='px-3.5 py-2 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-slate-200 text-sm appearance-none transition-colors max-w-xs'
          >
            <option value='all'>All Categories ({users.length})</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className='rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-300'>
            <thead className='bg-slate-950/70 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800'>
              <tr>
                <th className='px-6 py-4'>User Info</th>
                <th className='px-6 py-4'>ID Card Number</th>
                <th className='px-6 py-4'>Category / Type</th>
                <th className='px-6 py-4'>Contact Phone</th>
                <th className='px-6 py-4'>Expiration Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-800/60'>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-12 text-center text-slate-500 font-medium'
                  >
                    No registered users match your search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const expStatus = getExpirationStatus(user.expiredDate);
                  const photoUrl = user.photo
                    ? user.photo.startsWith("http")
                      ? user.photo
                      : `http://localhost:4000/anpr_store${user.photo}`
                    : null;

                  return (
                    <tr
                      key={user.id}
                      className='hover:bg-slate-800/40 transition-colors group'
                    >
                      {/* Name & Photo */}
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3.5'>
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={user.thaiName}
                              className='w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0'
                              onError={(e) => {
                                // fallback icon on image error
                                (e.target as HTMLElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0'>
                              <UserCheck className='w-5 h-5' />
                            </div>
                          )}

                          <div className='space-y-0.5'>
                            <Link
                              to='/registered-users/$id'
                              params={{ id: String(user.id) }}
                              className='font-bold text-slate-100 group-hover:text-emerald-400 transition-colors block'
                            >
                              {user.thaiName || "Unnamed User"}
                            </Link>
                            {user.engName && (
                              <p className='text-xs text-slate-400 capitalize'>
                                {user.engName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ID Card */}
                      <td className='px-6 py-4'>
                        <span className='px-2.5 py-1 rounded bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs flex items-center gap-1.5 w-fit'>
                          <CreditCard className='w-3.5 h-3.5 text-slate-500' />
                          <span>{user.idCard || "—"}</span>
                        </span>
                      </td>

                      {/* Type */}
                      <td className='px-6 py-4'>
                        <span className='px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-emerald-300 border border-slate-700'>
                          {user.type || "Standard"}
                        </span>
                      </td>

                      {/* Phone */}
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

        {/* Footer */}
        <div className='px-6 py-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between'>
          <span>
            Showing{" "}
            <strong className='text-slate-200'>{filteredUsers.length}</strong>{" "}
            of <strong className='text-slate-200'>{users.length}</strong>{" "}
            registered identities
          </span>
          <span className='font-mono text-slate-500'>CARPARK Security API</span>
        </div>
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
