import { z } from "zod";

export type ReportType = "member_traffic" | "visitor_traffic";

export interface TrafficReportItem {
  id: number;
  name: string;
  vehicleId: number;
  plateNumber: string;
  traffic: number;
}

export const trafficReportItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  vehicleId: z.number(),
  plateNumber: z.string(),
  traffic: z.number(),
});

export interface ReportFilterParams {
  type: ReportType;
  date: string;
  dateTo?: string;
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function getThisMonthRange(): { date: string; dateTo: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    date: formatDate(firstDay),
    dateTo: formatDate(lastDay),
  };
}

export function getLastMonthRange(): { date: string; dateTo: string } {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

  return {
    date: formatDate(firstDay),
    dateTo: formatDate(lastDay),
  };
}
