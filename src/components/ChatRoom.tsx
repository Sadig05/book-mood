// chatroom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Message from './Message';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenTool  } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import '../styles/chat-background.css';

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
  type?: 'text' | 'recommendation';
  recommendations?: Book[];
}

interface ChatRoomProps {
  roomId: string;
}

// Mock function to fetch initial messages
const fetchMessages = async (): Promise<ChatMessage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          userId: 'user1',
          content: 'Hello!',
          timestamp: '2023-05-01T12:00:00Z',
          avatar: '/avatars/user1.png',
          type: 'text'
        },
        // …other initial messages if needed
      ]);
    }, 500);
  });
};

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId = '1' }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery(['messages', roomId], () => fetchMessages());

  // Mutation to "send" a user message
  const sendMessage = useMutation(
    async (content: string) => {
      // Simulate an API call to send a message:
      return new Promise<ChatMessage>((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            userId: 'currentUser',
            content,
            timestamp: new Date().toISOString(),
            avatar: '/avatars/current-user.png',
            type: 'text'
          });
        }, 0);
      });
    },
    {
      onSuccess: (userMessage) => {
        // Update the messages with the user’s message.
        queryClient.setQueryData<ChatMessage[]>(['messages', roomId], (old) => [...(old || []), userMessage]);

        // Simulate a delayed bot response with book recommendations:
        setTimeout(() => {
          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: 'bookBot',
            timestamp: new Date().toISOString(),
            avatar: '/avatars/book-bot.png',
            type: 'recommendation',
            recommendations: [
              { title: "The Great Gatsby", image: "/src/assets/book.jpeg" },
              { title: "1984", image: "/src/assets/book.jpeg" , description: "A dystopian novel by George Orwell A dystopian novel by George Orwell A dystopian novel by George Orwell A dystopian novel by George OrwellA dystopian novel by George Orwell" },
              { title: "To Kill a Mockingbird", image: "/src/assets/book.jpeg" },
              { title: "Pride and Prejudice", image: "/src/assets/book.jpeg" },
            ]
          };
          queryClient.setQueryData<ChatMessage[]>(['messages', roomId], (old) => [...(old || []), botMessage]);
        }, 1000); // delay before the bot response
      },
    }
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage.mutate(newMessage);
      setNewMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background chat-background animated-gradient backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4 bg-background/30">
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
                isCurrentUser={message.userId === 'currentUser'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet
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
          <Button type="submit" size="icon">
            <PenTool className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
