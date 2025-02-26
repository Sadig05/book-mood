import { MessageType } from "@/components/ChatRoom";
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape for a chat message.

// Define the context type.
interface ChatContextType {
  messages: MessageType[];
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
}

// Create the context.
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component.
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
