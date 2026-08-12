import {
  RegisteredUserListTable,
  registeredUsersQueryOptions,
} from "@/features/registered-users";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/registered-users/")({
  component: RegisteredUsersIndexComponent,
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Failed to load registered users: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading registered users directory...
    </div>
  ),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(registeredUsersQueryOptions()),
});

function RegisteredUsersIndexComponent() {
  const { data: users } = useSuspenseQuery(registeredUsersQueryOptions());
  return <RegisteredUserListTable users={users} />;
}
