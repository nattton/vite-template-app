import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "./store/useAuthStore";

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}

export function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect({ to: "/login" });
  }
}
