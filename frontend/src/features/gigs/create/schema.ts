import { z } from "zod/v4";

const location = z.discriminatedUnion("locationType", [
  z.object({ locationType: z.literal("virtual") }),
  z.object({
    locationType: z.literal(["physical", "hybrid"]),
    venue: z
      .string()
      .nonempty("Venue is required")
      .min(3, "Venue must be at least 3 characters long")
      .max(100, "Venue must be at most 100 characters long"),
    location: z.object({
      country: z.string().nonempty("Country is required"),
      stateRegion: z.string().nonempty("State/Region is required"),
      city: z.string().nonempty("City is required"),
    }),
  }),
]);


export const createGigSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters long"),
  labels: z.array(z.string()).min(1, "At least one label is required"),
  location,
});

export type TCreateGigSchema = z.infer<typeof createGigSchema>;
