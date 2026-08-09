import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { User } from '../schemas/userSchema'
import { Search, User as UserIcon, Mail, Phone, MapPin, Building, ChevronRight } from 'lucide-react'

interface UserListTableProps {
  users: User[]
}

export function UserListTable({ users }: UserListTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-indigo-400" /> Users Directory
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse and manage enterprise user profiles with type-safe loader data.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Users Grid / List */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-400">
          No users found matching "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-base">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    ID: #{user.id}
                  </span>
                </div>

                {/* Info List */}
                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{user.address.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{user.company.name}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-800/60 flex justify-end">
                <Link
                  to="/user/$id"
                  params={{ id: String(user.id) }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View Profile <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
