import { z } from "zod"

export const userSchema = z.object({
    id: z.number(),
    userId: z.number(),
    title: z.string(),
    body: z.string(),
})


  export type User = z.infer<typeof userSchema>;
  export const usersSchema = z.array(userSchema);

  export type Users = z.infer<typeof usersSchema>;


export const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
})

export type createUser = z.infer<typeof createUserSchema>;
