import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { fetchChatResponse } from "@/api/queries/chatQuery";
import { addMessage } from "@/redux/chatSlice";
import { RootState } from "@/redux/store";  // Assuming you have this type for your store

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);

  const { mutate: sendChatMessage, isLoading } = useMutation(fetchChatResponse, {
    onSuccess: (data) => {
      // Dispatching assistant's response after the API call completes
      dispatch(addMessage({ role: "assistant", content: data.choices[0].message.content }));
    },
    onError: (error) => {
      console.error("Error fetching chat response:", error);
      // Optionally, dispatch an error message or show a UI error
    }
  });

  const handleSendMessage = useCallback(
    (content: string) => {
      // Dispatch the user's message immediately
      dispatch(addMessage({ role: "user", content }));
      // Send the message to the API
      sendChatMessage(content);
    },
    [dispatch, sendChatMessage]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatMessage role="assistant" content="Typing..." />}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
