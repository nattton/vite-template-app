import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export interface JwtClaims {
  role: string;
  id: number;
  name: string;
  iss: string;
  exp: number;
}

export interface AuthUser {
  id: number;
  name: string;
  role: string;
  iss: string;
  exp: number;
}
