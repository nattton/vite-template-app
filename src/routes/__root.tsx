import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans'>
      <header className='border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg'>
              ⚡
            </div>
            <span className='font-semibold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
              Enterprise SPA Architecture
            </span>
          </div>
          <nav className='flex items-center gap-6 text-sm font-medium'>
            <Link
              to='/'
              className='text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold'
            >
              Dashboard
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to='/members'
                  className='text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold'
                >
                  Members
                </Link>
                <Link
                  to='/registered-users'
                  className='text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold'
                >
                  Registered Users
                </Link>
              </>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link
                  to='/reports'
                  className='text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold'
                >
                  Traffic Reports
                </Link>
                <Link
                  to='/users'
                  className='text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold'
                >
                  Users List
                </Link>
              </>
            )}

            {isAuthenticated && user ? (
              <div className='flex items-center gap-4 pl-4 border-l border-slate-800'>
                <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300'>
                  <UserIcon className='w-3.5 h-3.5 text-indigo-400' />
                  <span className='font-medium text-slate-200'>
                    {user.name}
                  </span>
                  <span className='px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold uppercase'>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className='text-xs px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors flex items-center gap-1.5 font-medium'
                  title='Sign out'
                >
                  <LogOut className='w-3.5 h-3.5' />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to='/login'
                className='px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 [&.active]:bg-indigo-500'
              >
                <LogIn className='w-3.5 h-3.5' />
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Outlet />
      </main>
      <footer className='border-t border-slate-800/80 py-6 text-center text-xs text-slate-500'>
        Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind
        CSS
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
