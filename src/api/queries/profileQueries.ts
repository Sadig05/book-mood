// src/api/queries/profileQueries.ts
import { useQuery } from "react-query";
import { profileSchema, Profile } from "../schemas/profileSchema";
import { getAuthHeaders, isAuthenticated } from "@/utils/auth";

const BASE_URL = "http://localhost:8000";

const fetchProfile = async (): Promise<Profile> => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data = await response.json();
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid profile data structure");
  }

  return parsed.data;
};

export const useProfile = () => {
  return useQuery("profile", fetchProfile, {
    enabled: isAuthenticated(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
