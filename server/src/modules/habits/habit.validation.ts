import { z } from "zod";

const dayKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const createHabitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  emoji: z.string().trim().min(1).max(8).optional(),
});

export const updateHabitSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    emoji: z.string().trim().min(1).max(8).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });

export const checkinSchema = z.object({
  day: dayKey,
  done: z.boolean(),
});

export const idParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});
