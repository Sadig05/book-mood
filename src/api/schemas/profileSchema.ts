// src/schemas/profileSchema.ts
import { z } from "zod";

export const bookSchema = z.object({
  title: z.string(),
  description: z.string(),
  authors: z.array(z.string()),
  categories: z.array(z.string()),
  published_date: z.string(),
  image: z.string().url(),
});

export const profileSchema = z.object({
  id: z.number(),
  username: z.string(),
  favourites: z.array(bookSchema),
});

export type Profile = z.infer<typeof profileSchema>;
