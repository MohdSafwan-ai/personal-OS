import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityItem {
  id: string;
  text: string;
  at: number;
  kind: "task" | "habit" | "timer" | "note";
}

interface ActivityState {
  activity: ActivityItem[];
  logActivity: (kind: ActivityItem["kind"], text: string) => void;
}

let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

/**
 * Lightweight client-side activity feed. Server data is the source of truth
 * for tasks/habits/focus/notes; this only records what *you did this device*
 * for the Recent Activity card.
 */
export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activity: [],
      logActivity: (kind, text) =>
        set((s) => ({
          activity: [{ id: uid(), text, at: Date.now(), kind }, ...s.activity].slice(0, 30),
        })),
    }),
    { name: "personal-os-activity" }
  )
);
