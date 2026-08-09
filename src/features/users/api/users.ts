import { api } from "@/lib/axios";
import { User, userSchema } from "../schemas/userSchema";

export async function getUsers(): Promise<User[]> {
  const response = await api.get("/users");
  return userSchema.array().parse(response.data);
}

export async function getUserById(id: string | number): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return userSchema.parse(response.data);
}
