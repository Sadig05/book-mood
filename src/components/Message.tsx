/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book as BookIcon } from "lucide-react";

interface MessageType {
  id: string;
  sender: "user" | "bot";
  content: string;
  recommendations?: any[];
  timestamp?: string;
}

interface MessageProps {
  message: MessageType;
  onRecommendationClick?: (recs: any[]) => void;
}

const Message: React.FC<MessageProps> = ({ message, onRecommendationClick }) => {
  const isUser = message.sender === "user";
  const hasRecommendations =
    !isUser && message.recommendations && message.recommendations.length > 0;

  const handleClick = () => {
    if (hasRecommendations && onRecommendationClick) {
      onRecommendationClick(message.recommendations!);
    }
  };

  return (
    <div
      className={`flex items-end space-x-2 mb-4 ${
        isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      }`}
      onClick={handleClick}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={isUser ? "/avatars/current-user.png" : "/avatars/book-bot.png"}
          alt={message.sender}
        />
        <AvatarFallback>{isUser ? "ME" : "BM"}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-md px-4 py-2 rounded-3xl ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : hasRecommendations
              ? "bg-blue-100 text-blue-900 rounded-bl-sm cursor-pointer hover:bg-blue-200 transition-colors"
              : "bg-secondary text-secondary-foreground rounded-bl-sm"
          }`}
        >
          <div className="flex items-center gap-2">
            {hasRecommendations && <BookIcon className="h-4 w-4 text-blue-600" />}
            <p className="text-sm">{message.content}</p>
          </div>
          {hasRecommendations && (
            <p className="text-xs text-blue-600 mt-1">Click to view recommendations</p>
          )}
        </div>
        {message.timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
