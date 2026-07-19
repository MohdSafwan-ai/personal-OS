import { motion } from "framer-motion";
import { Activity, CheckSquare, NotebookPen, Repeat, Timer } from "lucide-react";
import { DashCard } from "@/components/ui/dash-card";
import { useActivityStore, type ActivityItem } from "@/store/dashboard";

const KIND_ICON: Record<ActivityItem["kind"], typeof CheckSquare> = {
  task: CheckSquare,
  habit: Repeat,
  timer: Timer,
  note: NotebookPen,
};

function timeAgo(at: number): string {
  const s = Math.floor((Date.now() - at) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RecentActivityCard() {
  const activity = useActivityStore((s) => s.activity);

  return (
    <DashCard title="Recent Activity" icon={<Activity className="h-4 w-4" />}>
      {activity.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Your actions will show up here — complete a task or check in on a habit.
        </p>
      ) : (
        <ul className="relative space-y-0.5">
          <span className="absolute bottom-2 left-[13px] top-2 w-px bg-border" aria-hidden />
          {activity.slice(0, 8).map((item, i) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="relative flex items-center gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-accent"
              >
                <span className="z-10 grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border bg-card text-muted-foreground">
                  <Icon className="h-3 w-3" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{item.text}</span>
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {timeAgo(item.at)}
                </span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </DashCard>
  );
}
