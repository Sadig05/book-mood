import { z } from "zod";

// Define the response schema
export const chatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        role: z.string(),
        content: z.string(),
      }),
    })
  ),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Initialize conversation history
let conversationHistory: { role: string; content: string }[] = [
  { role: "system", content: "You are a helpful assistant." }, // Initial system prompt
];

const fetchChatResponse = async (message: string): Promise<ChatResponse> => {
  console.log("Sending API request with message:", message);

  // Add user message to the conversation history
  conversationHistory.push({ role: "user", content: message });
  conversationHistory = conversationHistory.slice(-6);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: conversationHistory, // Include the entire conversation history
    }),
  });

  console.log("Received API response with status:", response.status);

  if (response.status === 429) {
    console.error("Rate limit exceeded. Retrying...");
    // Handle rate limit with retries or fallback
  }

  if (!response.ok) {
    throw new Error("Failed to fetch chat response");
  }

  const data = await response.json();
  const parsedData = chatResponseSchema.safeParse(data);

  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid response structure");
  }

  // Add assistant's response to the conversation history
  const assistantMessage = parsedData.data.choices[0].message;
  conversationHistory.push(assistantMessage);

  return parsedData.data;
};

export { fetchChatResponse };
