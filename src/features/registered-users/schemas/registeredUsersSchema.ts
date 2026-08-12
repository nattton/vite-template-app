import { z } from "zod";

export const nullTimeSchema = z.object({
  Time: z.string().optional().default(""),
  Valid: z.boolean().optional().default(false),
});

export const registeredUserSchema = z.object({
  id: z.number(),
  generatedId: z.string().optional().default(""),
  type: z.string().optional().default(""),
  telephone: z.string().optional().default(""),
  idCard: z.string().optional().default(""),
  thaiName: z.string().optional().default(""),
  engName: z.string().optional().default(""),
  birthdate: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  address: z.string().optional().default(""),
  photo: z.string().optional().default(""),
  createdAt: z.string().optional().default(""),
  updatedAt: z.string().optional().default(""),
  expiredDate: z
    .union([nullTimeSchema, z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string") return val;
      if (val && typeof val === "object" && val.Valid) return val.Time;
      return "";
    }),
});

export type RegisteredUser = z.infer<typeof registeredUserSchema>;

export const registeredUsersApiResponseSchema = z.object({
  message: z.string().optional(),
  data: z.array(registeredUserSchema).default([]),
});

export const singleRegisteredUserApiResponseSchema = z.object({
  message: z.string().optional(),
  data: registeredUserSchema,
});

export const createRegisteredUserSchema = z.object({
  thaiName: z.string().min(1, "Thai name is required"),
  idCard: z
    .string()
    .min(7, "ID card must be 7-13 digits")
    .max(13, "ID card must be 7-13 digits"),
  type: z.string().min(1, "Type is required"),
  telephone: z.string().optional().default(""),
  engName: z.string().optional().default(""),
  birthdate: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  address: z.string().optional().default(""),
  expiredDate: z.string().min(1, "Expired date (YYYY-MM-DD) is required"),
});

export type CreateRegisteredUserInput = z.infer<
  typeof createRegisteredUserSchema
>;

export const updateRegisteredUserSchema = createRegisteredUserSchema
  .partial()
  .extend({
    id: z.number(),
  });

export type UpdateRegisteredUserInput = z.infer<
  typeof updateRegisteredUserSchema
>;
