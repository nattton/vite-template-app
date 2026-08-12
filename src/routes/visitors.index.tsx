import {
  VisitorFilterParams,
  VisitorListTable,
  visitorsQueryOptions,
} from "@/features/visitors";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/visitors/")({
  component: VisitorsIndexComponent,
});

function VisitorsIndexComponent() {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState<VisitorFilterParams>({
    date: getTodayStr(),
    dateTo: undefined,
  });

  const {
    data: visitors = [],
    isLoading,
    isError,
    error,
  } = useQuery(visitorsQueryOptions(filters));

  if (isLoading) {
    return (
      <div className='p-12 text-center text-slate-400 animate-pulse font-medium'>
        Loading visitor gate logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-8 text-center text-red-500 font-semibold'>
        Failed to load visitor logs: {error?.message}
      </div>
    );
  }

  return (
    <VisitorListTable
      visitors={visitors}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
