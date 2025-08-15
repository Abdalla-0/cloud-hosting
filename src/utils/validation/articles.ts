import { z } from "zod";
export const createArticleSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
});

export const updateArticleSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
});
