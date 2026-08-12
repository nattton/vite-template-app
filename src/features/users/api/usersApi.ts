import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import {
  User,
  userSchema,
  CreateUserInput,
  UpdateUserInput,
  ApiResponseMessage,
  apiResponseSchema,
} from '../schemas/usersSchema'

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/admin/users')
  return userSchema.array().parse(response.data)
}

export async function getUser(id: string | number): Promise<User> {
  try {
    const response = await api.get(`/admin/users/${id}`)
    return userSchema.parse(response.data)
  } catch {
    const users = await getUsers()
    const user = users.find((u) => u.id === Number(id))
    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }
    return user
  }
}

export async function createUser(data: CreateUserInput): Promise<ApiResponseMessage> {
  const response = await api.post('/admin/users', data)
  return apiResponseSchema.parse(response.data)
}

export async function updateUser(params: {
  id: string | number
  data: UpdateUserInput
}): Promise<ApiResponseMessage> {
  const response = await api.patch(`/admin/users/${params.id}`, params.data)
  return apiResponseSchema.parse(response.data)
}

export async function deleteUser(id: string | number): Promise<ApiResponseMessage> {
  const response = await api.delete(`/admin/users/${id}`)
  return apiResponseSchema.parse(response.data)
}

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: getUsers,
})

export const userQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ['users', 'detail', String(id)],
    queryFn: () => getUser(id),
  })

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
