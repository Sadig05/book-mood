// Message.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ChatMessage } from "@/components/ChatRoom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface MessageProps {
  message: ChatMessage;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser }) => {
  // State to track the selected book for the modal
  const [selectedBook, setSelectedBook] = useState<null | {
    title: string;
    image: string;
    description?: string;
  }>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  if (message.type === "recommendation" && message.recommendations) {
    return (
      <>
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
            <div className="grid grid-cols-2 gap-4">
              {message.recommendations.map((book, index) => (
                <div
                  key={index}
                  className="bg-card p-4 shadow rounded-md cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-56 object-cover rounded"
                  />
                  <p className="text-center mt-2 text-sm font-medium">
                    {book.title}
                  </p>
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Modal for detailed book view */}
        <Dialog
          open={!!selectedBook}
          onOpenChange={(open) => {
            if (!open) setSelectedBook(null);
          }}
        >
          <DialogContent className="bg-white p-6 max-w-[50vw]">
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Book Image */}
              <div className="md:w-1/2 ">
                {selectedBook && (
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-full h-auto rounded-md object-contain"
                  />
                )}
              </div>
              {/* Right Side: Book Name & Description */}
              <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0 flex flex-col ">
                <DialogHeader>
                  <DialogTitle>{selectedBook?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedBook?.description ||
                      "Detailed information about the book."}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
            <DialogClose asChild>
              <Button variant="default" className="mt-4">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default text message rendering:
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
          {message.userId.slice(0, 2).toUpperCase()}
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
              : "bg-secondary text-secondary-foreground rounded-bl-sm"
          )}
        >
          <p className="text-sm">{message.content}</p>
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
