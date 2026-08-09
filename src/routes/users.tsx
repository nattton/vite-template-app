import { getUsers } from "@/features/users/api/users";
import { UserListTable } from "@/features/users/components/UserListTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
  component: UsersRouteComponent,
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Failed to load users: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading users directory...
    </div>
  ),
  loader: async () => {
    const users = await getUsers();
    return { users };
  },
});

function UsersRouteComponent() {
  const { users } = Route.useLoaderData();
  return <UserListTable users={users} />;
}
