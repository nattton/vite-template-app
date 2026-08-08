import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
              ⚡
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise SPA Architecture
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors [&.active]:text-indigo-400 [&.active]:font-semibold"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Vite + React + TypeScript + TanStack Router + TanStack Query + Tailwind CSS
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}
