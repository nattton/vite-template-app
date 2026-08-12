import { UserListTable, usersQueryOptions } from "@/features/users";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/")({
  component: UsersIndexComponent,
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
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
});

function UsersIndexComponent() {
  const { data: users } = useSuspenseQuery(usersQueryOptions);
  return <UserListTable users={users} />;
}
