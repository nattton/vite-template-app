import {
  GateLogFilterParams,
  GateLogListTable,
  gateLogsQueryOptions,
} from "@/features/gate-logs";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/gate-logs/")({
  component: GateLogsIndexComponent,
});

function GateLogsIndexComponent() {
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState<GateLogFilterParams>({
    date: getTodayStr(),
    dateTo: undefined,
  });

  const {
    data: logs = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(gateLogsQueryOptions(filters));

  if (isLoading) {
    return (
      <div className='p-12 text-center text-slate-400 animate-pulse font-medium'>
        Loading ANPR gate transaction logs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-8 text-center text-red-500 font-semibold'>
        Failed to load gate logs: {error?.message}
      </div>
    );
  }

  return (
    <GateLogListTable
      logs={logs}
      filters={filters}
      onFilterChange={setFilters}
      onRefresh={() => refetch()}
      isRefreshing={isFetching}
    />
  );
}
