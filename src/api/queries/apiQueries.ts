import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  bookDetailsSchema,
  BookDetails,
  chatResponseSchema,
  ChatResponse,
  // AddFavoriteResponse,
  addFavoriteResponseSchema,
  favoritesResponseSchema,
  FavoritesResponse,
} from "../schemas/apiSchemas";
import { getAuthHeaders } from "@/utils/auth";


export const useChatMutation = () =>
  useMutation<ChatResponse, Error, { userMessage: string; triggerRecommendation?: boolean }>(
    async ({ userMessage, triggerRecommendation = false }) => {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: userMessage,
          trigger_recommendation: triggerRecommendation,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return chatResponseSchema.parse(data);
    }
  );

export const useBookDetailsQuery = (bookTitle: string) =>
  useQuery<BookDetails, Error>(
    ["bookDetails", bookTitle],
    async () => {
      const encodedTitle = encodeURIComponent(bookTitle);
      const response = await fetch(`http://localhost:8000/book-details/${encodedTitle}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return bookDetailsSchema.parse(data);
    },
    {
      enabled: Boolean(bookTitle),
    }
  );

// export const useAddFavoriteMutation = () =>
//   useMutation<AddFavoriteResponse, Error, string>(async (bookTitle: string) => {
//     const encodedTitle = encodeURIComponent(bookTitle);
//     const response = await fetch(`http://localhost:8000/auth/favourites/${encodedTitle}`, {
//       method: "POST",
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return addFavoriteResponseSchema.parse(data);
//   });





export const useFavoritesQuery = () =>
  useQuery(
    ["favorites"],
    async () => {
      const response = await fetch("http://localhost:8000/auth/favourites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data = await response.json();
      return favoritesResponseSchema.parse(data);
    }
  );



export const useAddFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (bookTitle: string) => {

      const response = await fetch("http://localhost:8000/auth/favourites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ title: bookTitle })
      });

      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }

      const data = await response.json();
      return addFavoriteResponseSchema.parse(data);
    },
    {
      onSuccess: () => {
        // Invalidate favorites query to refetch the updated list
        queryClient.invalidateQueries(["favorites"]);
      }
    }
  );
};

export const useRemoveFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (bookTitle: string) => {
      const response = await fetch("http://localhost:8000/auth/favourites/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ title: bookTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      const data = await response.json();
      return favoritesResponseSchema.parse(data);
    },
    {
      // Optimistic update: update cache immediately before the mutation function runs
      onMutate: async (bookTitle: string) => {
        // Cancel any outgoing refetches so they don't overwrite our optimistic update
        await queryClient.cancelQueries(["favorites"]);

        // Snapshot the previous value, explicitly typed as FavoritesResponse
        const previousFavorites = queryClient.getQueryData<FavoritesResponse>(["favorites"]);

        // Optimistically update the cache by removing the favorite immediately
        queryClient.setQueryData<FavoritesResponse>(["favorites"], (old) => {
          if (!old) return { favourites: [] };
          return {
            ...old,
            favourites: old.favourites.filter((book) => book.title !== bookTitle),
          };
        });

        // Return a rollback context with the previous favorites
        return { previousFavorites };
      },
      // If the mutation fails, roll back to the previous state
      onError: (_err, _bookTitle, context: { previousFavorites?: FavoritesResponse } | undefined) => {
        if (context?.previousFavorites) {
          queryClient.setQueryData<FavoritesResponse>(["favorites"], context.previousFavorites);
        }
      },
      // After the mutation either succeeds or fails, refetch the favorites query to ensure consistency
      onSettled: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
    }
  );
};
