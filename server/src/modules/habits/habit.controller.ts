import type { Request, Response } from "express";
import type { z } from "zod";
import { ApiError } from "../../middleware/error-handler.js";
import { Habit, toPublicHabit } from "./habit.model.js";
import type {
  checkinSchema,
  createHabitSchema,
  updateHabitSchema,
} from "./habit.validation.js";

export async function listHabits(req: Request, res: Response): Promise<void> {
  const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: 1 });
  res.json({ habits: habits.map(toPublicHabit) });
}

export async function createHabit(req: Request, res: Response): Promise<void> {
  const { name, emoji } = req.body as z.infer<typeof createHabitSchema>;
  const habit = await Habit.create({ userId: req.userId, name, emoji });
  res.status(201).json({ habit: toPublicHabit(habit) });
}

export async function updateHabit(req: Request, res: Response): Promise<void> {
  const updates = req.body as z.infer<typeof updateHabitSchema>;
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: updates },
    { new: true }
  );
  if (!habit) throw new ApiError(404, "Habit not found");
  res.json({ habit: toPublicHabit(habit) });
}

/** Idempotently add or remove a day from the habit's check-in set. */
export async function checkinHabit(req: Request, res: Response): Promise<void> {
  const { day, done } = req.body as z.infer<typeof checkinSchema>;
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    done ? { $addToSet: { checkins: day } } : { $pull: { checkins: day } },
    { new: true }
  );
  if (!habit) throw new ApiError(404, "Habit not found");
  res.json({ habit: toPublicHabit(habit) });
}

export async function deleteHabit(req: Request, res: Response): Promise<void> {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!habit) throw new ApiError(404, "Habit not found");
  res.status(204).end();
}
