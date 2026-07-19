import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { DashCard } from "@/components/ui/dash-card";
import { useFocusWeek, useHabits, useTasks } from "@/lib/queries";
import { toDayKey } from "@/lib/utils";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Score blends task completion (50%), habit check-ins (30%) and focus time
 * vs a 4h/day target (20%).
 */
export function ProductivityScoreCard() {
  const { data: tasks = [] } = useTasks();
  const { data: habits = [] } = useHabits();
  const { data: focusByDay = {} } = useFocusWeek();
  const today = toDayKey();

  const taskPart = tasks.length ? tasks.filter((t) => t.done).length / tasks.length : 0;
  const habitPart = habits.length
    ? habits.filter((h) => h.lastDoneDay === today).length / habits.length
    : 0;
  const focusPart = Math.min(1, (focusByDay[today] ?? 0) / (4 * 3600));
  const score = Math.round((taskPart * 0.5 + habitPart * 0.3 + focusPart * 0.2) * 100);

  const label = score >= 80 ? "Excellent" : score >= 55 ? "On track" : score >= 30 ? "Warming up" : "Just starting";

  return (
    <DashCard title="Productivity Score" icon={<Gauge className="h-4 w-4" />}>
      <div className="flex items-center justify-between gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              className="stroke-muted"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - score / 100) }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-2xl font-bold tabular-nums">
              <CountUp value={score} duration={1.4} />
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-semibold">{label}</p>
          {[
            { name: "Tasks", v: taskPart },
            { name: "Habits", v: habitPart },
            { name: "Focus", v: focusPart },
          ].map((row, i) => (
            <div key={row.name}>
              <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                <span>{row.name}</span>
                <span className="tabular-nums">{Math.round(row.v * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.v * 100}%` }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-primary/80"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashCard>
  );
}
