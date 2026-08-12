import { Link } from "@tanstack/react-router";
import { ArrowLeft, Shield, User as UserIcon } from "lucide-react";
import { User } from "../schemas/usersSchema";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className='max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6'>
      <div className='flex items-center justify-between'>
        <Link
          to='/users'
          className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors'
        >
          <ArrowLeft className='w-4 h-4' /> Back to Users
        </Link>
        <span className='text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300'>
          ID: #{user.id}
        </span>
      </div>

      <div className='flex items-center gap-4 pb-6 border-b border-slate-800'>
        <div className='h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-2xl uppercase'>
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className='text-2xl font-bold text-slate-100'>{user.name}</h1>
          <p className='text-slate-400 text-sm'>User Account Profile</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div className='flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-800'>
          <UserIcon className='w-5 h-5 text-indigo-400' />
          <div>
            <p className='text-xs text-slate-400 font-medium'>User ID</p>
            <p className='text-slate-100 font-semibold'>#{user.id}</p>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-800'>
          <Shield className='w-5 h-5 text-cyan-400' />
          <div>
            <p className='text-xs text-slate-400 font-medium'>System Role</p>
            <p className='text-slate-100 font-semibold uppercase tracking-wide text-xs px-2 py-0.5 mt-0.5 inline-block rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'>
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
