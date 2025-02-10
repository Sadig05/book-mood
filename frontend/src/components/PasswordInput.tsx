import React, { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input"; // Adjust based on your ShadCN setup
import { Eye, EyeOff } from "lucide-react"; // Replace with your icon library if needed

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <Input
        type={isPasswordVisible ? "text" : "password"}
        className={`pr-12 ${className}`} // Add padding to make space for the icon
        ref={ref} // Correctly forward the ref to Input
        {...props}
      />

      {/* Eye Icon */}
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
      >
        {isPasswordVisible ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    </div>
  );
});

export default PasswordInput;
