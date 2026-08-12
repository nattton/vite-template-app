import { requireAuth } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/visitors")({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
});
