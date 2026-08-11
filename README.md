# Enterprise Frontend Tech Stack & Architecture Decision Document

## 1. Executive Summary & Tech Stack Overview

This document outlines the finalized frontend architecture and tech stack for a pure client-side Single Page Application (SPA). The application operates without remote server state management, deploying strictly as static files to CDN edge hosting (AWS S3 + CloudFront, Cloudflare Pages, Vercel Static, NGINX).

| Category                         | Technology                    | Rationale / Key Benefit                                                                         |
| :------------------------------- | :---------------------------- | :---------------------------------------------------------------------------------------------- |
| **Build System & Dev Server**    | **Vite** + TypeScript         | Instant HMR, native ES modules, lightweight production bundles, zero Node.js server overhead.   |
| **UI Framework**                 | **React 19** (Strict Mode)    | Industry-standard UI layer with vast ecosystem and long-term enterprise viability.              |
| **Routing**                      | **TanStack Router**           | Strict end-to-end type safety, search parameters as first-class state, in-browser route tree.   |
| **Server State & Caching**       | **TanStack Query** (v5)       | Automatic background revalidation, request deduplication, in-memory SWR cache, optimistic UI.   |
| **Client State & Persistence**   | **Zustand** (+ `persist`)     | Lightweight (~1.1KB) providerless client state manager with native LocalStorage/IndexedDB sync. |
| **UI Component Primitives**      | **Shadcn UI** + **Radix UI**  | Headless, 100% accessible primitives owned within codebase (no rigid npm dependency locks).     |
| **Styling Engine**               | **Tailwind CSS v4**           | Utility-first CSS engine with zero-runtime overhead and complete design-system tokens.          |
| **Forms & Validation**           | **React Hook Form** + **Zod** | High-performance uncontrolled form handling with strict schema validation.                      |
| **HTTP Client & Schema Parsing** | **Axios** + **Zod**           | Centralized HTTP transport with strict runtime contract validation.                             |
| **Quality Assurance**            | **Vitest** + **Playwright**   | Lightning-fast unit testing via Vite engine + cross-browser end-to-end automation.              |

### 1.1 Architecture Classification & Core Principles

This application is engineered using a **Feature-Driven Pure Static SPA Architecture** defined by three primary paradigms:

1. **Feature-Driven Architecture (Domain-Driven Module Structure)**:
   - Code is organized by business domain modules inside `src/features/<feature-name>/` co-locating API fetchers, Zod validation schemas, UI components, and types.
   - Promotes feature isolation, high team velocity, and easy refactoring.

2. **Pure Static SPA Architecture (Zero Node.js Server Overhead)**:
   - The application compiles strictly to static HTML/CSS/JS assets (`dist/`) via Vite with **zero Node.js runtime process dependency**.
   - Deploys directly to static CDN edge hosting (AWS S3 + CloudFront, Cloudflare Pages, Vercel Static, NGINX) for high performance and low maintenance.

3. **URL-Driven State Architecture**:
   - URL paths and search query parameters (managed by TanStack Router with Zod validation) serve as the single source of truth for bookmarkable UI states and navigation.

---

## 2. Core Architectural Decisions & Comparisons

### Decision 1: Vite vs. Next.js (App Router)

#### **Winner:** Vite (Pure Static SPA Architecture)

#### **Context & Rationale:**

The application is a client-only **Single Page Application (SPA)** deployed strictly as static files (`dist/`). Since there is no server-side rendering (SSR), dynamic HTML generation, or server action requirement, Vite builds lightning-fast static bundles without requiring Node.js server infrastructure.

#### **Comparison Matrix:**

| Feature / Metric            | Vite (React SPA)                                       | Next.js (App Router)                                                |
| :-------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------ |
| **Server Requirement**      | 🟢 **None** (Static assets hosted on S3 / CDN / NGINX) | 🔴 Node.js server process required (or Vercel serverless functions) |
| **Cold Start / Dev Server** | ⚡ **Instant** (< 300ms via native ESM)                | 🟡 Slower compilation time per page                                 |
| **Deployment Complexity**   | 🟢 Simple (Ship `dist/` directory to static edge host) | 🟡 Requires container management, SSR scaling, and Node runtime     |
| **Initial JS Payload**      | 🟢 Minimal (~40-50KB framework baseline)               | 🟡 Heavier (~90-120KB+ framework runtime)                           |
| **Hosting Cost**            | 🟢 **Pennies / Free Tier** on CDN edge static hosting  | 🟡 Ongoing Node.js compute or Serverless execution costs            |

