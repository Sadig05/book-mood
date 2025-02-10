import { SendHorizontal } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter key action (like newline)
      handleSend();
    }
  };

  return (
    <div className="relative p-4 border-t border-gray-300 bg-white shadow-md rounded-lg">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="resize-none w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] max-h-[150px] transition-all"
      />
      {/* Send Icon positioned inside the textarea */}
      <button
        onClick={handleSend}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
      >
        <SendHorizontal size={24} />
      </button>
    </div>
  );
};

export default ChatInput;
