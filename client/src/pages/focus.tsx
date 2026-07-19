import { motion } from "framer-motion";
import { Coffee, Pause, Play, RotateCcw, SkipForward, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFocusWeek, useLogFocus } from "@/lib/queries";
import { cn, formatClock, formatDuration, toDayKey } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useActivityStore } from "@/store/dashboard";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Phase = "focus" | "shortBreak" | "longBreak";

const PHASE_LABEL: Record<Phase, string> = {
  focus: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

export default function FocusPage() {
  const pomodoro = useAuthStore(
    (s) =>
      s.user?.settings.pomodoro ?? {
        focusMin: 25,
        shortBreakMin: 5,
        longBreakMin: 15,
        longBreakEvery: 4,
      }
  );
  const logFocus = useLogFocus();
  const logActivity = useActivityStore((s) => s.logActivity);
  const { data: byDay = {} } = useFocusWeek();

  const [phase, setPhase] = useState<Phase>("focus");
  const [completedFocus, setCompletedFocus] = useState(0);
  const [running, setRunning] = useState(false);

  const phaseSeconds =
    phase === "focus"
      ? pomodoro.focusMin * 60
      : phase === "shortBreak"
        ? pomodoro.shortBreakMin * 60
        : pomodoro.longBreakMin * 60;

  const [remaining, setRemaining] = useState(phaseSeconds);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  // Adopt new durations when idle or when phase flips.
  useEffect(() => {
    if (!running) setRemaining(phaseSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseSeconds, phase]);

  const nextPhaseAfterFocus = (doneCount: number): Phase =>
    doneCount % pomodoro.longBreakEvery === 0 ? "longBreak" : "shortBreak";

  const advance = (skip = false) => {
    if (phase === "focus") {
      const elapsed = phaseSeconds - remainingRef.current;
      const logged = skip ? elapsed : phaseSeconds;
      if (logged >= 60) {
        logFocus.mutate(logged);
        logActivity("timer", `Finished a ${Math.round(logged / 60)} min focus session`);
      }
      const doneCount = completedFocus + (skip && logged < 60 ? 0 : 1);
      setCompletedFocus(doneCount);
      setPhase(nextPhaseAfterFocus(doneCount));
    } else {
      setPhase("focus");
    }
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          // Defer the phase change out of the state updater.
          setTimeout(() => advance(false), 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const progress = phaseSeconds === 0 ? 0 : 1 - remaining / phaseSeconds;
  const todaySeconds = byDay[toDayKey()] ?? 0;
  const weekSeconds = Object.values(byDay).reduce((a, b) => a + b, 0);
  const isBreak = phase !== "focus";

  return (
    <div className="mx-auto max-w-xl">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl font-bold tracking-tight"
      >
        Focus
      </motion.h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {pomodoro.focusMin} min focus · {pomodoro.shortBreakMin} min breaks · long break every{" "}
        {pomodoro.longBreakEvery} sessions
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex flex-col items-center rounded-xl border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        {/* Phase pills */}
        <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
          {(["focus", "shortBreak", "longBreak"] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPhase(p);
                setRunning(false);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
                phase === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {PHASE_LABEL[p]}
            </button>
          ))}
        </div>

        <div className="relative h-56 w-56">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            <circle cx="100" cy="100" r={RADIUS} fill="none" strokeWidth="8" className="stroke-muted" />
            <motion.circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={isBreak ? "stroke-chart-2" : "stroke-primary"}
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums tracking-tight">
              {formatClock(remaining)}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {isBreak && <Coffee className="h-3 w-3" />}
              {running ? (isBreak ? "On break" : "Focusing") : PHASE_LABEL[phase]}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className={cn(
              "flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold shadow-sm",
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
            onClick={() => {
              setRunning(false);
              setRemaining(phaseSeconds);
            }}
            aria-label="Reset timer"
            className="grid h-11 w-11 place-items-center rounded-lg border text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => advance(true)}
            aria-label="Skip to next phase"
            className="grid h-11 w-11 place-items-center rounded-lg border text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Session dots */}
        <div className="mt-6 flex items-center gap-1.5">
          {Array.from({ length: pomodoro.longBreakEvery }, (_, i) => (
            <motion.span
              key={i}
              animate={{
                scale: i === completedFocus % pomodoro.longBreakEvery && running && !isBreak ? [1, 1.3, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-300",
                i < (completedFocus % pomodoro.longBreakEvery || (completedFocus > 0 && completedFocus % pomodoro.longBreakEvery === 0 ? pomodoro.longBreakEvery : 0))
                  ? "bg-primary"
                  : "bg-muted"
              )}
            />
          ))}
          <span className="ml-2 text-xs tabular-nums text-muted-foreground">
            {completedFocus} session{completedFocus === 1 ? "" : "s"} today
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {[
          { label: "Focused today", value: todaySeconds, icon: Timer },
          { label: "This week", value: weekSeconds, icon: Timer },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Icon className="h-3.5 w-3.5" /> {label}
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
              {formatDuration(value)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