#### **Verdict:**

Next.js introduces unnecessary operational complexity, SSR server requirements, and hosting costs when server rendering is not needed. Vite provides instant development feedback loops and zero-maintenance static deployments.

---

### Decision 2: TanStack Router vs. React Router v7

#### **Winner:** TanStack Router (`@tanstack/react-router`)

#### **Context & Rationale:**

Client-only SPAs heavily rely on URL search parameters and path state for deep-linking, tab switching, and bookmarkable UI states. TanStack Router treats search parameters as first-class, fully typed state.

#### **Comparison Matrix:**

| Feature                           | TanStack Router                                                             | React Router v7                                                                |
| :-------------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **TypeScript Integration**        | 🟢 **100% End-to-End Strict** (Routes, path params, query params)           | 🟡 Basic / Opt-in (Path params default to string/undefined)                    |
| **Search Params (Query Strings)** | 🟢 **First-class State.** Auto-parsed and validated via Zod/Valibot schemas | 🔴 Un-typed `URLSearchParams`. Requires manual string parsing & useEffect sync |
| **Devtools & Ergonomics**         | Dedicated router devtools with route tree inspection                        | Standard React developer tools                                                 |
| **Code Splitting**                | Automatic route-based lazy loading via Vite plugin                          | Manual `lazy()` or route manifest configuration                                |

#### **Verdict:**

TanStack Router provides unmatched type safety. Catching invalid route parameters and query strings at compile time drastically reduces runtime bugs in client-side navigation.

---

### Decision 3: Zustand (+ Persist Middleware) vs. Redux Toolkit / React Context

#### **Winner:** Zustand

#### **Context & Rationale:**

In an application with no remote server state, all application state (user preferences, draft data, UI toggles, local persistence) lives inside the browser. React Context introduces re-render bottlenecks, while Redux Toolkit adds heavy boilerplate and `<Provider>` wrappers. **Zustand** offers a lightweight (~1.1KB), providerless client store with built-in persistence to `localStorage` or `IndexedDB`.

#### **Comparison Matrix:**

| Feature / Metric              | Zustand (+ `persist`)                                               | Redux Toolkit (RTK)                                              | React Context API                                               |
| :---------------------------- | :------------------------------------------------------------------ | :--------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Bundle Size**               | ⚡ **~1.1–1.5 KB** (gzipped)                                        | 🟡 ~11–13 KB (gzipped)                                           | 🟢 Built into React                                             |
| **Boilerplate & Ceremony**    | 🟢 **Minimal** (Single function store definition)                   | 🔴 High (Slices, action creators, reducers, store configuration) | 🟡 Moderate (Custom context, provider components, custom hooks) |
| **Browser Storage Sync**      | 🟢 **Built-in `persist` middleware** (LocalStorage/IndexedDB)       | 🟡 Requires Redux Persist third-party integration                | 🔴 Manual `useEffect` sync required per state variable          |
| **Re-render Performance**     | 🟢 **Granular state selectors** (components re-render only on pick) | 🟢 Granular selectors (`useSelector`)                            | 🔴 Unoptimized (All consumers re-render on any context change)  |
| **React Context Requirement** | 🟢 **None** (Can be accessed inside or outside React lifecycle)     | 🔴 Required (`<Provider store={store}>`)                         | 🔴 Required (`<MyContext.Provider value={...}>`)                |

#### **Key Code Comparison — Defining & Consuming Persisted Client State:**

```tsx
// --- Zustand: Single store definition with automatic LocalStorage persistence ---
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  theme: "light" | "dark";
  isSidebarOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
}

export const usePreferencesStore = create<UserPreferences>()(
  persist(
    (set) => ({
      theme: "dark",
      isSidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: "app-preferences", // Key in localStorage
    },
  ),
);

// Component consumption (Direct hook call anywhere in app, no <Provider>)
export function ThemeToggle() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Current: {theme}
    </button>
  );
}
```

