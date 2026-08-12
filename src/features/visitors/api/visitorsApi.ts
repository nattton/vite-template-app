import { api } from "@/lib/axios";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateVisitorInput,
  Visitor,
  VisitorFilterParams,
  visitorSchema,
} from "../schemas/visitorsSchema";

export async function getVisitors(filters?: VisitorFilterParams): Promise<Visitor[]> {
  const params: Record<string, string> = {};
  if (filters?.date) params.date = filters.date;
  if (filters?.dateTo) params.dateTo = filters.dateTo;

  const response = await api.get("/visitors", { params });
  return visitorSchema.array().parse(response.data);
}

export async function getVisitor(id: string | number): Promise<Visitor> {
  try {
    const response = await api.get(`/visitors/${id}`);
    return visitorSchema.parse(response.data);
  } catch (err) {
    const visitors = await getVisitors();
    const found = visitors.find((v) => v.id === Number(id));
    if (!found) {
      throw new Error(`Visitor #${id} not found`);
    }
    return found;
  }
}

export async function createVisitor(data: CreateVisitorInput): Promise<Visitor> {
  const response = await api.post("/visitors", data);
  return visitorSchema.parse(response.data);
}

export async function checkoutVisitor(params: {
  barcode: string;
  gateLogId?: number;
}): Promise<Visitor> {
  const response = await api.patch("/visitors/checkout", params);
  return visitorSchema.parse(response.data);
}

export async function uploadVisitorPhoto(params: {
  id: string | number;
  file: File;
}): Promise<Visitor> {
  const formData = new FormData();
  formData.append("photo", params.file);

  const response = await api.post(`/visitors/${params.id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return visitorSchema.parse(response.data);
}

// TanStack Query Options
export const visitorsQueryOptions = (filters?: VisitorFilterParams) =>
  queryOptions({
    queryKey: ["visitors", filters?.date || "today", filters?.dateTo || "none"],
    queryFn: () => getVisitors(filters),
  });

export const visitorQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ["visitors", "detail", String(id)],
    queryFn: () => getVisitor(id),
  });

// Mutations
export function useCreateVisitorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
}

export function useCheckoutVisitorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
    },
  });
}

export function useUploadVisitorPhotoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadVisitorPhoto,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      queryClient.invalidateQueries({
        queryKey: ["visitors", "detail", String(variables.id)],
      });
    },
  });
}
