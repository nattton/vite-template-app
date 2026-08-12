import { api } from "@/lib/axios";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateRegisteredUserInput,
  RegisteredUser,
  registeredUsersApiResponseSchema,
  singleRegisteredUserApiResponseSchema,
  UpdateRegisteredUserInput,
} from "../schemas/registeredUsersSchema";

export async function getRegisteredUsers(
  search?: string,
): Promise<RegisteredUser[]> {
  const response = await api.get("/registered-users", {
    params: search ? { search } : undefined,
  });
  const parsed = registeredUsersApiResponseSchema.parse(response.data);
  return parsed.data;
}

export async function getRegisteredUser(
  id: string | number,
): Promise<RegisteredUser> {
  try {
    const response = await api.get(`/registered-users/${id}`);
    const parsed = singleRegisteredUserApiResponseSchema.parse(response.data);
    return parsed.data;
  } catch (err) {
    const users = await getRegisteredUsers();
    const found = users.find((u) => u.id === Number(id));
    if (!found) {
      throw new Error(`Registered user #${id} not found`);
    }
    return found;
  }
}

export async function createRegisteredUser(
  data: CreateRegisteredUserInput,
): Promise<RegisteredUser> {
  const response = await api.post("/registered-users", data);
  const parsed = singleRegisteredUserApiResponseSchema.parse(response.data);
  return parsed.data;
}

export async function updateRegisteredUser(params: {
  id: string | number;
  data: UpdateRegisteredUserInput;
}): Promise<RegisteredUser> {
  const response = await api.patch(
    `/registered-users/${params.id}`,
    params.data,
  );
  const parsed = singleRegisteredUserApiResponseSchema.parse(response.data);
  return parsed.data;
}

export async function deleteRegisteredUser(id: string | number): Promise<void> {
  await api.delete(`/registered-users/${id}`);
}

export async function uploadRegisteredUserPhoto(params: {
  id: string | number;
  file: File;
}): Promise<RegisteredUser> {
  const formData = new FormData();
  formData.append("photo", params.file);

  const response = await api.patch(
    `/registered-users/${params.id}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const parsed = singleRegisteredUserApiResponseSchema.parse(response.data);
  return parsed.data;
}

// Query Options
export const registeredUsersQueryOptions = (search?: string) =>
  queryOptions({
    queryKey: ["registered-users", search || "all"],
    queryFn: () => getRegisteredUsers(search),
  });

export const registeredUserQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ["registered-users", "detail", String(id)],
    queryFn: () => getRegisteredUser(id),
  });

// Mutation Hooks
export function useCreateRegisteredUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRegisteredUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-users"] });
    },
  });
}

export function useUpdateRegisteredUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRegisteredUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registered-users"] });
      queryClient.invalidateQueries({
        queryKey: ["registered-users", "detail", String(variables.id)],
      });
    },
  });
}

export function useDeleteRegisteredUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRegisteredUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registered-users"] });
    },
  });
}

export function useUploadRegisteredUserPhotoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadRegisteredUserPhoto,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registered-users"] });
      queryClient.invalidateQueries({
        queryKey: ["registered-users", "detail", String(variables.id)],
      });
    },
  });
}
