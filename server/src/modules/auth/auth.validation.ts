import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  name: z.string().trim().min(1, "Name is required").max(80),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateMeSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    settings: z
      .object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        pomodoro: z
          .object({
            focusMin: z.number().int().min(1).max(180).optional(),
            shortBreakMin: z.number().int().min(1).max(60).optional(),
            longBreakMin: z.number().int().min(1).max(60).optional(),
            longBreakEvery: z.number().int().min(2).max(12).optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nothing to update",
  });
