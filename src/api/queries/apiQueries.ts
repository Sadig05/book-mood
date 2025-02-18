import { useMutation, useQuery } from "react-query";
import {
  bookDetailsSchema,
  BookDetails,
  chatResponseSchema,
  ChatResponse,
} from "../schemas/apiSchemas";

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
