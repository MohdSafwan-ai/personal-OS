import { Schema, model, type Document, type Types } from "mongoose";

export interface HabitDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  name: string;
  emoji: string;
  /** Sorted set of local-day keys the habit was completed, newest last. */
  checkins: string[];
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<HabitDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    emoji: { type: String, default: "✅", maxlength: 8 },
    checkins: { type: [String], default: [] },
  },
  { timestamps: true }
);

/** Consecutive-day streak counted back from the most recent check-in. */
function computeStreak(checkins: string[]): number {
  if (checkins.length === 0) return 0;
  const sorted = [...checkins].sort();
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const cur = new Date(sorted[i]);
    const prev = new Date(sorted[i - 1]);
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export function toPublicHabit(habit: HabitDocument) {
  const sorted = [...habit.checkins].sort();
  return {
    id: habit._id.toString(),
    name: habit.name,
    emoji: habit.emoji,
    streak: computeStreak(habit.checkins),
    lastDoneDay: sorted[sorted.length - 1] ?? null,
    checkins: sorted.slice(-90), // enough for streak/heatmap UIs
  };
}

export const Habit = model<HabitDocument>("Habit", habitSchema);
