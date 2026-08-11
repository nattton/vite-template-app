import axios from "axios";
import { LoginCredentials, LoginResponse } from "../types/auth";

export const AUTH_API_URL = "http://localhost:4000/api";

export async function loginApi(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${AUTH_API_URL}/login`,
    credentials,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}
