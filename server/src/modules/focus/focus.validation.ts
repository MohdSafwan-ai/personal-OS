import { z } from "zod";

const dayKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const logFocusSchema = z.object({
  day: dayKey,
  seconds: z.number().int().min(1).max(24 * 3600),
});

export const summaryQuerySchema = z.object({
  from: dayKey,
  to: dayKey,
});
