import { z } from "zod";

const dayKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const listTasksQuerySchema = z.object({
  day: dayKey.optional(),
  from: dayKey.optional(),
  to: dayKey.optional(),
}).refine(
  (value) => !value.day || (!value.from && !value.to),
  "Use either day or a date range"
).refine(
  (value) => (!value.from && !value.to) || Boolean(value.from && value.to),
  "Both from and to are required for a date range"
);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(300),
  day: dayKey,
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(300).optional(),
    done: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Nothing to update" });

export const idParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});
