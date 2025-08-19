import { z } from "zod/v4";

export const createGigSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z
    .string()
    .nonempty("Description is required")
    .min(50, "Description must be at least 50 characters long"),
  labels: z.array(z.string()).min(1, "At least one label is required"),
});

export type TCreateGigSchema = z.infer<typeof createGigSchema>;
