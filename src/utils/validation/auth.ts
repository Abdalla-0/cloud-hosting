import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.email().min(3).max(200),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email().min(3).max(200),
  password: z.string().min(6),
});

export const updateUserSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.email().min(3).max(200).optional(),
  password: z.string().min(6).optional(),
});
