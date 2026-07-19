import { AnimatePresence, motion } from "framer-motion";
import { Flame, Plus, Repeat } from "lucide-react";
import { useState } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { useAddHabit, useCheckinHabit, useHabits } from "@/lib/queries";
import { cn, toDayKey } from "@/lib/utils";
import { useActivityStore } from "@/store/dashboard";

export function HabitsCard() {
  const { data: habits = [], isLoading } = useHabits();
  const checkin = useCheckinHabit();
  const addHabit = useAddHabit();
  const logActivity = useActivityStore((s) => s.logActivity);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const today = toDayKey();

  return (
    <DashCard
      title="Habits"
      icon={<Repeat className="h-4 w-4" />}
      action={
        <button
          onClick={() => setAdding((v) => !v)}
          aria-label="Add habit"
          className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className={cn("h-3.5 w-3.5 transition-transform duration-200", adding && "rotate-45")} />
        </button>
      }
    >
      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault();
              const name = draft.trim();
              if (!name) return;
              addHabit.mutate({ name });
              setDraft("");
              setAdding(false);
            }}
            className="overflow-hidden"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="New habit name…"
              autoFocus
              className={cn(
                "mb-2 h-8 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none",
                "transition-all duration-200 placeholder:text-muted-foreground",
                "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
              )}
            />
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {habits.map((habit, i) => {
          const doneToday = habit.lastDoneDay === today;
          return (
            <motion.button
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              onClick={() => {
                checkin.mutate({ id: habit.id, done: !doneToday });
                if (!doneToday) logActivity("habit", `Checked in on ${habit.name}`);
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left",
                "transition-all duration-200",
                doneToday
                  ? "border-primary/40 bg-primary/[0.07]"
                  : "border-transparent bg-muted/50 hover:bg-accent"
              )}
            >
              <span className="text-lg leading-none">{habit.emoji}</span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-sm font-medium transition-colors",
                    doneToday && "text-primary"
                  )}
                >
                  {habit.name}
                </span>
              </span>
              <span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                <Flame
                  className={cn(
                    "h-3.5 w-3.5 transition-colors duration-200",
                    habit.streak >= 7 ? "text-chart-3" : "text-muted-foreground/50"
                  )}
                />
                {habit.streak}
              </span>
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full border-2 transition-all duration-200",
                  doneToday
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {doneToday && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    viewBox="0 0 12 12"
                    className="h-3 w-3 fill-none stroke-current stroke-[2.5]"
                  >
                    <path d="M2 6.5 4.5 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
      {!isLoading && habits.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No habits yet — add one with the + button.
        </p>
      )}
    </DashCard>
  );
}
