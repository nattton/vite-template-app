import {
  Building,
  Globe,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { User } from "../schemas/userSchema";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className='max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6'>
      <div className='flex items-center gap-4 pb-6 border-b border-slate-800'>
        <div className='h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400'>
          <UserIcon className='w-8 h-8' />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-slate-100'>{user.name}</h1>
          <p className='text-slate-400 text-sm'>@{user.username}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div className='flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800'>
          <Mail className='w-4 h-4 text-indigo-400' />
          <div>
            <p className='text-xs text-slate-500 font-medium'>Email</p>
            <p className='text-slate-200'>{user.email}</p>
          </div>
        </div>

        <div className='flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800'>
          <Phone className='w-4 h-4 text-cyan-400' />
          <div>
            <p className='text-xs text-slate-500 font-medium'>Phone</p>
            <p className='text-slate-200'>{user.phone}</p>
          </div>
        </div>

        <div className='flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800'>
          <Globe className='w-4 h-4 text-emerald-400' />
          <div>
            <p className='text-xs text-slate-500 font-medium'>Website</p>
            <p className='text-slate-200'>{user.website}</p>
          </div>
        </div>

        <div className='flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-800'>
          <MapPin className='w-4 h-4 text-amber-400' />
          <div>
            <p className='text-xs text-slate-500 font-medium'>Location</p>
            <p className='text-slate-200'>
              {user.address.city}, {user.address.street}
            </p>
          </div>
        </div>
      </div>

      <div className='pt-4 border-t border-slate-800/80'>
        <div className='flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-800/60'>
          <Building className='w-5 h-5 text-indigo-400 mt-0.5' />
          <div>
            <p className='text-xs text-slate-500 font-medium'>Company</p>
            <p className='text-slate-200 font-semibold'>{user.company.name}</p>
            <p className='text-slate-400 text-xs mt-1 italic'>
              "{user.company.catchPhrase}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
