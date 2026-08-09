import { z } from "zod";

export const geoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
});

export const addressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: geoSchema,
});

export const companySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: addressSchema,
  phone: z.string(),
  website: z.string(),
  company: companySchema,
});

export type User = z.infer<typeof userSchema>;
