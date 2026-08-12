import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/registered-users")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: () => <Outlet />,
});
