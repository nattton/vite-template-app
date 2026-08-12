import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";
import {
  GateLogFilterParams,
  GateLogItem,
  gateLogItemSchema,
} from "../schemas/gateLogsSchema";

export async function getGateLogs(
  filters?: GateLogFilterParams,
): Promise<GateLogItem[]> {
  const params: Record<string, string> = {};
  if (filters?.date) params.date = filters.date;
  if (filters?.dateTo) params.dateTo = filters.dateTo;

  const response = await api.get("/gate_logs", { params });
  return gateLogItemSchema.array().parse(response.data);
}

// TanStack Query Options
export const gateLogsQueryOptions = (filters?: GateLogFilterParams) =>
  queryOptions({
    queryKey: [
      "gate_logs",
      filters?.date || "today",
      filters?.dateTo || "none",
    ],
    queryFn: () => getGateLogs(filters),
  });
