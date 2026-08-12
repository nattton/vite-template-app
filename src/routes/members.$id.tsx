import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { MemberDetailCard, memberQueryOptions } from "@/features/members";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/members/$id")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: MemberRouteComponent,
  notFoundComponent: () => (
    <div className='p-8 text-center text-amber-400 font-semibold'>
      Member Unit Not Found (404)
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Error loading member details: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading member unit details...
    </div>
  ),
  loader: async ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound();
    }

    try {
      return await queryClient.ensureQueryData(memberQueryOptions(params.id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw notFound();
      }
      throw err;
    }
  },
});

function MemberRouteComponent() {
  const { id } = Route.useParams();
  const { data: member } = useSuspenseQuery(memberQueryOptions(id));

  return <MemberDetailCard member={member} />;
}
