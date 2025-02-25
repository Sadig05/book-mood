import { z } from "zod";

// Register schemas
export const registerPayloadSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const registerResponseSchema = z.object({
  message: z.string(),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// Login schemas
export const loginPayloadSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export const loginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Current user schema
export const currentUserSchema = z.object({
  id: z.number(),
  username: z.string(),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;