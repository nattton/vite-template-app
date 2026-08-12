import { Pagination } from "@/components/ui/Pagination";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Edit2,
  Loader2,
  Search,
  Shield,
  Trash2,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../api/usersApi";
import { CreateUserInput, UpdateUserInput, User } from "../schemas/usersSchema";

interface UserListTableProps {
  users: User[];
}

export function UserListTable({ users }: UserListTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form states for Create
  const [createForm, setCreateForm] = useState<CreateUserInput>({
    username: "",
    password: "",
    role: "guard",
  });

  // Form states for Edit
  const [editForm, setEditForm] = useState<UpdateUserInput>({
    username: "",
    password: "",
    role: "guard",
  });

  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(createForm, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setCreateForm({ username: "", password: "", role: "guard" });
        showToast("success", "User created successfully");
      },
      onError: (err: any) => {
        showToast("error", err.message || "Failed to create user");
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserMutation.mutate(
      { id: editingUser.id, data: editForm },
      {
        onSuccess: () => {
          setEditingUser(null);
          showToast("success", "User updated successfully");
        },
        onError: (err: any) => {
          showToast("error", err.message || "Failed to update user");
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;

    deleteUserMutation.mutate(deletingUser.id, {
      onSuccess: () => {
        setDeletingUser(null);
        showToast("success", "User deleted successfully");
      },
      onError: (err: any) => {
        showToast("error", err.message || "Failed to delete user");
      },
    });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      username: user.name,
      role: user.role,
    });
  };

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg transition-all animate-in fade-in duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-800 text-emerald-200"
              : "bg-red-950/90 border-red-800 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className='w-5 h-5 text-emerald-400 shrink-0' />
          ) : (
            <AlertCircle className='w-5 h-5 text-red-400 shrink-0' />
          )}
          <span className='text-sm font-medium'>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className='ml-2 text-slate-400 hover:text-slate-200'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md'>
        <div>
          <h1 className='text-2xl font-bold text-slate-100 flex items-center gap-2'>
            <UserIcon className='w-6 h-6 text-indigo-400' /> Admin Users
            Management
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Manage system administrators and guard accounts with REST endpoints.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {/* Search Input */}
          <div className='relative min-w-[220px]'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500'>
              <Search className='w-4 h-4' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Search user name or role...'
              className='w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors'
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20 shrink-0'
          >
            <UserPlus className='w-4 h-4' /> Create User
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {paginatedUsers.length === 0 ? (
        <div className='p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-400'>
          No users found matching "{searchTerm}".
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className='group bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between'
              >
                <div className='space-y-4'>
                  {/* User Card Header */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-11 w-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-base uppercase'>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className='font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors'>
                          {user.name}
                        </h3>
                        <span className='inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 mt-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700'>
                          <Shield className='w-3 h-3' /> {user.role}
                        </span>
                      </div>
                    </div>
                    <span className='text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60'>
                      #{user.id}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='pt-5 mt-4 border-t border-slate-800/60 flex items-center justify-between'>
                  <Link
                    to='/users/$id'
                    params={{ id: String(user.id) }}
                    preload='intent'
                    className='inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-indigo-300 transition-colors'
                  >
                    Details <ChevronRight className='w-3.5 h-3.5' />
                  </Link>

                  <div className='flex items-center gap-1.5'>
                    <button
                      onClick={() => openEditModal(user)}
                      className='p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors border border-slate-700/60'
                      title='Edit user'
                    >
                      <Edit2 className='w-3.5 h-3.5' />
                    </button>
                    <button
                      onClick={() => setDeletingUser(user)}
                      className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors'
                      title='Delete user'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className='rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden'>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={users.length}
              filteredCount={filteredUsers.length}
              showingCount={paginatedUsers.length}
              itemLabel='users'
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-4'>
              <h2 className='text-lg font-bold text-slate-100 flex items-center gap-2'>
                <UserPlus className='w-5 h-5 text-indigo-400' /> Create New User
              </h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className='text-slate-400 hover:text-slate-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  Username
                </label>
                <input
                  type='text'
                  required
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  placeholder='e.g. guard_john'
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  Password
                </label>
                <input
                  type='password'
                  required
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  placeholder='••••••••'
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  Role
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      role: e.target.value as "admin" | "guard",
                    })
                  }
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                >
                  <option value='guard'>Guard</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-slate-800'>
                <button
                  type='button'
                  onClick={() => setIsCreateOpen(false)}
                  className='px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-medium'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={createUserMutation.isPending}
                  className='inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50'
                >
                  {createUserMutation.isPending && (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  )}
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-4'>
              <h2 className='text-lg font-bold text-slate-100 flex items-center gap-2'>
                <Edit2 className='w-5 h-5 text-indigo-400' /> Edit User #
                {editingUser.id}
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className='text-slate-400 hover:text-slate-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  Username
                </label>
                <input
                  type='text'
                  required
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  New Password{" "}
                  <span className='text-slate-500 font-normal lowercase'>
                    (leave empty to keep current)
                  </span>
                </label>
                <input
                  type='password'
                  value={editForm.password || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  placeholder='••••••••'
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5'>
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      role: e.target.value as "admin" | "guard",
                    })
                  }
                  className='w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm'
                >
                  <option value='guard'>Guard</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-slate-800'>
                <button
                  type='button'
                  onClick={() => setEditingUser(null)}
                  className='px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-medium'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={updateUserMutation.isPending}
                  className='inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50'
                >
                  {updateUserMutation.isPending && (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150'>
            <div className='flex items-center justify-between border-b border-slate-800 pb-4'>
              <h2 className='text-lg font-bold text-red-400 flex items-center gap-2'>
                <AlertCircle className='w-5 h-5' /> Confirm Deletion
              </h2>
              <button
                onClick={() => setDeletingUser(null)}
                className='text-slate-400 hover:text-slate-200'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <p className='text-slate-300 text-sm'>
              Are you sure you want to delete user account{" "}
              <strong className='text-white font-semibold'>
                {deletingUser.name}
              </strong>{" "}
              (#{deletingUser.id})? This action cannot be undone.
            </p>

            <div className='flex justify-end gap-3 pt-4 border-t border-slate-800'>
              <button
                type='button'
                onClick={() => setDeletingUser(null)}
                className='px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-sm font-medium'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteConfirm}
                disabled={deleteUserMutation.isPending}
                className='inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors disabled:opacity-50'
              >
                {deleteUserMutation.isPending && (
                  <Loader2 className='w-4 h-4 animate-spin' />
                )}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
