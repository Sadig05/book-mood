import { cn } from "@/lib/utils";
import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === "user";
  return (
    <div className={cn("flex my-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-md p-4 rounded-lg shadow-lg transition-all",
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        )}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
