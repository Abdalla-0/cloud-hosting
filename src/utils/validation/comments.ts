import { z } from "zod";
export const createCommentSchema = z.object({
  text: z.string().min(2).max(500),
  articleId: z.number(),
});

export const updateCommentSchema = z.object({
  text: z.string().min(2).max(500).optional(),
});
