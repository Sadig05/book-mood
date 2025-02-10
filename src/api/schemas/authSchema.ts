import { z } from "zod";

export const registerSchema = z.object({
    message: z.string(),
});

export type RegisterResponse = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    message: z.string(),
});

export type LoginResponse = z.infer<typeof loginSchema>;

export const registerPayloadSchema = z.object({
    username: z.string(),
    name: z.string(),
    password: z.string(),
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

export const loginPayloadSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;
