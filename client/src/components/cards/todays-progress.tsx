import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { CountUp } from "@/components/ui/count-up";
import { DashCard } from "@/components/ui/dash-card";
import { useHabits, useTasks } from "@/lib/queries";
import { toDayKey } from "@/lib/utils";

export function TodaysProgressCard() {
  const { data: tasks = [] } = useTasks();
  const { data: habits = [] } = useHabits();
  const today = toDayKey();

  const doneTasks = tasks.filter((t) => t.done).length;
  const doneHabits = habits.filter((h) => h.lastDoneDay === today).length;
  const total = tasks.length + habits.length;
  const done = doneTasks + doneHabits;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <DashCard title="Today's Progress" icon={<TrendingUp className="h-4 w-4" />}>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold tabular-nums tracking-tight">
            <CountUp value={pct} format={(v) => `${Math.round(v)}%`} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {done} of {total} items completed
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>
            Tasks{" "}
            <span className="font-semibold text-foreground">
              {doneTasks}/{tasks.length}
            </span>
          </p>
          <p className="mt-0.5">
            Habits{" "}
            <span className="font-semibold text-foreground">
              {doneHabits}/{habits.length}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-chart-4"
        />
      </div>
    </DashCard>
  );
}
