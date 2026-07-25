import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerPhase = "focus" | "shortBreak" | "longBreak";

interface FocusTimerState {
  ownerId: string | null;
  phase: TimerPhase;
  focusMinutes: number;
  durationSeconds: number;
  remainingSeconds: number;
  running: boolean;
  endsAt: number | null;
  completedFocus: number;
  sessionDay: string;
  completionPending: boolean;
  committedSeconds: number;
  initialize: (ownerId: string, defaultFocusMinutes: number, today: string) => void;
  setFocusMinutes: (minutes: number) => void;
  selectPhase: (phase: TimerPhase, seconds: number) => void;
  toggle: () => void;
  pause: () => void;
  reset: () => void;
  sync: () => void;
  consumeCompletion: () => void;
  advance: (phase: TimerPhase, seconds: number, completedFocus: number) => void;
  markCommitted: (seconds: number) => void;
}

function secondsLeft(endsAt: number | null, fallback: number): number {
  if (!endsAt) return fallback;
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

export const useFocusTimerStore = create<FocusTimerState>()(
  persist(
    (set, get) => ({
      ownerId: null,
      phase: "focus",
      focusMinutes: 25,
      durationSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      running: false,
      endsAt: null,
      completedFocus: 0,
      sessionDay: "",
      completionPending: false,
      committedSeconds: 0,

      initialize: (ownerId, defaultFocusMinutes, today) => {
        const state = get();
        if (state.ownerId !== ownerId) {
          set({
            ownerId,
            phase: "focus",
            focusMinutes: defaultFocusMinutes,
            durationSeconds: defaultFocusMinutes * 60,
            remainingSeconds: defaultFocusMinutes * 60,
            running: false,
            endsAt: null,
            completedFocus: 0,
            sessionDay: today,
            completionPending: false,
            committedSeconds: 0,
          });
          return;
        }
        if (state.sessionDay !== today) {
          set({ completedFocus: 0, sessionDay: today });
        }
        get().sync();
      },

      setFocusMinutes: (minutes) => {
        const bounded = Math.max(1, Math.min(180, Math.round(minutes)));
        const state = get();
        if (state.running || state.phase !== "focus") return;
        set({
          focusMinutes: bounded,
          durationSeconds: bounded * 60,
          remainingSeconds: bounded * 60,
          endsAt: null,
          completionPending: false,
          committedSeconds: 0,
        });
      },

      selectPhase: (phase, seconds) =>
        set({
          phase,
          durationSeconds: seconds,
          remainingSeconds: seconds,
          running: false,
          endsAt: null,
          completionPending: false,
          committedSeconds: 0,
        }),

      toggle: () => {
        const state = get();
        if (state.running) {
          const remaining = secondsLeft(state.endsAt, state.remainingSeconds);
          set({ running: false, endsAt: null, remainingSeconds: remaining });
        } else {
          const remaining =
            state.remainingSeconds > 0 ? state.remainingSeconds : state.durationSeconds;
          set({
            running: true,
            remainingSeconds: remaining,
            endsAt: Date.now() + remaining * 1000,
            completionPending: false,
          });
        }
      },

      pause: () => {
        const state = get();
        set({
          running: false,
          endsAt: null,
          remainingSeconds: secondsLeft(state.endsAt, state.remainingSeconds),
        });
      },

      reset: () =>
        set((state) => ({
          running: false,
          endsAt: null,
          remainingSeconds: state.durationSeconds,
          completionPending: false,
          committedSeconds: 0,
        })),

      markCommitted: (seconds) =>
        set((state) => ({ committedSeconds: state.committedSeconds + seconds })),

      sync: () => {
        const state = get();
        if (!state.running) return;
        const remaining = secondsLeft(state.endsAt, state.remainingSeconds);
        if (remaining === 0) {
          set({
            remainingSeconds: 0,
            running: false,
            endsAt: null,
            completionPending: true,
          });
        } else if (remaining !== state.remainingSeconds) {
          set({ remainingSeconds: remaining });
        }
      },

      consumeCompletion: () => set({ completionPending: false }),

      advance: (phase, seconds, completedFocus) =>
        set({
          phase,
          durationSeconds: seconds,
          remainingSeconds: seconds,
          running: false,
          endsAt: null,
          completedFocus,
          completionPending: false,
          committedSeconds: 0,
        }),
    }),
    { name: "personal-os-focus-timer" }
  )
);
