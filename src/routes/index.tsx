import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Activity, CheckCircle2, Cpu, Database, Layers, ShieldCheck, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

interface SystemFeature {
  id: string
  name: string
  version: string
  status: 'Operational' | 'Optimized' | 'Active'
  description: string
  category: 'Routing' | 'State' | 'Build' | 'Styling'
}

// Simulated data fetching function for TanStack Query
async function fetchSystemFeatures(): Promise<SystemFeature[]> {
  // Simulate standard network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return [
    {
      id: 'vite',
      name: 'Vite 6',
      version: '^6.1.0',
      status: 'Optimized',
      description: 'Next Generation Frontend Tooling providing HMR and instant startup.',
      category: 'Build',
    },
    {
      id: 'tanstack-router',
      name: 'TanStack Router',
      version: '^1.99.0',
      status: 'Active',
      description: 'Fully type-safe file-based router with auto code-splitting & Search Param APIs.',
      category: 'Routing',
    },
    {
      id: 'tanstack-query',
      name: 'TanStack Query',
      version: '^5.66.0',
      status: 'Operational',
      description: 'Powerful asynchronous state management, caching, background updates & devtools.',
      category: 'State',
    },
    {
      id: 'tailwind-css',
      name: 'Tailwind CSS v4',
      version: '^4.0.6',
      status: 'Optimized',
      description: 'Utility-first CSS framework with native Vite plugin support for high performance.',
      category: 'Styling',
    },
  ]
}

function IndexComponent() {
  const { data: features, isLoading, isError, refetch } = useQuery({
    queryKey: ['system-features'],
    queryFn: fetchSystemFeatures,
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Enterprise SPA Architecture Ready
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            High Performance Modern React Stack
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Configured strictly adhering to project specifications: Vite, React, TypeScript, TanStack Router file-based routing, TanStack Query, and Tailwind CSS.
          </p>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Stack Architecture Status
          </h2>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Activity className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            Refresh Query
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse p-6" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 rounded-xl bg-red-950/30 border border-red-800/50 text-red-400 text-sm">
            Failed to load system status.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features?.map((item) => (
              <div
                key={item.id}
                className="group p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.category === 'Routing' && <Zap className="w-4 h-4 text-cyan-400" />}
                      {item.category === 'State' && <Database className="w-4 h-4 text-emerald-400" />}
                      {item.category === 'Build' && <Cpu className="w-4 h-4 text-amber-400" />}
                      {item.category === 'Styling' && <Layers className="w-4 h-4 text-indigo-400" />}
                      <h3 className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.version}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
