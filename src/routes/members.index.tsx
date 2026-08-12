import { MemberListTable, membersQueryOptions } from "@/features/members";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/members/")({
  component: MembersIndexComponent,
  errorComponent: ({ error }) => (
    <div className='p-8 text-center text-red-500 font-semibold'>
      Failed to load members directory: {error.message}
    </div>
  ),
  pendingComponent: () => (
    <div className='p-12 text-center text-slate-400 animate-pulse'>
      Loading members directory...
    </div>
  ),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(membersQueryOptions),
});

function MembersIndexComponent() {
  const { data: members } = useSuspenseQuery(membersQueryOptions);
  return <MemberListTable members={members} />;
}
