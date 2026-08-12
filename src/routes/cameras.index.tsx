import {
  CameraListTable,
  camerasQueryOptions,
} from "@/features/cameras";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cameras/")({
  component: CamerasIndexComponent,
});

function CamerasIndexComponent() {
  const {
    data: cameras = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(camerasQueryOptions);

  if (isLoading) {
    return (
      <div className='p-12 text-center text-slate-400 animate-pulse font-medium'>
        Loading IP Camera configuration list...
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-8 text-center text-rose-500 font-semibold'>
        Failed to load camera configurations: {error?.message}
      </div>
    );
  }

  return (
    <CameraListTable
      cameras={cameras}
      onRefresh={() => refetch()}
      isRefreshing={isFetching}
    />
  );
}
