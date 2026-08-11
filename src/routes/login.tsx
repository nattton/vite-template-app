import { LoginForm } from "@/features/auth/components/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginRouteComponent,
});

function LoginRouteComponent() {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-16rem)] py-8 px-4'>
      <LoginForm />
    </div>
  );
}
