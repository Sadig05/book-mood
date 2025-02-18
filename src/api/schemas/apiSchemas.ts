import { z } from "zod";

export const emotionalBookSchema = z.object({
  title: z.string(),
  match_score: z.number(),
  image: z.string().optional(),
});

export const thematicBookSchema = z.object({
  title: z.string(),
  similarity: z.number(),
  image: z.string().optional(),
});

// Update chatResponseSchema to accept either an object with emotional/thematic properties
// or an empty array.
export const chatResponseSchema = z.object({
  response: z.string(),
  books: z.union([
    z.object({
      emotional: z.array(emotionalBookSchema),
      thematic: z.array(thematicBookSchema),
    }),
    z.array(z.any()),
  ]),
});

export type EmotionalBook = z.infer<typeof emotionalBookSchema>;
export type ThematicBook = z.infer<typeof thematicBookSchema>;

// If the API returns an object, we expect EmotionalBook and ThematicBook arrays;
// otherwise, if it's an empty array, we'll handle it in our code.
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export const bookDetailsSchema = z.object({
  title: z.string(),
  description: z.string(),
  authors: z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        try {
          return JSON.parse(arg);
        } catch {
          return [];
        }
      }
      return arg;
    },
    z.array(z.string())
  ),
  image: z.string(),
  categories: z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        try {
          return JSON.parse(arg);
        } catch {
          return [];
        }
      }
      return arg;
    },
    z.array(z.string())
  ),
  published_date: z.string(),
});

export type BookDetails = z.infer<typeof bookDetailsSchema>;
