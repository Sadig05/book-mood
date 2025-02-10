// authQueries.ts
import { useMutation } from "react-query";
import { queryClient, BASE_URL } from "../reactQuery";
import {
  registerSchema,
  loginSchema,
  RegisterResponse,
  LoginResponse,
  RegisterPayload,
  LoginPayload,
} from "../schemas/authSchema";
import { signIn, signOut } from "@/utils/auth"; // our helper to mark authentication

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
    throw new Error("Registration failed");
  }

  const data = await response.json();

  const parsedData = registerSchema.safeParse(data);
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
    credentials: "include", // send cookies along with the request
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();

  const parsedData = loginSchema.safeParse(data);
  if (!parsedData.success) {
    console.error(parsedData.error);
    throw new Error("Invalid response structure");
  }

  return parsedData.data;
};

// Function to fetch the current user
const fetchCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/current_user`, {
    method: "GET",
    credentials: "include", // include cookies
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};

const logoutUser = async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST", // or GET if your backend expects that
      credentials: "include", // include cookies
    });
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    return response.json();
  };
  
  

// React Query hooks
export const useAuth = () => {
  const registerMutation = useMutation(registerUser, {
    onSuccess: () => {
      console.log("Registration successful");
      queryClient.invalidateQueries("users"); // Optional: modify as needed
    },
  });

  const loginMutation = useMutation(loginUser, {
    onSuccess: async (loginData) => {
      console.log("Login successful, message:", loginData.message);

      // After successful login, fetch the current user data.
      try {
        const userData = await fetchCurrentUser();
        console.log("Fetched current user:", userData);

        // Assuming userData contains a token property,
        // save it to local storage.
        if (userData.token) {
          localStorage.setItem("token", userData.token);
        }

        // Mark the user as authenticated (your helper might also do other tasks)
        await signIn();

        // Optionally, you can invalidate queries or perform other actions:
        queryClient.invalidateQueries("currentUser");
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    },
  });

  const LogoutMutation = useMutation(logoutUser, {
    onSuccess: () => {
      // Clear authentication state
      signOut();
      // Optionally, invalidate queries related to the user
      queryClient.invalidateQueries("currentUser");
    },
  });

  return {
    registerMutation,
    loginMutation,
    LogoutMutation
  };
};
