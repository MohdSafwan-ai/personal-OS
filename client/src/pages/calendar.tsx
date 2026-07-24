import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiTask } from "@/lib/queries";
import { cn, fromDayKey, toDayKey } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toDayKey(new Date(year, month, d)));
  return cells;
}

/** Fetch only the visible month instead of the user's entire task history. */
function useMonthTasks(year: number, month: number) {
  const from = toDayKey(new Date(year, month, 1));
  const to = toDayKey(new Date(year, month + 1, 0));
  return useQuery({
    queryKey: ["tasks", "month", from, to],
    queryFn: () =>
      api<{ tasks: ApiTask[] }>(`/api/tasks?from=${from}&to=${to}`).then((r) => r.tasks),
  });
}

export default function CalendarPage() {
  const now = new Date();
  const today = toDayKey();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<string>(today);
  const { data: tasks = [] } = useMonthTasks(view.year, view.month);

  const byDay = useMemo(() => {
    const map = new Map<string, ApiTask[]>();
    for (const t of tasks) {
      const list = map.get(t.day) ?? [];
      list.push(t);
      map.set(t.day, list);
    }
    return map;
  }, [tasks]);

  const cells = monthCells(view.year, view.month);
  const title = new Date(view.year, view.month).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const selectedTasks = byDay.get(selected) ?? [];
  const selectedLabel = fromDayKey(selected).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold tracking-tight"
          >
            Calendar
          </motion.h1>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
        </div>
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setView({ year: now.getFullYear(), month: now.getMonth() });
              setSelected(today);
            }}
            className="h-8 rounded-lg border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Today
          </button>
          <button
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Month grid */}
        <motion.div
          key={`${view.year}-${view.month}`}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto rounded-[18px] border bg-card p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-4"
        >
          <div className="grid min-w-[280px] grid-cols-7 gap-0.5 sm:gap-1">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="pb-2 text-center text-[11px] font-medium uppercase text-muted-foreground"
              >
                {d}
              </span>
            ))}
            {cells.map((day, i) => {
              if (!day) return <span key={`empty-${i}`} />;
              const dayTasks = byDay.get(day) ?? [];
              const doneCount = dayTasks.filter((t) => t.done).length;
              const isToday = day === today;
              const isSelected = day === selected;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(day)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm tabular-nums",
                    "transition-all duration-150 hover:bg-accent",
                    isSelected && "bg-accent ring-1 ring-primary/40",
                    isToday && "font-bold text-primary"
                  )}
                >
                  {Number(day.slice(-2))}
                  {dayTasks.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t, j) => (
                        <span
                          key={j}
                          className={cn(
                            "h-1 w-1 rounded-full",
                            t.done ? "bg-primary" : "bg-muted-foreground/40"
                          )}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="text-[8px] leading-none text-muted-foreground">+</span>
                      )}
                    </span>
                  )}
                  {dayTasks.length === 0 && <span className="h-1" />}
                  <span className="sr-only">
                    {dayTasks.length} tasks, {doneCount} done
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected-day panel */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-sm font-semibold">{selectedLabel}</h2>
          {selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CalendarDays className="h-7 w-7 text-muted-foreground/40" />
              <p className="mt-2 text-xs text-muted-foreground">No tasks on this day.</p>
            </div>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {selectedTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      t.done ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                  />
                  <span className={cn("truncate", t.done && "text-muted-foreground line-through")}>
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
