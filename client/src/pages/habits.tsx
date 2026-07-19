import { AnimatePresence, motion } from "framer-motion";
import { Flame, Pencil, Plus, Repeat, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  useAddHabit,
  useCheckinHabit,
  useDeleteHabit,
  useHabits,
  useUpdateHabit,
  type ApiHabit,
} from "@/lib/queries";
import { cn, toDayKey } from "@/lib/utils";
import { useActivityStore } from "@/store/dashboard";

const inputCls = cn(
  "h-9 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none",
  "transition-all duration-200 placeholder:text-muted-foreground",
  "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
);

/** Last 13 weeks as columns (GitHub-style), oldest → newest. */
function heatmapWeeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  // Start from the Monday 12 weeks back.
  const start = new Date(today);
  start.setDate(start.getDate() - 7 * 12 - ((today.getDay() + 6) % 7));
  const cursor = new Date(start);
  while (cursor <= today) {
    const week: string[] = [];
    for (let i = 0; i < 7 && cursor <= today; i++) {
      week.push(toDayKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function Heatmap({ habit }: { habit: ApiHabit }) {
  const done = new Set(habit.checkins);
  const weeks = heatmapWeeks();
  return (
    <div className="flex gap-[3px] overflow-x-auto pb-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: wi * 0.015, duration: 0.2 }}
              title={day}
              className={cn(
                "h-2.5 w-2.5 rounded-[3px]",
                done.has(day) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HabitRow({ habit }: { habit: ApiHabit }) {
  const checkin = useCheckinHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const logActivity = useActivityStore((s) => s.logActivity);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(habit.name);
  const [emojiDraft, setEmojiDraft] = useState(habit.emoji);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const today = toDayKey();
  const doneToday = habit.lastDoneDay === today;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)]"
    >
      <div className="mb-4 flex items-center gap-3">
        {editing ? (
          <form
            className="flex flex-1 items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const name = nameDraft.trim();
              const emoji = emojiDraft.trim();
              if (name) updateHabit.mutate({ id: habit.id, name, emoji: emoji || undefined });
              setEditing(false);
            }}
          >
            <input
              value={emojiDraft}
              onChange={(e) => setEmojiDraft(e.target.value)}
              className={cn(inputCls, "w-14 text-center")}
              maxLength={4}
              aria-label="Emoji"
            />
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              autoFocus
              className={inputCls}
              aria-label="Habit name"
            />
            <button
              type="submit"
              className="h-9 shrink-0 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              Save
            </button>
          </form>
        ) : (
          <>
            <span className="text-2xl leading-none">{habit.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{habit.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame
                  className={cn(
                    "h-3.5 w-3.5",
                    habit.streak >= 7 ? "text-chart-3" : "text-muted-foreground/50"
                  )}
                />
                {habit.streak} day streak · {habit.checkins.length} check-ins in 90 days
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => {
                  setEditing(true);
                  setNameDraft(habit.name);
                  setEmojiDraft(habit.emoji);
                }}
                aria-label="Edit habit"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteHabit.mutate(habit.id)}
                    className="h-8 rounded-lg bg-destructive px-2.5 text-xs font-semibold text-destructive-foreground transition-transform active:scale-95"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Cancel delete"
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Delete habit"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  checkin.mutate({ id: habit.id, done: !doneToday });
                  if (!doneToday) logActivity("habit", `Checked in on ${habit.name}`);
                }}
                className={cn(
                  "ml-2 h-8 rounded-lg px-3 text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95",
                  doneToday
                    ? "bg-primary/10 text-primary"
                    : "bg-primary text-primary-foreground hover:brightness-110"
                )}
              >
                {doneToday ? "Done ✓" : "Check in"}
              </button>
            </div>
          </>
        )}
      </div>
      <Heatmap habit={habit} />
    </motion.div>
  );
}

export default function HabitsPage() {
  const { data: habits = [], isLoading } = useHabits();
  const addHabit = useAddHabit();
  const [draft, setDraft] = useState("");
  const [emoji, setEmoji] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl font-bold tracking-tight"
      >
        Habits
      </motion.h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Build streaks — last 13 weeks shown per habit.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = draft.trim();
          if (!name) return;
          addHabit.mutate({ name, emoji: emoji.trim() || undefined });
          setDraft("");
          setEmoji("");
        }}
        className="mb-4 mt-6 flex gap-2"
      >
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="🏃"
          maxLength={4}
          className={cn(inputCls, "w-14 text-center")}
          aria-label="Emoji"
        />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a habit…"
          className={inputCls}
        />
        <button
          type="submit"
          aria-label="Add habit"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && habits.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border bg-card py-12 text-center">
          <Repeat className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No habits yet — add one above.</p>
        </div>
      )}
    </div>
  );
}
