import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import {
  useAddTask,
  useDeleteTask,
  useRenameTask,
  useTasks,
  useToggleTask,
} from "@/lib/queries";
import { cn, fromDayKey, toDayKey } from "@/lib/utils";
import { useActivityStore } from "@/store/dashboard";

const inputCls = cn(
  "h-9 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none",
  "transition-all duration-200 placeholder:text-muted-foreground",
  "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
);

function shiftDay(day: string, delta: number): string {
  const d = fromDayKey(day);
  d.setDate(d.getDate() + delta);
  return toDayKey(d);
}

export default function TasksPage() {
  const today = toDayKey();
  const [day, setDay] = useState(today);
  const { data: tasks = [], isLoading } = useTasks(day);
  const addTask = useAddTask(day);
  const toggleTask = useToggleTask(day);
  const renameTask = useRenameTask(day);
  const deleteTask = useDeleteTask(day);
  const logActivity = useActivityStore((s) => s.logActivity);

  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const dayLabel =
    day === today
      ? "Today"
      : day === shiftDay(today, -1)
        ? "Yesterday"
        : day === shiftDay(today, 1)
          ? "Tomorrow"
          : fromDayKey(day).toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold tracking-tight"
          >
            Tasks
          </motion.h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {done} of {tasks.length} done · {dayLabel}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDay((d) => shiftDay(d, -1))}
            aria-label="Previous day"
            className="grid h-8 w-8 place-items-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {day !== today && (
            <button
              onClick={() => setDay(today)}
              className="h-8 rounded-lg border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setDay((d) => shiftDay(d, 1))}
            aria-label="Next day"
            className="grid h-8 w-8 place-items-center rounded-lg border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = draft.trim();
          if (!title) return;
          addTask.mutate(title, {
            onSuccess: () => logActivity("task", `Added task "${title}"`),
          });
          setDraft("");
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Add a task for ${dayLabel.toLowerCase()}…`}
          className={inputCls}
        />
        <button
          type="submit"
          aria-label="Add task"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <motion.div
        key={day}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <ul className="divide-y">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="group/task overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50">
                  <button
                    onClick={() => {
                      toggleTask.mutate({ id: task.id, done: !task.done });
                      logActivity(
                        "task",
                        task.done ? `Reopened "${task.title}"` : `Completed "${task.title}"`
                      );
                    }}
                    aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all duration-200",
                      task.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 hover:border-primary"
                    )}
                  >
                    {task.done && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 600, damping: 25 }}
                        viewBox="0 0 12 12"
                        className="h-3 w-3 fill-none stroke-current stroke-[2.5]"
                      >
                        <path d="M2 6.5 4.5 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </button>

                  {editingId === task.id ? (
                    <form
                      className="flex-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const title = editDraft.trim();
                        if (title && title !== task.title) {
                          renameTask.mutate({ id: task.id, title });
                        }
                        setEditingId(null);
                      }}
                    >
                      <input
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className={cn(inputCls, "h-8")}
                      />
                    </form>
                  ) : (
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm transition-all duration-200",
                        task.done && "text-muted-foreground line-through"
                      )}
                    >
                      {task.title}
                    </span>
                  )}

                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/task:opacity-100">
                    <button
                      onClick={() => {
                        setEditingId(task.id);
                        setEditDraft(task.title);
                      }}
                      aria-label="Edit task"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask.mutate(task.id)}
                      aria-label="Delete task"
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {!isLoading && tasks.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <CheckSquare className="h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing for {dayLabel.toLowerCase()} — add a task above.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
