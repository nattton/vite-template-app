import { api } from "@/lib/axios";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateMemberInput,
  CreateVehicleInput,
  Member,
  memberSchema,
  UpdateMemberInput,
  UpdateVehicleInput,
} from "../schemas/membersSchema";

export async function getMembers(): Promise<Member[]> {
  const response = await api.get("/members");
  return memberSchema.array().parse(response.data);
}

export async function getMember(id: string | number): Promise<Member> {
  const response = await api.get(`/members/${id}`);
  return memberSchema.parse(response.data);
}

export async function createMember(data: CreateMemberInput): Promise<Member> {
  const response = await api.post("/members", data);
  return memberSchema.parse(response.data);
}

export async function updateMember(params: {
  id: string | number;
  data: UpdateMemberInput;
}): Promise<any> {
  const response = await api.patch(`/members/${params.id}`, params.data);
  return response.data;
}

export async function deleteMember(id: string | number): Promise<void> {
  await api.delete(`/members/${id}`);
}

export async function createVehicle(params: {
  memberId: string | number;
  data: CreateVehicleInput;
}): Promise<any> {
  const response = await api.post(`/members/${params.memberId}/vehicles`, {
    ...params.data,
    memberId: Number(params.memberId),
  });
  return response.data;
}

export async function updateVehicle(params: {
  id: string | number;
  data: UpdateVehicleInput;
}): Promise<any> {
  const response = await api.patch(`/vehicles/${params.id}`, params.data);
  return response.data;
}

export async function deleteVehicle(id: string | number): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}

// TanStack Query Options
export const membersQueryOptions = queryOptions({
  queryKey: ["members"],
  queryFn: getMembers,
});

export const memberQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ["members", "detail", String(id)],
    queryFn: () => getMember(id),
  });

// Mutations
export function useCreateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMember,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({
        queryKey: ["members", "detail", String(variables.id)],
      });
    },
  });
}

export function useDeleteMemberMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({
        queryKey: ["members", "detail", String(variables.memberId)],
      });
    },
  });
}

export function useUpdateVehicleMutation(memberId?: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["members", "detail", String(memberId)],
        });
      }
    },
  });
}

export function useDeleteVehicleMutation(memberId?: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["members", "detail", String(memberId)],
        });
      }
    },
  });
}
