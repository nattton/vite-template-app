import {
  trafficReportQueryOptions,
  ReportFilters,
  ReportStatCards,
  ReportTable,
  getTodayDateString,
  ReportFilterParams,
} from "@/features/reports";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/reports")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: ReportsRouteComponent,
});

function ReportsRouteComponent() {
  const [filters, setFilters] = useState<ReportFilterParams>({
    type: "member_traffic",
    date: getTodayDateString(),
    dateTo: undefined,
  });

  const {
    data: reportData = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(trafficReportQueryOptions(filters));

  const reportTitle = filters.type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className='space-y-8'>
      {/* Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2'>
            <FileText className='w-3.5 h-3.5' /> Analytics & Reporting
          </div>
          <h1 className='text-3xl font-extrabold text-white tracking-tight'>
            Vehicle Traffic Reports
          </h1>
          <p className='text-slate-400 text-sm mt-1'>
            Analyze member and visitor entry/exit frequency over customized time
            ranges.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Summary KPI Cards */}
      <ReportStatCards data={reportData} />

      {/* Detailed Data Table */}
      <ReportTable
        data={reportData}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        reportTypeTitle={reportTitle}
      />
    </div>
  );
}
