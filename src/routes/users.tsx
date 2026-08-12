import { requireAuth } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
});
