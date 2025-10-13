import { z } from "zod/v4";

const location = z.discriminatedUnion("locationType", [
  z.object({ locationType: z.literal("virtual") }),
  z.object({
    locationType: z.literal("physical"),
    venue: z.object({
      google_place_id: z.string(),
      name: z
        .string()
        .nonempty("Venue name is required")
        .min(3, "Venue name must be at least 3 characters long")
        .max(100, "Venue name must be at most 100 characters long"),
      address: z.string(),
      location: z.object({
        country: z.string().nonempty("Country is required"),
        stateRegion: z.string().nonempty("State/Region is required"),
        city: z.string().nonempty("City is required"),
      }),
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
  startDateTime: z.iso.datetime(),
  endDateTime: z.iso.datetime(),
  timeZone: z.string(),
  compensation: z
    .number()
    .min(5, "Must be at least $5")
    .max(1000000, "Must be at most $1,000,000"),
});

export type TCreateGigSchema = z.infer<typeof createGigSchema>;
