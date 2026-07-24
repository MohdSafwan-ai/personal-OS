import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toDayKey } from "@/lib/utils";

/* ---------------------------------- types --------------------------------- */

export interface ApiTask {
  id: string;
  title: string;
  done: boolean;
  day: string;
  createdAt: string;
}

export interface ApiHabit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  lastDoneDay: string | null;
  checkins: string[];
}

export interface FlowverseMilestone {
  level: number;
  bp: number;
  name: string;
  unlock: string;
}

export interface FlowverseProgress {
  buildPoints: number;
  todayBuildPoints: number;
  current: FlowverseMilestone;
  next: FlowverseMilestone | null;
  progress: number;
  remaining: number;
  milestones: FlowverseMilestone[];
}

/** A current streak must reach today or yesterday in the user's local clock. */
function currentStreak(checkins: string[]): number {
  if (checkins.length === 0) return 0;
  const days = [...new Set(checkins)].sort();
  const latest = days[days.length - 1];
  const today = toDayKey();
  const yesterday = daysAgoKey(1);
  if (latest !== today && latest !== yesterday) return 0;

  let streak = 1;
  for (let index = days.length - 1; index > 0; index--) {
    const current = new Date(`${days[index]}T12:00:00`);
    const previous = new Date(`${days[index - 1]}T12:00:00`);
    if (Math.round((current.getTime() - previous.getTime()) / 86_400_000) !== 1) break;
    streak++;
  }
  return streak;
}

/* ---------------------------------- tasks --------------------------------- */

export function useTasks(day = toDayKey()) {
  return useQuery({
    queryKey: ["tasks", day],
    queryFn: () => api<{ tasks: ApiTask[] }>(`/api/tasks?day=${day}`).then((r) => r.tasks),
  });
}

export function useAddTask(day = toDayKey()) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) =>
      api<{ task: ApiTask }>("/api/tasks", { method: "POST", body: { title, day } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useToggleTask(day = toDayKey()) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      api<{ task: ApiTask }>(`/api/tasks/${id}`, { method: "PATCH", body: { done } }),
    // Optimistic flip so the checkbox feels instant.
    onMutate: async ({ id, done }) => {
      await qc.cancelQueries({ queryKey: ["tasks", day] });
      const prev = qc.getQueryData<ApiTask[]>(["tasks", day]);
      qc.setQueryData<ApiTask[]>(["tasks", day], (old) =>
        old?.map((t) => (t.id === id ? { ...t, done } : t))
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["tasks", day], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useRenameTask(_day = toDayKey()) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      api<{ task: ApiTask }>(`/api/tasks/${id}`, { method: "PATCH", body: { title } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask(day = toDayKey()) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/tasks/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tasks", day] });
      const prev = qc.getQueryData<ApiTask[]>(["tasks", day]);
      qc.setQueryData<ApiTask[]>(["tasks", day], (old) => old?.filter((t) => t.id !== id));
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["tasks", day], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

/* --------------------------------- habits --------------------------------- */

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: () =>
      api<{ habits: ApiHabit[] }>("/api/habits").then((r) =>
        r.habits.map((habit) => ({
          ...habit,
          streak: currentStreak(habit.checkins),
        }))
      ),
  });
}

export function useCheckinHabit() {
  const qc = useQueryClient();
  const today = toDayKey();
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      api<{ habit: ApiHabit }>(`/api/habits/${id}/checkin`, {
        method: "POST",
        body: { day: today, done },
      }),
    onMutate: async ({ id, done }) => {
      await qc.cancelQueries({ queryKey: ["habits"] });
      const prev = qc.getQueryData<ApiHabit[]>(["habits"]);
      qc.setQueryData<ApiHabit[]>(["habits"], (old) =>
        old?.map((h) =>
          h.id === id
            ? {
                ...h,
                lastDoneDay: done ? today : null,
                streak: Math.max(0, h.streak + (done ? 1 : -1)),
              }
            : h
        )
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["habits"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useAddHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; emoji?: string }) =>
      api<{ habit: ApiHabit }>("/api/habits", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; name?: string; emoji?: string }) =>
      api<{ habit: ApiHabit }>(`/api/habits/${id}`, { method: "PATCH", body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/habits/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

/* ---------------------------------- focus ---------------------------------- */

function daysAgoKey(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDayKey(d);
}

export function useFocusWeek() {
  const from = daysAgoKey(6);
  const to = toDayKey();
  return useQuery({
    queryKey: ["focus", from, to],
    queryFn: () =>
      api<{ byDay: Record<string, number> }>(`/api/focus/summary?from=${from}&to=${to}`).then(
        (r) => r.byDay
      ),
  });
}

export function useLogFocus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (seconds: number) =>
      api("/api/focus", { method: "POST", body: { day: toDayKey(), seconds } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["focus"] }),
  });
}

export function useFlowverse() {
  const day = toDayKey();
  return useQuery({
    queryKey: ["focus", "flowverse", day],
    queryFn: () => api<FlowverseProgress>(`/api/focus/flowverse?day=${day}`),
  });
}

/* ---------------------------------- notes ---------------------------------- */

export function useNote() {
  return useQuery({
    queryKey: ["note"],
    queryFn: () => api<{ content: string }>("/api/notes").then((r) => r.content),
  });
}

export function useSaveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => api("/api/notes", { method: "PUT", body: { content } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["note"] }),
  });
}
