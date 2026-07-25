import { motion } from "framer-motion";
import { Minus, Pause, Play, Plus, RotateCcw, Timer } from "lucide-react";
import { useEffect } from "react";
import { DashCard } from "@/components/ui/dash-card";
import { toast } from "@/components/ui/toast";
import { useLogFocus } from "@/lib/queries";
import { cn, formatClock, toDayKey } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useActivityStore } from "@/store/dashboard";
import { useFocusTimerStore } from "@/store/focus-timer";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusTimerCard() {
  const logFocus = useLogFocus();
  const logActivity = useActivityStore((s) => s.logActivity);
  // Focus length comes from the user's Pomodoro settings.
  const user = useAuthStore((s) => s.user);
  const focusMin = user?.settings.pomodoro.focusMin ?? 25;
  const timer = useFocusTimerStore();
  const {
    phase,
    focusMinutes,
    durationSeconds: focusSeconds,
    remainingSeconds: remaining,
    running,
    completionPending,
  } = timer;

  const commit = (seconds: number, celebrate = true) => {
    if (seconds < 60) return; // minimum 1 minute to earn BP
    logActivity("timer", `Finished a ${Math.round(seconds / 60)} min focus session`);
    logFocus.mutate(seconds, {
      onSuccess: () => {
        timer.markCommitted(seconds);
        toast(
          celebrate
            ? `Focus complete! +${Math.floor(seconds / 60)} BP — your FlowVerse grew.`
            : `Progress saved: +${Math.floor(seconds / 60)} BP added to FlowVerse.`,
          "success"
        );
      },
    });
  };

  /** Commit only the uncommitted elapsed portion (avoids double-counting). */
  const commitUncommitted = (celebrate = true) => {
    const state = useFocusTimerStore.getState();
    if (state.phase !== "focus") return;
    const elapsed = state.durationSeconds - state.remainingSeconds;
    const uncommitted = elapsed - state.committedSeconds;
    if (uncommitted >= 60) commit(uncommitted, celebrate);
  };

  useEffect(() => {
    if (!user) return;
    timer.initialize(user.id, focusMin, toDayKey());
    const interval = window.setInterval(() => useFocusTimerStore.getState().sync(), 250);
    return () => clearInterval(interval);
  }, [focusMin, timer.initialize, user?.id]);

  useEffect(() => {
    if (!completionPending) return;
    timer.consumeCompletion();
    if (phase === "focus") {
      // commit only the uncommitted portion of the completed session
      const state = useFocusTimerStore.getState();
      const uncommitted = focusSeconds - state.committedSeconds;
      if (uncommitted >= 60) commit(uncommitted);
    }
    timer.advance(
      "focus",
      focusMinutes * 60,
      timer.completedFocus + (phase === "focus" ? 1 : 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completionPending]);

  const progress = 1 - remaining / focusSeconds;

  const handleToggle = () => {
    // Pausing — commit whatever uncommitted time has elapsed
    if (running) commitUncommitted(false);
    timer.toggle();
  };

  const reset = () => {
    commitUncommitted(false);
    timer.selectPhase("focus", focusMinutes * 60);
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

      {!running && (
        <div className="mb-2 flex items-center gap-2">
          <button
            onClick={() => timer.setFocusMinutes(focusMinutes - 5)}
            disabled={focusMinutes <= 5}
            aria-label="Reduce focus time"
            className="grid h-7 w-7 place-items-center rounded-md border text-muted-foreground disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-14 text-center text-xs font-semibold tabular-nums">
            {focusMinutes} min
          </span>
          <button
            onClick={() => timer.setFocusMinutes(focusMinutes + 5)}
            disabled={focusMinutes >= 180}
            aria-label="Increase focus time"
            className="grid h-7 w-7 place-items-center rounded-md border text-muted-foreground disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handleToggle}
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
