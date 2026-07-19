import { motion } from "framer-motion";
import { CalendarCard } from "@/components/cards/calendar-card";
import { FocusTimerCard } from "@/components/cards/focus-timer";
import { HabitsCard } from "@/components/cards/habits-card";
import { ProductivityScoreCard } from "@/components/cards/productivity-score";
import { QuickNotesCard } from "@/components/cards/quick-notes";
import { RecentActivityCard } from "@/components/cards/recent-activity";
import { TasksCard } from "@/components/cards/tasks-card";
import { TimeWorkedCard } from "@/components/cards/time-worked";
import { TodaysProgressCard } from "@/components/cards/todays-progress";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useHabits, useTasks } from "@/lib/queries";
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
  const user = useAuthStore((s) => s.user);
  const loading = tasksQuery.isLoading || habitsQuery.isLoading;
  const firstName = user?.name.split(/\s+/)[0] ?? "there";

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl font-bold tracking-tight"
        >
          {greeting()}, {firstName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          {today} — here's what your day looks like.
        </motion.p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <CardSkeleton key={i} tall={i % 3 === 2} />
          ))}
        </div>
      ) : (
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
        </motion.div>
      )}
    </div>
  );
}
