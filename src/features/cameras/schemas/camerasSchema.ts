import { z } from "zod";

export const cameraSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  ipAddress: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  port: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? "554"),
  username: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  password: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
  path: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val ?? ""),
});

export type Camera = z.infer<typeof cameraSchema>;

export const updateCameraInputSchema = z.object({
  ipAddress: z.string().min(1, "IP address is required"),
  port: z.string().optional().default("554"),
  username: z.string().optional().default("admin"),
  password: z.string().optional().default(""),
  path: z.string().optional().default(""),
});

export type UpdateCameraInput = z.infer<typeof updateCameraInputSchema>;
