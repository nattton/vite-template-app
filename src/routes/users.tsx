import { createFileRoute, redirect } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { usersQueryOptions, UserListTable } from '@/features/users'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export const Route = createFileRoute('/users')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: UsersRouteComponent,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-red-500 font-semibold">
      Failed to load users: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className="p-12 text-center text-slate-400 animate-pulse">
      Loading users directory...
    </div>
  ),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
})

function UsersRouteComponent() {
  const { data: users } = useSuspenseQuery(usersQueryOptions)
  return <UserListTable users={users} />
}
