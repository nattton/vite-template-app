import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  RegisteredUserDetailCard,
  registeredUserQueryOptions,
} from "@/features/registered-users";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/registered-users/$id")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: RegisteredUserRouteComponent,
  notFoundComponent: () => (
    <div className='p-8 text-center text-amber-400 font-semibold'>
      Registered User Not Found (404)
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Error loading registered user details: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading registered user details...
    </div>
  ),
  loader: async ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound();
    }

    try {
      return await queryClient.ensureQueryData(
        registeredUserQueryOptions(params.id),
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw notFound();
      }
      throw err;
    }
  },
});

function RegisteredUserRouteComponent() {
  const { id } = Route.useParams();
  const { data: user } = useSuspenseQuery(registeredUserQueryOptions(id));

  return <RegisteredUserDetailCard user={user} />;
}
