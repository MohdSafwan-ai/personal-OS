import { AnimatePresence, motion } from "framer-motion";
import {
  Castle,
  Globe2,
  LockKeyhole,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useFlowverse } from "@/lib/queries";
import { cn } from "@/lib/utils";

const MILESTONE_KEY = "flowverse-last-milestone-bp";

function MilestoneModal({ name, unlock, onClose }: { name: string; unlock: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 max-w-sm rounded-[24px] border border-primary/30 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.18),transparent_60%),hsl(220_38%_6%)] p-8 text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 1, 0.5],
              x: Math.cos((i / 12) * Math.PI * 2) * 80,
              y: Math.sin((i / 12) * Math.PI * 2) * 80,
            }}
            transition={{ duration: 1.2, delay: i * 0.04, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          />
        ))}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary/20"
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
        >
          New milestone unlocked
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-2 text-2xl font-extrabold tracking-tight text-white"
        >
          {name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="mt-1 text-sm text-white/55"
        >
          {unlock}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          className="mt-6 rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
        >
          Keep growing
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function FlowversePage() {
  const { data, isLoading } = useFlowverse();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [celebration, setCelebration] = useState<{ name: string; unlock: string } | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Detect new milestone unlock
  useEffect(() => {
    if (!data?.current) return;
    const stored = localStorage.getItem(MILESTONE_KEY);
    const lastBp = stored ? Number(stored) : null;
    if (lastBp !== null && data.current.bp > lastBp) {
      setCelebration({ name: data.current.name, unlock: data.current.unlock });
    }
    localStorage.setItem(MILESTONE_KEY, String(data.current.bp));
  }, [data?.current]);

  const currentIndex = data
    ? data.milestones.findIndex((milestone) => milestone.bp === data.current.bp)
    : 0;
  const reveal = Math.min(100, 28 + currentIndex * 9 + (data?.progress ?? 0) * 0.09);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, px: position.x, py: position.y };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPosition({
      x: drag.current.px + event.clientX - drag.current.x,
      y: drag.current.py + event.clientY - drag.current.y,
    });
  };

  return (
    <div className="mx-auto max-w-[1380px]">
      <AnimatePresence>
        {celebration && (
          <MilestoneModal
            name={celebration.name}
            unlock={celebration.unlock}
            onClose={() => setCelebration(null)}
          />
        )}
      </AnimatePresence>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Globe2 className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Your living world</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">FlowVerse</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Every focused minute leaves a visible mark. Keep showing up and your world will keep growing.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-xl border bg-card px-4 py-2.5 sm:self-auto">
          <Sparkles className="h-4 w-4 text-primary" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Build points</p>
            <p className="text-lg font-extrabold tabular-nums">{data?.buildPoints ?? 0} BP</p>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[24px] border bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.1),transparent_42%),linear-gradient(180deg,hsl(220_45%_9%),hsl(220_38%_4%))] shadow-2xl">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
          className="relative h-[52vh] min-h-[390px] max-h-[680px] cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          aria-label="Interactive FlowVerse world. Drag to pan."
        >
          <motion.div
            animate={{ x: position.x, y: position.y, scale }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="absolute inset-[-8%] grid place-items-center"
          >
            <img
              src="/flowverse-world.webp"
              alt=""
              className="absolute h-[92%] w-[92%] select-none object-contain opacity-25 grayscale"
              draggable={false}
            />
            <div
              className="absolute inset-0 grid place-items-center overflow-hidden transition-[clip-path] duration-1000"
              style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
            >
              <img
                src="/flowverse-world.webp"
                alt={`FlowVerse at the ${data?.current.name ?? "Untouched Island"} stage`}
                className="h-[92%] w-[92%] select-none object-contain drop-shadow-[0_26px_40px_rgba(0,0,0,0.48)]"
                draggable={false}
              />
            </div>
          </motion.div>

          <div className="absolute bottom-3 right-3 flex gap-1 rounded-xl border border-white/10 bg-black/45 p-1.5 backdrop-blur">
            <button
              onClick={() => setScale((value) => Math.max(0.8, value - 0.15))}
              aria-label="Zoom out"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              aria-label="Reset world view"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setScale((value) => Math.min(1.8, value + 0.15))}
              aria-label="Zoom in"
              className="grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute left-3 top-3 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-white backdrop-blur sm:left-5 sm:top-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">Current stage</p>
            <p className="mt-0.5 text-sm font-bold">{data?.current.name ?? "Untouched Island"}</p>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/35 p-4 text-white backdrop-blur sm:p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-white/55">Next transformation</p>
              <p className="mt-1 font-bold">{data?.next?.unlock ?? "Your kingdom is complete"}</p>
            </div>
            <p className="text-right text-xs text-white/55">
              {data?.next ? `${data.remaining} BP remaining` : "All milestones unlocked"}
            </p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data?.progress ?? 0}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary"
            />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[20px] border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold">World evolution</h2>
            <p className="text-xs text-muted-foreground">Focus unlocks every transformation automatically.</p>
          </div>
          <Castle className="h-5 w-5 text-primary" />
        </div>
        <div className="touch-scroll flex gap-2 overflow-x-auto pb-2">
          {(data?.milestones ?? []).map((milestone) => {
            const unlocked = (data?.buildPoints ?? 0) >= milestone.bp;
            const current = milestone.bp === data?.current.bp;
            return (
              <div
                key={milestone.bp}
                className={cn(
                  "min-w-[150px] flex-1 rounded-xl border p-3 transition-colors",
                  current
                    ? "border-primary/40 bg-primary/10"
                    : unlocked
                      ? "bg-muted/30"
                      : "opacity-55"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Level {milestone.level}
                  </span>
                  {unlocked ? (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  ) : (
                    <LockKeyhole className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-2 text-sm font-bold">{milestone.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{milestone.unlock}</p>
                <p className="mt-3 text-[10px] font-semibold tabular-nums">{milestone.bp} BP</p>
              </div>
            );
          })}
        </div>
        {isLoading && <p className="py-5 text-center text-sm text-muted-foreground">Growing your world…</p>}
      </section>
    </div>
  );
}
