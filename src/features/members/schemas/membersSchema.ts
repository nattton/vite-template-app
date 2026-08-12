import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.number(),
  memberId: z.number(),
  plateNumber: z.string(),
  plateProvince: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  brand: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  color: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  telephone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  resemble: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const memberSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  telephone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  type: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? "resident"),
  status: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? "active"),
  vehicles: z
    .array(vehicleSchema)
    .optional()
    .nullable()
    .transform((val) => val ?? []),
});

export type Member = z.infer<typeof memberSchema>;

export const createMemberSchema = z.object({
  name: z.string().min(1, "Name/Unit is required"),
  telephone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  type: z.string().min(1, "Type is required").default("resident"),
  status: z.string().min(1, "Status is required").default("active"),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = createMemberSchema.partial();

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const createVehicleSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  plateProvince: z.string().optional().default(""),
  brand: z.string().optional().default(""),
  color: z.string().optional().default(""),
  telephone: z.string().optional().default(""),
  resemble: z.string().optional().default(""),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial();

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
