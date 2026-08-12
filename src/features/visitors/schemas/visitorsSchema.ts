import { memberSchema } from "@/features/members/schemas/membersSchema";
import { z } from "zod";

export const nullTimeSchema = z.object({
  Time: z.string().optional().default(""),
  Valid: z.boolean().optional().default(false),
});

export const visitorImageSchema = z.object({
  id: z.number().optional(),
  visitorId: z.number().optional(),
  type: z.string().optional().nullable().transform((val) => val ?? ""),
  image: z.string().optional().nullable().transform((val) => val ?? ""),
});

export type VisitorImage = z.infer<typeof visitorImageSchema>;

export const gateLogSchema = z.object({
  id: z.number().optional().default(0),
  createdAt: z.string().optional().nullable().transform((val) => val ?? ""),
  gateName: z.string().optional().nullable().transform((val) => val ?? ""),
  ipAddress: z.string().optional().nullable().transform((val) => val ?? ""),
  anpr: z.string().optional().nullable().transform((val) => val ?? ""),
  plateNumber: z.string().optional().nullable().transform((val) => val ?? ""),
  captureTime: z.string().optional().nullable().transform((val) => val ?? ""),
  captureImage: z.string().optional().nullable().transform((val) => val ?? ""),
  licensePlateImage: z.string().optional().nullable().transform((val) => val ?? ""),
});

export type GateLog = z.infer<typeof gateLogSchema>;

export const visitorSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional().nullable().transform((val) => val ?? ""),
  type: z.string().optional().nullable().transform((val) => val ?? "car"),
  plateNumber: z.string().optional().nullable().transform((val) => val ?? ""),
  memberId: z.number().optional().nullable().transform((val) => val ?? 0),
  member: memberSchema.optional().nullable(),
  gateLogId: z.number().optional().nullable().transform((val) => val ?? 0),
  gateLog: gateLogSchema.optional().nullable(),
  idCard: z.string().optional().nullable().transform((val) => val ?? ""),
  thaiName: z.string().optional().nullable().transform((val) => val ?? ""),
  engName: z.string().optional().nullable().transform((val) => val ?? ""),
  birthdate: z.string().optional().nullable().transform((val) => val ?? ""),
  gender: z.string().optional().nullable().transform((val) => val ?? ""),
  address: z.string().optional().nullable().transform((val) => val ?? ""),
  age: z.string().optional().nullable().transform((val) => val ?? ""),
  photo: z.string().optional().nullable().transform((val) => val ?? ""),
  exitTime: z
    .union([nullTimeSchema, z.string()])
    .optional()
    .nullable()
    .transform((val) => {
      if (typeof val === "string") return val;
      if (val && typeof val === "object" && val.Valid) return val.Time;
      return null;
    }),
  gateLogOutId: z.number().optional().nullable().transform((val) => val ?? 0),
  gateLogOut: gateLogSchema.optional().nullable(),
  visitorImages: z
    .array(visitorImageSchema)
    .optional()
    .nullable()
    .transform((val) => val ?? []),
});

export type Visitor = z.infer<typeof visitorSchema>;

export interface VisitorFilterParams {
  date?: string;
  dateTo?: string;
  type?: string;
  search?: string;
}

export const createVisitorSchema = z.object({
  plateNumber: z.string().min(1, "Plate Number is required"),
  type: z.string().min(1, "Vehicle Type is required").default("car"),
  memberId: z.number().optional().default(0),
  idCard: z.string().optional().default(""),
  thaiName: z.string().optional().default(""),
  engName: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  address: z.string().optional().default(""),
});

export type CreateVisitorInput = z.infer<typeof createVisitorSchema>;
