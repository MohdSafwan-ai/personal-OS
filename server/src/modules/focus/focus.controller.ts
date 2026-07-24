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

const FLOWVERSE_MILESTONES = [
  { level: 1, bp: 0, name: "Untouched Island", unlock: "Quiet shores" },
  { level: 2, bp: 25, name: "First Growth", unlock: "Wild grass" },
  { level: 5, bp: 150, name: "Grove", unlock: "Forest grove" },
  { level: 10, bp: 400, name: "Shelter", unlock: "Warm cabin" },
  { level: 20, bp: 800, name: "Connected", unlock: "Stone bridge" },
  { level: 35, bp: 1_500, name: "Settlement", unlock: "Village" },
  { level: 50, bp: 3_000, name: "Township", unlock: "Windmill" },
  { level: 75, bp: 6_000, name: "City", unlock: "Lighthouse" },
  { level: 100, bp: 12_000, name: "Kingdom", unlock: "Observatory" },
] as const;

/** Lifetime focus becomes a deterministic world—one focused minute equals one BP. */
export async function flowverseProgress(req: Request, res: Response): Promise<void> {
  const rows = await FocusSession.aggregate<{ _id: string; seconds: number }>([
    { $match: { userId: new Types.ObjectId(req.userId) } },
    { $group: { _id: "$day", seconds: { $sum: "$seconds" } } },
  ]);

  const totalSeconds = rows.reduce((sum, row) => sum + row.seconds, 0);
  const buildPoints = Math.floor(totalSeconds / 60);
  const today = String(req.query.day ?? "");
  const todaySeconds = rows.find((row) => row._id === today)?.seconds ?? 0;

  let milestoneIndex = 0;
  for (let index = FLOWVERSE_MILESTONES.length - 1; index >= 0; index--) {
    if (buildPoints >= FLOWVERSE_MILESTONES[index].bp) {
      milestoneIndex = index;
      break;
    }
  }

  const current = FLOWVERSE_MILESTONES[milestoneIndex];
  const next = FLOWVERSE_MILESTONES[milestoneIndex + 1] ?? null;
  const progress = next
    ? Math.round(((buildPoints - current.bp) / (next.bp - current.bp)) * 100)
    : 100;

  res.json({
    buildPoints,
    todayBuildPoints: Math.floor(todaySeconds / 60),
    current,
    next,
    progress: Math.max(0, Math.min(100, progress)),
    remaining: next ? next.bp - buildPoints : 0,
    milestones: FLOWVERSE_MILESTONES,
  });
}
