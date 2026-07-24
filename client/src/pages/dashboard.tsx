import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CalendarCard } from "@/components/cards/calendar-card";
import { ActivityHeatmap } from "@/components/cards/activity-heatmap";
import { FocusTimerCard } from "@/components/cards/focus-timer";
import { FlowverseCard } from "@/components/cards/flowverse-card";
import { HabitsCard } from "@/components/cards/habits-card";
import { ProductivityScoreCard } from "@/components/cards/productivity-score";
import { QuickNotesCard } from "@/components/cards/quick-notes";
import { RecentActivityCard } from "@/components/cards/recent-activity";
import { TasksCard } from "@/components/cards/tasks-card";
import { TimeWorkedCard } from "@/components/cards/time-worked";
import { TodaysProgressCard } from "@/components/cards/todays-progress";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useFocusWeek, useHabits, useTasks } from "@/lib/queries";
import { formatDuration, toDayKey } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  // Real loading state: skeletons until the first tasks+habits fetch lands.
  const tasksQuery = useTasks();
  const habitsQuery = useHabits();
  const focusQuery = useFocusWeek();
  const user = useAuthStore((s) => s.user);
  const loading = tasksQuery.isLoading || habitsQuery.isLoading;
  const firstName = user?.name.split(/\s+/)[0] ?? "there";
  const tasks = tasksQuery.data ?? [];
  const habits = habitsQuery.data ?? [];
  const doneTasks = tasks.filter((task) => task.done).length;
  const doneHabits = habits.filter((habit) => habit.lastDoneDay === toDayKey()).length;
  const focusToday = focusQuery.data?.[toDayKey()] ?? 0;
  const bestStreak = Math.max(0, ...habits.map((habit) => habit.streak));

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.5rem,4vw,1.75rem)] font-extrabold tracking-[-0.02em]"
        >
          {greeting()}, {firstName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          {today} — small progress still counts.
        </motion.p>
        <div className="flex max-w-full items-center gap-2 self-start rounded-[14px] border border-violet-300 bg-gradient-to-br from-primary/10 to-violet-100 px-3 py-2 dark:border-primary/25 dark:from-primary/10 dark:to-transparent sm:max-w-sm sm:px-4">
          <Sparkles className="h-4 w-4 shrink-0 text-violet-600 dark:text-primary" />
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-violet-600 dark:text-primary">Today’s insight</p>
            <p className="truncate text-xs font-semibold text-violet-900 dark:text-foreground sm:text-sm">
              {doneTasks === tasks.length && tasks.length > 0
                ? "Everything on today’s list is complete"
                : `${Math.max(0, tasks.length - doneTasks)} tasks left—keep the momentum going`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <CardSkeleton key={i} tall={i % 3 === 2} />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
          >
            {[
              {
                label: "Tasks done",
                value: `${doneTasks}/${tasks.length}`,
                sub: "today",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Habits",
                value: habits.length ? `${Math.round((doneHabits / habits.length) * 100)}%` : "0%",
                sub: `${doneHabits} of ${habits.length} done`,
                color: "text-emerald-600",
                bg: "bg-emerald-100 dark:bg-emerald-950/40",
              },
              {
                label: "Focus time",
                value: formatDuration(focusToday),
                sub: "logged today",
                color: "text-amber-600",
                bg: "bg-amber-100 dark:bg-amber-950/40",
              },
              {
                label: "Best streak",
                value: `${bestStreak} day${bestStreak === 1 ? "" : "s"}`,
                sub: "keep it alive",
                color: "text-red-500",
                bg: "bg-red-100 dark:bg-red-950/40",
              },
            ].map((stat) => (
              <motion.div
                variants={item}
                key={stat.label}
                className="min-w-0 rounded-[18px] border bg-card p-3.5 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:p-5"
              >
                <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">{stat.label}</p>
                <p className="mt-1 truncate text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">{stat.value}</p>
                <span className={`mt-2 inline-block max-w-full truncate rounded-md px-2 py-0.5 text-[10px] font-medium sm:text-xs ${stat.color} ${stat.bg}`}>
                  {stat.sub}
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="mb-4"
          >
            <ActivityHeatmap />
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
          <motion.div variants={item}>
            <TodaysProgressCard />
          </motion.div>
          <motion.div variants={item}>
            <ProductivityScoreCard />
          </motion.div>
          <motion.div variants={item} className="xl:row-span-2">
            <TasksCard />
          </motion.div>
          <motion.div variants={item}>
            <TimeWorkedCard />
          </motion.div>
          <motion.div variants={item}>
            <FocusTimerCard />
          </motion.div>
          <motion.div variants={item}>
            <HabitsCard />
          </motion.div>
          <motion.div variants={item}>
            <CalendarCard />
          </motion.div>
          <motion.div variants={item}>
            <QuickNotesCard />
          </motion.div>
          <motion.div variants={item}>
            <RecentActivityCard />
          </motion.div>
          <motion.div variants={item}>
            <FlowverseCard />
          </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
