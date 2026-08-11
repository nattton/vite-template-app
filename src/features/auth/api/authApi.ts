import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import {
  LoginCredentials,
  LoginResponse,
  loginResponseSchema,
} from "../types/auth";

export async function loginApi(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await api.post("/login", credentials);
  return loginResponseSchema.parse(response.data);
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginApi,
  });
}
