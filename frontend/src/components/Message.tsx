/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book as BookIcon } from "lucide-react";

type MessageType = {
  id: string;
  sender: "user" | "bot";
  content: string;
  recommendations?: any[];
};

interface MessageProps {
  message: MessageType;
  onRecommendationClick?: (recommendations: any[]) => void;
}

const Message: React.FC<MessageProps> = ({ message, onRecommendationClick }) => {
  const isUser = message.sender === "user";

  const handleClick = () => {
    if (!isUser && message.recommendations && onRecommendationClick) {
      onRecommendationClick(message.recommendations);
    }
  };

  return (
    <div
      className={`flex items-end space-x-2 mb-4 ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
      onClick={handleClick}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isUser ? "/avatars/current-user.png" : "/avatars/book-bot.png"} alt={message.sender} />
        <AvatarFallback>
          {isUser ? "ME" : "BOT"}
        </AvatarFallback>
      </Avatar>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-md px-4 py-2 rounded-3xl ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : message.recommendations
              ? "bg-blue-100 text-blue-900 rounded-bl-sm cursor-pointer hover:bg-blue-200 transition-colors"
              : "bg-secondary text-secondary-foreground rounded-bl-sm"
          }`}
        >
          <div className="flex items-center gap-2">
            {!isUser && message.recommendations && <BookIcon className="h-4 w-4 text-blue-600" />}
            <p className="text-sm">{message.content}</p>
          </div>
          {!isUser && message.recommendations && (
            <p className="text-xs text-blue-600 mt-1">Click to view recommendations</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default Message;
