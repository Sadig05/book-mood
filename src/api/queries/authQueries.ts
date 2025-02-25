import { useMutation, useQuery } from "react-query";
import {
  registerResponseSchema,
  loginResponseSchema,
  currentUserSchema,
  RegisterResponse,
  LoginResponse,
  RegisterPayload,
  LoginPayload,
  CurrentUser,
} from "../schemas/authSchema";
import { getAuthHeaders, isAuthenticated, signIn, signOut } from "@/utils/auth";

// API base URL
const BASE_URL = "http://localhost:8000";

// Register API call
const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Registration failed");
  }

  const data = await response.json();
  const parsedData = registerResponseSchema.safeParse(data);
  
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid response structure");
  }

  return parsedData.data;
};

// Login API call
const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Login failed");
  }

  const data = await response.json();
  const parsedData = loginResponseSchema.safeParse(data);
  
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid response structure");
  }

  return parsedData.data;
};

// Function to fetch the current user
const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await fetch(`${BASE_URL}/auth/current_user`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data = await response.json();
  const parsedData = currentUserSchema.safeParse(data);
  
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid user data structure");
  }

  return parsedData.data;
};

// Logout API call
const logoutUser = async (): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
};

// React Query hook for authentication
export const useAuth = () => {
  const registerMutation = useMutation(registerUser, {
    onSuccess: (data) => {
      console.log("Registration successful:", data.message);
    },
  });

  const loginMutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      console.log("Login successful");
      
      // Store the JWT token and mark as authenticated
      await signIn(data.access_token);
    },
  });

  const logoutMutation = useMutation(logoutUser, {
    onSuccess: () => {
      // Clear authentication state
      signOut();
    },
  });

  return {
    registerMutation,
    loginMutation,
    logoutMutation,
  };
};

// Hook to get the current authenticated user
export const useCurrentUser = () => {
  return useQuery("currentUser", fetchCurrentUser, {
    enabled: isAuthenticated(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};