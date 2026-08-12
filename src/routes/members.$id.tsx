import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { MemberDetailCard, memberQueryOptions } from "@/features/members";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

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
  loader: ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound();
    }
    // Prefetch query asynchronously so navigation renders instantly without blocking
    queryClient.prefetchQuery(memberQueryOptions(params.id));
  },
});

function MemberRouteComponent() {
  const { id } = Route.useParams();
  const {
    data: member,
    isLoading,
    isError,
    error,
  } = useQuery(memberQueryOptions(id));

  if (isLoading) {
    return (
      <div className='p-12 text-center text-slate-400 animate-pulse font-medium'>
        Loading member unit details...
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className='p-8 text-center text-red-500 font-semibold'>
        Error loading member details: {error?.message || "Member not found"}
      </div>
    );
  }

  return <MemberDetailCard member={member} />;
}
