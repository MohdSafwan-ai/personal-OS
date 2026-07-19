import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { useLogFocus } from "@/lib/queries";
import { cn, formatClock } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useActivityStore } from "@/store/dashboard";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusTimerCard() {
  const logFocus = useLogFocus();
  const logActivity = useActivityStore((s) => s.logActivity);
  // Focus length comes from the user's Pomodoro settings.
  const focusMin = useAuthStore((s) => s.user?.settings.pomodoro.focusMin ?? 25);
  const focusSeconds = focusMin * 60;
  const [remaining, setRemaining] = useState(focusSeconds);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  // If the setting changes while idle, adopt the new duration.
  useEffect(() => {
    if (!running) setRemaining(focusSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSeconds]);

  const commit = (seconds: number) => {
    logFocus.mutate(seconds);
    logActivity("timer", `Finished a ${Math.round(seconds / 60)} min focus session`);
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          setRunning(false);
          commit(focusSeconds);
          return focusSeconds;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const progress = 1 - remaining / focusSeconds;

  const reset = () => {
    // Log partial sessions of 1min+ so effort isn't lost.
    const elapsed = focusSeconds - remainingRef.current;
    if (elapsed >= 60) commit(elapsed);
    setRunning(false);
    setRemaining(focusSeconds);
  };

  return (
    <DashCard title="Focus Timer" icon={<Timer className="h-4 w-4" />} contentClassName="grid place-items-center">
      <div className="relative my-1 h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={RADIUS} fill="none" strokeWidth="6" className="stroke-muted" />
          <motion.circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={running ? "run" : "idle"}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold tabular-nums tracking-tight"
          >
            {formatClock(remaining)}
          </motion.span>
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {running ? "Focusing" : "Ready"}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm",
            "transition-all duration-150 hover:scale-[1.03] active:scale-95",
            running
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          )}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          aria-label="Reset timer"
          className="grid h-9 w-9 place-items-center rounded-lg border text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </DashCard>
  );
}
