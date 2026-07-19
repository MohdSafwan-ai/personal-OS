import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function monthMatrix(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  // Monday-first offset
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function CalendarCard() {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<number | null>(now.getDate());

  const cells = monthMatrix(view.year, view.month);
  const isCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth();
  const title = new Date(view.year, view.month).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta);
    setView({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(null);
  };

  return (
    <DashCard
      title="Calendar"
      icon={<Calendar className="h-4 w-4" />}
      action={
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    >
      <motion.div
        key={`${view.year}-${view.month}`}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="mb-2 text-sm font-semibold">{title}</p>
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="pb-1 text-[10px] font-medium uppercase text-muted-foreground">
              {d}
            </span>
          ))}
          {cells.map((day, i) => {
            const isToday = isCurrentMonth && day === now.getDate();
            return (
              <span key={i} className="grid place-items-center">
                {day && (
                  <button
                    onClick={() => setSelected(day)}
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-lg text-xs tabular-nums",
                      "transition-all duration-150 hover:bg-accent hover:scale-110",
                      isToday && "bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary",
                      !isToday && selected === day && "bg-accent font-medium ring-1 ring-border"
                    )}
                  >
                    {day}
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </motion.div>
    </DashCard>
  );
}
