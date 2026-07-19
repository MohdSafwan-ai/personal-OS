import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { z } from "zod";
import { FocusSession } from "./focus.model.js";
import type { logFocusSchema, summaryQuerySchema } from "./focus.validation.js";

export async function logFocus(req: Request, res: Response): Promise<void> {
  const { day, seconds } = req.body as z.infer<typeof logFocusSchema>;
  await FocusSession.create({ userId: req.userId, day, seconds });
  res.status(201).json({ ok: true });
}

/** Per-day totals for a day-key range (inclusive) — feeds the weekly chart. */
export async function focusSummary(req: Request, res: Response): Promise<void> {
  const { from, to } = req.query as z.infer<typeof summaryQuerySchema>;
  const rows = await FocusSession.aggregate<{ _id: string; seconds: number }>([
    {
      $match: {
        userId: new Types.ObjectId(req.userId),
        day: { $gte: from, $lte: to },
      },
    },
    { $group: { _id: "$day", seconds: { $sum: "$seconds" } } },
  ]);
  const byDay: Record<string, number> = {};
  for (const row of rows) byDay[row._id] = row.seconds;
  res.json({ byDay });
}