```tsx
// --- React Context: High boilerplate & manual LocalStorage sync ---
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

#### **Verdict:**

Zustand eliminates context-provider wrapping, prevents unnecessary UI re-renders, and provides out-of-the-box browser storage persistence with zero boilerplate.

---

### Decision 4: Axios + Zod Runtime Validation vs. Standalone Fetch / Axios Alone (TS Generics)

#### **Winner:** Axios + Zod Schema Validation

#### **Context & Rationale:**

Using compile-time TypeScript interfaces or generic parameters alone (e.g., `axios.get<User>()`) only validates data during build time. If an API returns missing, malformed, or altered JSON fields at runtime, TypeScript generics cannot prevent UI crashes. Combining **Axios** (for HTTP transport, base URLs, and interceptors) with **Zod** (for runtime parsing and single-source-of-truth type inference via `z.infer`) guarantees end-to-end type safety at runtime.

#### **Comparison Matrix:**

| Feature / Metric             | Axios + Zod Schema Parsing                                  | Axios Standalone (`axios.get<T>`)                       | Native `fetch` API                                      |
| :--------------------------- | :---------------------------------------------------------- | :------------------------------------------------------ | :------------------------------------------------------ |
| **Runtime Protection**       | 🟢 **100% Guaranteed** (Validates JSON body structure)      | 🔴 **None** (Blindly trusts compile-time types)         | 🔴 **None** (Manual status checks & JSON parsing)       |
| **HTTP Error Handling**      | 🟢 **Automatic** (Auto-rejects on 4xx/5xx HTTP errors)      | 🟢 **Automatic**                                        | 🔴 **Manual** (Requires `if (!res.ok)` on every call)   |
| **Centralized Config**       | 🟢 **Axios Instance** (baseURL, headers, auth interceptors) | 🟢 **Axios Instance**                                   | 🔴 **Manual** (Headers duplicated per fetch call)       |
| **Type Generation**          | 🟢 **Auto-inferred** (`type User = z.infer<typeof schema>`) | 🔴 **Manual** (Must duplicate `interface User`)         | 🔴 **Manual** (Must duplicate `interface User`)         |
| **Resilience to API Shifts** | 🟢 **Caught immediately** by Zod before UI render           | 🔴 **Crashes UI** with undefined property access errors | 🔴 **Crashes UI** with undefined property access errors |

#### **Key Code Comparison — Fetching & Validating API Responses:**

```tsx
// --- Option 1: Axios + Zod (Recommended: 100% Runtime Safe & Single-Source Type) ---
import { z } from "zod";
import { api } from "@/lib/axios";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
});

export type User = z.infer<typeof userSchema>;

