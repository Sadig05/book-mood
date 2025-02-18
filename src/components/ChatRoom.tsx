import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Message from "./Message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenTool, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "../styles/chat-background.css";
import BookRecommendationCanvas from "./BookRecommendationCanvas"; // New component we'll create
// import { getGoogleBookThumbnail } from "@/utils/functions";

interface Book {
  title: string;
  image: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  timestamp: string;
  avatar?: string;
  // For a plain text message:
  content?: string;
  // New properties to support recommendations:
  type?: "text" | "recommendation";
  recommendations?: Book[];
}

interface ChatRoomProps {
  roomId: string;
}

/**
 * Processes an array of books by replacing the original image URL
 * with the extracted thumbnail (if available).
 */
// async function processBookImages(books: Book[]): Promise<Book[]> {
//   return Promise.all(
//     books.map(async (book) => {
//       const thumbnail = await getGoogleBookThumbnail(book.image);
//       return { ...book, image: thumbnail || book.image };
//     })
//   );
// }

// Mock function to fetch initial messages
const fetchMessages = async (): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Initially we can return an empty array or a greeting message
      resolve([]);
      // Alternatively, if you want a greeting message:
      // resolve([
      //   {
      //     id: "1",
      //     userId: "user1",
      //     content: "Hello!",
      //     timestamp: "2023-05-01T12:00:00Z",
      //     avatar: "/avatars/user1.png",
      //     type: "text",
      //   },
      // ]);
    }, 500);
  });
};

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId = "1" }) => {
  const [newMessage, setNewMessage] = useState("");
  const [showExampleQuestions, setShowExampleQuestions] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeRecommendations, setActiveRecommendations] = useState<
    Book[] | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const exampleQuestions = [
    "What's a good book for a rainy day?",
    "Recommend me a mystery novel.",
    "I need a self-help book suggestion.",
    "What are some classic novels to read?",
  ];

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery(["messages", roomId], () => fetchMessages(), {
    staleTime: Infinity, // Data will never be considered stale
    cacheTime: 1000 * 60 * 60, // Cache for an hour
  });

  // Mutation to "send" a user message
  const sendMessage = useMutation(
    async (content: string) => {
      // Simulate an API call to send a message:
      return new Promise<ChatMessage>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            userId: "currentUser",
            content,
            timestamp: new Date().toISOString(),
            avatar: "/avatars/current-user.png",
            type: "text",
          });
        }, 0);
      });
    },
    {
      onSuccess: (userMessage) => {
        if (showExampleQuestions) {
          setShowExampleQuestions(false);
        }
        // Update the messages with the user's message.
        queryClient.setQueryData<ChatMessage[]>(["messages", roomId], (old) => [
          ...(old || []),
          userMessage,
        ]);

        // Simulate a delayed bot response with book recommendations:
        setTimeout(() => {
          // Check if the user's message triggers the book recommendation model
          if (
            userMessage.content?.toLowerCase().includes("recommend") ||
            userMessage.content?.toLowerCase().includes("book") ||
            userMessage.content?.toLowerCase().includes("reading")
          ) {
            // Create book recommendations with the original Google Books URL
            const books: Book[] = [
              {
                title: "The Great Gatsby",
                image:
                  "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
              },
              {
                title: "1984",
                image:
                  "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
                description: "A dystopian novel by George Orwell.",
              },
              {
                title: "To Kill a Mockingbird",
                image:
                  "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
              },
              {
                title: "Pride and Prejudice",
                image:
                  "http://images.amazon.com/images/P/0195153448.01.LZZZZZZZ.jpg",
              },
            ];

            // Process the image URLs to extract the thumbnails
            const botRecommendationMessage: ChatMessage = {
              id: Date.now().toString(),
              userId: "bookBot",
              content:
                "I've found some books that might interest you! Click to view recommendations.",
              timestamp: new Date().toISOString(),
              avatar: "/avatars/book-bot.png",
              type: "recommendation",
              recommendations: books,
            };

            queryClient.setQueryData<ChatMessage[]>(
              ["messages", roomId],
              (old) => [...(old || []), botRecommendationMessage]
            );

            // Automatically show the recommendations
            setActiveRecommendations(books);
          } else {
            // Regular text response for non-book queries
            const botMessage: ChatMessage = {
              id: Date.now().toString(),
              userId: "bookBot",
              content: "I'm here to help! Ask me about book recommendations.",
              timestamp: new Date().toISOString(),
              avatar: "/avatars/book-bot.png",
              type: "text",
            };

            queryClient.setQueryData<ChatMessage[]>(
              ["messages", roomId],
              (old) => [...(old || []), botMessage]
            );
          }
        }, 1000); // delay before the bot response
      },
    }
  );

  const handleExampleClick = (question: string) => {
    // When an example question is clicked, send it as a new message.
    setNewMessage(question);
    sendMessage.mutate(question);
    setShowExampleQuestions(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage.mutate(newMessage);
      setNewMessage("");
    }
  };

  const closeRecommendations = () => {
    setActiveRecommendations(null);
  };

  const handleRecommendationClick = (recommendations: Book[]) => {
    setActiveRecommendations(recommendations);
  };

  useEffect(() => {
    if (!isInitialLoad) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  return (
    <div className="flex h-[100%]">
      {/* Main Chat Area */}
      <div
        className={`flex flex-col ${activeRecommendations ? "w-1/2" : "w-full"} bg-background chat-background animated-gradient backdrop-blur-sm transition-all duration-300 `}
      >
        <ScrollArea className="flex-1 p-4 bg-background/30">
          {showExampleQuestions && (
            <div className="mb-4 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exampleQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleExampleClick(question)}
                  variant="outline"
                  className="text-left"
                >
                  {question}
                </Button>
              ))}
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading messages...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">
              Error loading messages
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isCurrentUser={message.userId === "currentUser"}
                  onRecommendationClick={handleRecommendationClick}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[80%] text-muted-foreground">
              No messages yet
            </div>
          )}
        </ScrollArea>
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-card bg-opacity-80 backdrop-blur-sm"
        >
          <div className="flex max-w-3xl mx-auto">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mr-2 bg-background"
              placeholder="Explore books..."
            />
            <Button type="submit" size="icon">
              <PenTool className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Book Recommendations Canvas */}
      {activeRecommendations && (
        <div className="w-1/2 h-full bg-background/95 border-l border-border overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-3 bg-card  ">
            <h3 className="text-lg font-medium">Book Recommendations</h3>
            <Button variant="ghost" size="icon" onClick={closeRecommendations}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <BookRecommendationCanvas books={activeRecommendations} />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
