import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import {
  ReportFilterParams,
  TrafficReportItem,
  trafficReportItemSchema,
} from "../types/reports";

export async function fetchTrafficReport(
  params: ReportFilterParams,
): Promise<TrafficReportItem[]> {
  const { type, date, dateTo } = params;
  
  const queryParams: Record<string, string> = { date };
  if (dateTo && dateTo.trim()) {
    queryParams.dateTo = dateTo;
  }

  const response = await api.get<TrafficReportItem[]>(`/report/${type}`, {
    params: queryParams,
  });

  return trafficReportItemSchema.array().parse(response.data);
}

export const trafficReportQueryOptions = (params: ReportFilterParams) =>
  queryOptions({
    queryKey: ["traffic-report", params.type, params.date, params.dateTo || ""],
    queryFn: () => fetchTrafficReport(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
