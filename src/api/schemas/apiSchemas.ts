import { z } from "zod";

export const emotionalBookSchema = z.object({
  title: z.string(),
  match_score: z.number(),
  image: z.string().nullable().optional(),
});

export const thematicBookSchema = z.object({
  title: z.string(),
  similarity: z.number(),
  image: z.string().nullable().optional(),
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
  description: z.string().nullable(), // Allow description to be null
  authors: z.preprocess(
    (arg) => {
      if (typeof arg === "string") {
        try {
          return JSON.parse(arg);
        } catch {
          return [];
        }
      }
      return Array.isArray(arg) ? arg.filter((item) => typeof item === "string") : [];
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
      return Array.isArray(arg) ? arg.filter((item) => typeof item === "string") : [];
    },
    z.array(z.string())
  ),
  published_date: z.string(),
});


export type BookDetails = z.infer<typeof bookDetailsSchema>;



export const favoriteBookSchema = z.object({
  title: z.string(),
  description: z.string(),
  authors: z.array(z.string()),
  categories: z.array(z.string()),
  published_date: z.string(),
  image: z.string()
});

export type FavoriteBook = z.infer<typeof favoriteBookSchema>;

export const favoritesResponseSchema = z.object({
  favourites: z.array(favoriteBookSchema)
});

export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;

export const addFavoriteRequestSchema = z.object({
  title: z.string()
});

export type AddFavoriteRequest = z.infer<typeof addFavoriteRequestSchema>;

export const addFavoriteResponseSchema = z.object({
  message: z.string(),
});

export type AddFavoriteResponse = z.infer<typeof addFavoriteResponseSchema>;