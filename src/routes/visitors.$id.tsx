import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { VisitorDetailCard, visitorQueryOptions } from "@/features/visitors";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import axios from "axios";

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
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading visitor entry details...
    </div>
  ),
  loader: async ({ context: { queryClient }, params }) => {
    if (Number(params.id) <= 0 || !Number.isInteger(Number(params.id))) {
      throw notFound();
    }

    try {
      return await queryClient.ensureQueryData(visitorQueryOptions(params.id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw notFound();
      }
      throw err;
    }
  },
});

function VisitorRouteComponent() {
  const { id } = Route.useParams();
  const { data: visitor } = useSuspenseQuery(visitorQueryOptions(id));

  return <VisitorDetailCard visitor={visitor} />;
}
