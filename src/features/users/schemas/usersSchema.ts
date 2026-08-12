import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
});

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.string().min(1, "Role is required"),
});

export const updateUserSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
});

export const apiResponseSchema = z.object({
  message: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ApiResponseMessage = z.infer<typeof apiResponseSchema>;
