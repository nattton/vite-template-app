import { queryOptions } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { User, userSchema } from '../schemas/userSchema'

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users')
  return userSchema.array().parse(response.data)
}

export async function getUser(id: string | number): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return userSchema.parse(response.data)
}

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: getUsers,
})

export const userQueryOptions = (id: string | number) =>
  queryOptions({
    queryKey: ['user', String(id)],
    queryFn: () => getUser(id),
  })
