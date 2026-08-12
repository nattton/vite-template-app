import { api } from "@/lib/axios";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Camera,
  cameraSchema,
  UpdateCameraInput,
} from "../schemas/camerasSchema";

export async function getCameras(): Promise<Camera[]> {
  const response = await api.get("/cameras");
  return cameraSchema.array().parse(response.data);
}

export async function updateCamera(params: {
  id: string | number;
  data: UpdateCameraInput;
}): Promise<Camera> {
  const response = await api.patch(`/admin/cameras/${params.id}`, params.data);
  return cameraSchema.parse(response.data);
}

export const camerasQueryOptions = queryOptions({
  queryKey: ["cameras"],
  queryFn: getCameras,
});

export function useUpdateCameraMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCamera,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cameras"] });
    },
  });
}