export async function getUser(id: string): Promise<User> {
  const res = await api.get(`/users/${id}`);
  return userSchema.parse(res.data); // Validates JSON & throws ZodError if invalid
}
```

```tsx
// --- Option 2: Axios Standalone (Unsafe: TS Generics only, NO Runtime Check) ---
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUser(id: string): Promise<User> {
  const res = await axios.get<User>(`/users/${id}`);
  return res.data; // Blindly trusts API response — crashes at runtime if API fields change!
}
```

```tsx
// --- Option 3: Native Fetch (High Boilerplate: Manual status check & unvalidated cast) ---
interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUser(id: string): Promise<User> {
  const res = await fetch(`https://api.example.com/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  const data: User = await res.json(); // Unchecked type assertion
  return data;
}
```

#### **Verdict:**

Combining Axios with Zod provides a centralized HTTP transport layer protected by runtime contract enforcement, eliminating unexpected runtime crashes caused by API schema drift.

---

### Decision 5: TanStack Query (v5) + TanStack Router Integration vs. Bare Route Loaders / Vanilla `useEffect`

#### **Winner:** TanStack Query (`@tanstack/react-query`) + TanStack Router Integration (`queryClient.ensureQueryData`)

#### **Context & Rationale:**

Remote API data is **Server State**—it is asynchronous, shared, and can become stale over time. Relying solely on bare route loaders or vanilla `useEffect` hooks forces the application to re-fetch data from scratch on every route transition, leading to unnecessary loading spinners and network overhead. Integrating **TanStack Query** into TanStack Router via `queryClient.ensureQueryData()` provides instant page loads from in-memory cache while silently revalidating data in the background (Stale-While-Revalidate pattern).

#### **Comparison Matrix:**

| Feature / Metric                   | TanStack Query + TanStack Router ⭐                          | Bare Route Loader Alone                                | Vanilla `useEffect` + `useState`                     |
| :--------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------- | :--------------------------------------------------- |
| **Route Navigation Speed**         | ⚡ **Instant** (Renders immediately from in-memory cache)    | 🔴 **Delayed** (Triggers network fetch on every visit) | 🔴 **Delayed** (Flashes loading spinner on mount)    |
| **Background Revalidation**        | 🟢 **Automatic** (Window focus, network reconnect, interval) | 🔴 **None** (Data stays stale until page reload)       | 🔴 **None** (Requires custom event listeners)        |
| **Request Deduplication**          | 🟢 **Automatic** (Concurrent component requests collapsed)   | 🔴 **None** (Multiple duplicate HTTP calls fire)       | 🔴 **None** (Multiple duplicate HTTP calls fire)     |
| **Mutations & Cache Invalidation** | 🟢 **Declarative** (`useMutation` + `invalidateQueries`)     | 🔴 **Manual** (Must force page refresh or pass props)  | 🔴 **Manual** (Complex prop drilling / custom state) |
| **Suspense Integration**           | 🟢 **Native** (`useSuspenseQuery` with type-safe loaders)    | 🟡 Basic                                               | 🔴 None                                              |

#### **Key Code Comparison — Data Loading Strategy:**

```tsx
// --- Option 1: TanStack Query + Router (Instant Cache & Automatic Background Revalidation) ---
// 1. Define query options with type-safe query keys
export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: getUsers,
});

// 2. Route loader pre-warms cache; component uses useSuspenseQuery
export const Route = createFileRoute("/users")({
  component: UsersComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
});

function UsersComponent() {
  const { data: users } = useSuspenseQuery(usersQueryOptions); // Instant load from cache!
  return <UserListTable users={users} />;
}
```

```tsx
// --- Option 2: Bare Route Loader (No Caching, Spinner on Every Page Visit) ---
export const Route = createFileRoute("/users")({
  component: UsersComponent,
  loader: async () => {
    const users = await getUsers(); // Always triggers network request on route visit
    return { users };
  },
});

function UsersComponent() {
  const { users } = Route.useLoaderData();
  return <UserListTable users={users} />;
}
```

#### **Verdict:**

Integrating TanStack Query into TanStack Router route loaders delivers instant page navigation speeds, eliminates redundant network calls, and provides automated server-state revalidation across the application.

---

## 3. High-Level Static SPA Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                   Vite + React SPA                     │
│   (Static HTML/JS/CSS Assets on CDN Edge Hosting)      │
│   (AWS S3 + CloudFront / Cloudflare Pages / NGINX)     │
└──────────────────────────┬─────────────────────────────┘
                           │
  ┌────────────────────────┴────────────────────────┐
  │              Client Application Layer           │
  │                                                 │
  │  ┌──────────────────────┐ ┌──────────────────┐  │
  │  │   TanStack Router    │ │  Zustand Store   │  │
  │  │ (Type-safe routing)  │ │ (State + Persist)│  │
  │  └──────────┬───────────┘ └────────┬─────────┘  │
  │             │                      │            │
  │             └──────────┬───────────┘            │
  │                        ▼                        │
  │         ┌────────────────────────────┐          │
  │         │ UI Components & Screens    │          │
  │         │ (Shadcn UI + Tailwind CSS) │          │
  │         └──────────────┬─────────────┘          │
  └────────────────────────┼────────────────────────┘
                           │
             In-Browser Storage Sync (Zustand Persist)
                           │
                           ▼
 ┌────────────────────────────────────────────────────────┐
 │        Browser Storage (LocalStorage / IndexedDB)       │
 └────────────────────────────────────────────────────────┘
```

---

## 4. Quick Start & Setup Reference

### 1. File Structure Setup

```
src/
├── assets/              # SVGs, static media, and fonts
├── components/          # Reusable UI components & layouts
│   ├── common/          # PageLoader, ErrorBoundary, EmptyState
│   ├── layout/          # Header, Sidebar, Footer
│   └── ui/              # Shadcn UI / Radix primitives (Button, Input, etc.)
├── features/            # Domain-driven feature modules
│   └── users/           # Feature module example (Users)
│       ├── api/         # Feature API calls (getUser.ts)
│       ├── components/  # Feature UI components (UserProfileCard.tsx)
│       ├── schemas/     # Zod validation schemas (userSchema.ts)
│       └── types/       # TypeScript types (inferred from Zod)
├── lib/                 # Shared client infrastructure & utilities
│   ├── axios.ts         # Central Axios client instance with interceptors
│   └── utils.ts         # Classnames merger helper (cn) & formatters
├── routes/              # TanStack Router file-based route tree
│   ├── __root.tsx       # Root layout route
│   ├── index.tsx        # Home route (`/`)
│   └── user.$id.tsx     # User detail route (`/user/:id`)
├── stores/              # Persistent Zustand client stores
│   └── usePreferencesStore.ts
├── index.css            # Tailwind CSS v4 entry stylesheet
├── main.tsx             # Application mount & QueryClient/Router providers
└── routeTree.gen.ts     # Auto-generated by @tanstack/router-plugin/vite
```

### 2. Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## 5. Summary Matrix & Final Recommendation

- **Choose Vite + React SPA** over Next.js because the application deploys strictly as static files to CDN edge hosting with zero Node.js server overhead.
- **Choose TanStack Router** over React Router v7 because 100% type-safe search parameters and routes prevent runtime navigation errors.
- **Choose Zustand (+ Persist)** over React Context or Redux Toolkit because it delivers lightweight, providerless client state with built-in `localStorage` / `IndexedDB` persistence.
- **Choose Axios + Zod** over standalone fetch or compile-time TypeScript generics alone to guarantee runtime API schema validation and centralized HTTP interceptors.
- **Choose Shadcn UI + Tailwind CSS v4** for zero-runtime, component-level styling and complete accessibility compliance.

---

## 6. References & Further Reading

### Feature-Driven Architecture & Organization

1. **Bulletproof React Architecture Specification**
   - [Bulletproof React GitHub Repository & Architecture Standard](https://github.com/alan2207/bulletproof-react) — Industry standard benchmark for feature-based modular React directory design.
2. **Domain-Driven Design (DDD) & Modular Frontend Patterns**
   - [Martin Fowler — Component-Driven & Feature Architecture](https://martinfowler.com/articles/micro-frontends.html)

### Core Build System & UI Layer

1. **Vite Official Documentation**
   - [Vite Guide & Static SPA Deployment](https://vite.dev/guide/)
2. **React 19 Documentation**
   - [React 19 Official Documentation & Hooks Reference](https://react.dev/)

### Routing & Navigation State

1. **TanStack Router Documentation**
   - [TanStack Router Overview & Guides](https://tanstack.com/router/latest)
   - [Data Loading & Route Loaders Guide](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
   - [Type-Safe Search Params & Zod Validation](https://tanstack.com/router/latest/docs/framework/react/guide/search-params)

### HTTP Client & Runtime Contract Enforcement

1. **Zod Runtime Schema Validation**
   - [Zod Official Documentation & Type Inference](https://zod.dev/)
2. **Axios HTTP Client**
   - [Axios Official Documentation & Interceptors](https://axios-http.com/docs/intro)

### State Management & Component Styling

1. **Zustand Client State Management**
   - [Zustand Documentation & Persist Middleware](https://zustand.docs.pmnd.rs/)
2. **Shadcn UI & Tailwind CSS v4**
   - [Shadcn UI Components & Primitives](https://ui.shadcn.com/)
   - [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
