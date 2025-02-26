import React, { useState, useEffect, useRef, useContext } from "react";
import Message from "./Message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenTool, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "../styles/chat-background.css";
import BookRecommendationCanvas from "./BookRecommendationCanvas";
import { EmotionalBook, ThematicBook } from "@/api/schemas/apiSchemas";
import { useChatMutation } from "@/api/queries/apiQueries";
import { ChatContext } from "@/context/ChatContext";

// Define a simple type for our chat messages.
export type MessageType = {
  id: string;
  sender: "user" | "bot";
  content: string;
  // For bot messages that include recommendations.
  recommendations?: (EmotionalBook | ThematicBook)[];
};

// Define the shape for recommendations as separate arrays.
type Recommendations = {
  emotional: (EmotionalBook | ThematicBook)[];
  thematic: (EmotionalBook | ThematicBook)[];
};

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const chatContext = useContext(ChatContext);
  if (!chatContext) {
    throw new Error("ChatRoom must be used within a ChatProvider");
  }
  const { messages, setMessages } = chatContext;
  const [newMessage, setNewMessage] = useState("");
  const [showExampleQuestions, setShowExampleQuestions] = useState(true);
  // const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeRecommendations, setActiveRecommendations] =
    useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQuestions = [
    "What's a good book for a rainy day?",
    "Recommend me a mystery novel.",
    "I need a self-help book suggestion.",
    "What are some classic novels to read?",
  ];

  const chatMutation = useChatMutation();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Add the user's message immediately.
      const userMsg: MessageType = {
        id: Date.now().toString(),
        sender: "user",
        content: newMessage,
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      // Call the chat API.
      chatMutation.mutate(newMessage, {
        onSuccess: (data) => {
          setLoading(false);
          let emotionalBooks: (EmotionalBook | ThematicBook)[] = [];
          let thematicBooks: (EmotionalBook | ThematicBook)[] = [];
          // Assuming API returns an object with emotional and thematic arrays.
          if (
            data.books &&
            typeof data.books === "object" &&
            !Array.isArray(data.books)
          ) {
            emotionalBooks = data.books.emotional;
            thematicBooks = data.books.thematic;
          }
          const botMsg: MessageType = {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            content: data.response,
            recommendations: [...emotionalBooks, ...thematicBooks],
          };
          setMessages((prev) => [...prev, botMsg]);

          // Set the active recommendations if any exist.
          if (emotionalBooks.length > 0 || thematicBooks.length > 0) {
            setActiveRecommendations({
              emotional: emotionalBooks,
              thematic: thematicBooks,
            });
          } else {
            setActiveRecommendations(null);
          }
        },
        onError: () => {
          setLoading(false);
          const errorMsg: MessageType = {
            id: (Date.now() + 2).toString(),
            sender: "bot",
            content: "Sorry, there was an error processing your request.",
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      });

      setNewMessage("");
      if (showExampleQuestions) setShowExampleQuestions(false);
    }
  };

  // When a bot message is clicked, update the recommendations state
  // so that the canvas opens. We filter the merged recommendations into two arrays.
  const handleRecommendationClick = (
    recs: (EmotionalBook | ThematicBook)[]
  ) => {
    const emotional = recs.filter(
      (book: EmotionalBook | ThematicBook) => "match_score" in book
    );
    const thematic = recs.filter(
      (book: EmotionalBook | ThematicBook) => "similarity" in book
    );
    setActiveRecommendations({ emotional, thematic });
  };

  const handleExampleClick = (question: string) => {
    setNewMessage(question);
    // Simulate sending the message immediately.
    handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
    setShowExampleQuestions(false);
  };

  const closeRecommendations = () => {
    setActiveRecommendations(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Chat Area */}
      <div
        className={`flex flex-col ${
          activeRecommendations ? "w-1/2" : "w-full"
        } bg-background chat-background animated-gradient backdrop-blur-sm transition-all duration-300`}
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
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[80%] text-muted-foreground">
              No messages yet
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  message={msg}
                  onRecommendationClick={handleRecommendationClick}
                />
              ))}
              {loading && (
                <div className="flex justify-center items-center text-muted-foreground animate-pulse">
                  The bot is thinking...
                </div>
              )}

              <div ref={messagesEndRef} />
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
            <Button type="submit" size="icon" disabled={chatMutation.isLoading}>
              <PenTool className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Recommendation Canvas */}
      {activeRecommendations && (
        <div className="w-1/2 h-full bg-background/95 border-l border-border overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-3 bg-card">
            <h3 className="text-lg font-medium">Book Recommendations</h3>
            <Button variant="ghost" size="icon" onClick={closeRecommendations}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <BookRecommendationCanvas recommendations={activeRecommendations} />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
