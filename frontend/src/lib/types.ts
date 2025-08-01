import * as z from "zod/v4";

export type ExtractKeys<T> = T extends object
  ? {
      [K in keyof T & string]:
        | K
        | (T[K] extends object ? `${K}.${ExtractKeys<T[K]>}` : K);
    }[keyof T & string]
  : never;

export type Role = "client" | "agent";

export const signUpSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    location: z.object({
      country: z.string(),
      city: z.string(),
      stateRegion: z.string(),
    }),
    termsAgreed: z.literal(true, {
      message: "Please accept the Terms of Service before continuing",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
