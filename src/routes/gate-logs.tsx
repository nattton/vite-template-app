import { requireAuth } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/gate-logs")({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
});
