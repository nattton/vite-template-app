import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

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

export interface LoginResponse {
  token: string;
}
