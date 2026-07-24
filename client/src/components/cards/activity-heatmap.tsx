import { Activity } from "lucide-react";
import { useMemo } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { useHabits } from "@/lib/queries";
import { cn, toDayKey } from "@/lib/utils";

const WEEKS = 12;
const LEVEL_CLASS = [
  "bg-muted",
  "bg-primary/20 dark:bg-primary/15",
  "bg-primary/40 dark:bg-primary/35",
  "bg-primary/65 dark:bg-primary/60",
  "bg-primary dark:shadow-[0_0_8px_hsl(var(--primary)/0.25)]",
];

function heatmapDays(): string[][] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const start = new Date(today);
  const mondayOffset = (today.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset - (WEEKS - 1) * 7);

  const weeks: string[][] = [];
  for (let week = 0; week < WEEKS; week++) {
    const days: string[] = [];
    for (let day = 0; day < 7; day++) {
      const current = new Date(start);
      current.setDate(start.getDate() + week * 7 + day);
      days.push(toDayKey(current));
    }
    weeks.push(days);
  }
  return weeks;
}

export function ActivityHeatmap() {
  const { data: habits = [] } = useHabits();
  const weeks = useMemo(heatmapDays, []);
  const activity = useMemo(() => {
    const counts = new Map<string, number>();
    for (const habit of habits) {
      for (const day of habit.checkins) {
        counts.set(day, (counts.get(day) ?? 0) + 1);
      }
    }
    return counts;
  }, [habits]);

  const max = Math.max(1, ...activity.values());
  const total = [...activity.values()].reduce((sum, count) => sum + count, 0);

  return (
    <DashCard
      title="Activity Heatmap"
      icon={<Activity className="h-4 w-4" />}
      action={
        <span className="text-[11px] font-medium text-muted-foreground">
          {total} check-in{total === 1 ? "" : "s"} · 12 weeks
        </span>
      }
      className="overflow-hidden"
    >
      <div className="touch-scroll overflow-x-auto pb-1">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[28px_repeat(12,minmax(0,1fr))] gap-1.5">
            <div />
            {weeks.map((week, index) => (
              <span
                key={week[0]}
                className="truncate text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70"
              >
                {index % 2 === 0
                  ? new Date(`${week[0]}T12:00:00`).toLocaleDateString(undefined, {
                      month: "short",
                    })
                  : ""}
              </span>
            ))}

            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div key={dayIndex} className="contents">
                <span className="flex items-center text-[9px] text-muted-foreground/70">
                  {["M", "T", "W", "T", "F", "S", "S"][dayIndex]}
                </span>
                {weeks.map((week) => {
                  const day = week[dayIndex];
                  const count = activity.get(day) ?? 0;
                  const level = count === 0 ? 0 : Math.max(1, Math.ceil((count / max) * 4));
                  const label = new Date(`${day}T12:00:00`).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <span
                      key={day}
                      title={`${label}: ${count} habit check-in${count === 1 ? "" : "s"}`}
                      aria-label={`${label}: ${count} habit check-in${count === 1 ? "" : "s"}`}
                      className={cn(
                        "aspect-square min-h-3 rounded-[4px] border border-transparent transition-all duration-150 hover:scale-110 hover:border-primary/50",
                        LEVEL_CLASS[level]
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            {LEVEL_CLASS.map((level, index) => (
              <span key={index} className={cn("h-2.5 w-2.5 rounded-[3px]", level)} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </DashCard>
  );
}
