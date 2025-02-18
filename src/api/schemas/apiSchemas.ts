import { z } from "zod";

/**
 * Schema for a book item in the /chat response.
 * - Emotional books include a "match_score" field.
 * - Thematic books include a "similarity" field.
 */
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

/**
 * Schema for the overall chat response from the /chat endpoint.
 */
export const chatResponseSchema = z.object({
  response: z.string(),
  books: z.object({
    emotional: z.array(emotionalBookSchema),
    thematic: z.array(thematicBookSchema),
  }),
});

export type EmotionalBook = z.infer<typeof emotionalBookSchema>;
export type ThematicBook = z.infer<typeof thematicBookSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;

/**
 * Schema for the book details response from /book-details/:title.
 *
 * The API returns "authors" and "categories" as strings that look like arrays.
 * Here we preprocess them to be parsed into arrays.
 */
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
