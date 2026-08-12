import { z } from "zod";

export const gateLogItemSchema = z.object({
  id: z.number(),
  createdAt: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  gateName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? "in"),
  anpr: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  plateNumber: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  captureImage: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  memberId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? Number(val) : 0)),
  memberName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  visitorId: z
    .number()
    .optional()
    .nullable()
    .transform((val) => val ?? 0),
  visitorMemberId: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? Number(val) : 0)),
  visitorMemberName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
});

export type GateLogItem = z.infer<typeof gateLogItemSchema>;

export interface GateLogFilterParams {
  date?: string;
  dateTo?: string;
  gateName?: string;
  search?: string;
}
