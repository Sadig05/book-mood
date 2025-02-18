import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenTool, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "../styles/chat-background.css";
import BookRecommendationCanvas from "./BookRecommendationCanvas";
import { EmotionalBook, ThematicBook } from "@/api/schemas/apiSchemas";
import { useChatMutation } from "@/api/queries/apiQueries";

// Define a simple type for our messages.
type MessageType = {
  id: string;
  sender: "user" | "bot";
  content: string;
  // If the bot returns recommendations, this field will be set.
  recommendations?: (EmotionalBook | ThematicBook)[];
};

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const [newMessage, setNewMessage] = useState("");
  const [showExampleQuestions, setShowExampleQuestions] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [activeRecommendations, setActiveRecommendations] = useState<
    (EmotionalBook | ThematicBook)[] | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const exampleQuestions = [
    "What's a good book for a rainy day?",
    "Recommend me a mystery novel.",
    "I need a self-help book suggestion.",
    "What are some classic novels to read?",
  ];

  // Use our chat mutation hook.
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

      // Call the API with the user's message.
      chatMutation.mutate(newMessage, {
        onSuccess: (data) => {
          // Merge the two book arrays.
          const emotionalBooks = data.books.emotional;
          const thematicBooks = data.books.thematic;
          const allBooks = [...emotionalBooks, ...thematicBooks];

          const botMsg: MessageType = {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            content: data.response,
            recommendations: allBooks.length > 0 ? allBooks : undefined,
          };

          setMessages((prev) => [...prev, botMsg]);

          if (allBooks.length > 0) {
            setActiveRecommendations(allBooks);
          }
        },
        onError: () => {
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

  const handleExampleClick = (question: string) => {
    setNewMessage(question);
    // Simulate sending the message immediately.
    handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
    setShowExampleQuestions(false);
  };

  const closeRecommendations = () => {
    setActiveRecommendations(null);
  };

  const handleRecommendationClick = (recommendations: (EmotionalBook | ThematicBook)[]) => {
    setActiveRecommendations(recommendations);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div
        className={`flex flex-col ${activeRecommendations ? "w-1/2" : "w-full"} bg-background chat-background animated-gradient backdrop-blur-sm transition-all duration-300`}
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
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="p-4 bg-card bg-opacity-80 backdrop-blur-sm">
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

      {/* Book Recommendations Canvas */}
      {activeRecommendations && (
        <div className="w-1/2 h-full bg-background/95 border-l border-border overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-3 bg-card">
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
