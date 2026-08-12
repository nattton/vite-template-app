import { requireAuth } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/members")({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
});
