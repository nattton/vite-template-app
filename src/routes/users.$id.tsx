import { userQueryOptions, UserProfileCard } from '@/features/users'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import axios from 'axios'

export const Route = createFileRoute('/users/$id')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: UserRouteComponent,
  notFoundComponent: () => (
    <div className="p-8 text-center text-amber-400 font-semibold">
      User Not Found (404)
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-red-500 font-semibold">
      Error: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className="p-8 text-center text-slate-400 animate-pulse">
      Loading user details...
    </div>
  ),
  loader: async ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound()
    }

    try {
      return await queryClient.ensureQueryData(userQueryOptions(params.id))
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw notFound()
      }
      throw err
    }
  },
})

function UserRouteComponent() {
  const { id } = Route.useParams()
  const { data: user } = useSuspenseQuery(userQueryOptions(id))

  return <UserProfileCard user={user} />
}
