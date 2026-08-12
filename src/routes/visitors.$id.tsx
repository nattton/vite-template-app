import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VisitorDetailCard, visitorQueryOptions } from "@/features/visitors";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/visitors/$id")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: VisitorRouteComponent,
  notFoundComponent: () => (
    <div className='p-8 text-center text-amber-400 font-semibold'>
      Visitor Log Entry Not Found (404)
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Error loading visitor details: {error.message}
    </div>
  ),
  loader: ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound();
    }
    // Prefetch query asynchronously so navigation renders instantly without blocking
    queryClient.prefetchQuery(visitorQueryOptions(params.id));
  },
});

function VisitorRouteComponent() {
  const { id } = Route.useParams();
  const {
    data: visitor,
    isLoading,
    isError,
    error,
  } = useQuery(visitorQueryOptions(id));

  if (isLoading) {
    return (
      <div className='p-12 text-center text-slate-400 animate-pulse font-medium'>
        Loading visitor entry details...
      </div>
    );
  }

  if (isError || !visitor) {
    return (
      <div className='p-8 text-center text-red-500 font-semibold'>
        Error loading visitor details: {error?.message || "Visitor entry not found"}
      </div>
    );
  }

  return <VisitorDetailCard visitor={visitor} />;
}
