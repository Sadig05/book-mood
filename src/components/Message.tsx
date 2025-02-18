/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ChatMessage } from "@/components/ChatRoom";
import { Book } from "lucide-react";

interface MessageProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  onRecommendationClick?: (recommendations: any[]) => void;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser, onRecommendationClick }) => {
  const currentUser = useSelector((state: RootState) => state.user);

  const handleRecommendationClick = () => {
    if (message.type === 'recommendation' && message.recommendations && onRecommendationClick) {
      onRecommendationClick(message.recommendations);
    }
  };

  return (
    <div
      className={cn(
        "flex items-end space-x-2 mb-4",
        isCurrentUser ? "flex-row-reverse space-x-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.avatar} alt={message.userId} />
        <AvatarFallback>
          {/* If the message is from the current user, show their initials from Redux */}
          {currentUser && message.userId === currentUser.id
            ? currentUser.username?.slice(0, 2).toUpperCase()
            : message.userId.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "max-w-md px-4 py-2 rounded-3xl",
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : message.type === 'recommendation'
              ? "bg-blue-100 text-blue-900 rounded-bl-sm" 
              : "bg-secondary text-secondary-foreground rounded-bl-sm",
            message.type === 'recommendation' && "cursor-pointer hover:bg-blue-200 transition-colors"
          )}
          onClick={handleRecommendationClick}
        >
          <div className="flex items-center gap-2">
            {message.type === 'recommendation' && (
              <Book className="h-4 w-4 text-blue-600" />
            )}
            <p className="text-sm">{message.content}</p>
          </div>
          {message.type === 'recommendation' && (
            <p className="text-xs text-blue-600 mt-1">Click to view recommendations</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;