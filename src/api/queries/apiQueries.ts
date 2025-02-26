import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  bookDetailsSchema,
  BookDetails,
  chatResponseSchema,
  ChatResponse,
  // AddFavoriteResponse,
  addFavoriteResponseSchema,
  favoritesResponseSchema,
} from "../schemas/apiSchemas";

const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

export const useChatMutation = () =>
  useMutation<ChatResponse, Error, string>(async (userMessage: string) => {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return chatResponseSchema.parse(data);
  });

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
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/auth/favourites/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
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
        const token = getAuthToken();
        const response = await fetch("http://localhost:8000/auth/favourites/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
        const token = getAuthToken();
        
        const response = await fetch("http://localhost:8000/auth/favourites/remove", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ title: bookTitle })
        });
        
        if (!response.ok) {
          throw new Error("Failed to remove favorite");
        }
        
        const data = await response.json();
        return favoritesResponseSchema.parse(data);
      },
      {
        onSuccess: () => {
          // Invalidate favorites query to refetch the updated list
          queryClient.invalidateQueries(["favorites"]);
        }
      }
    );
  };