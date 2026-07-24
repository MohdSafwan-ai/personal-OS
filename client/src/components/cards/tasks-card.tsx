import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { DashCard } from "@/components/ui/dash-card";
import {
  useAddTask,
  useDeleteTask,
  useRenameTask,
  useTasks,
  useToggleTask,
} from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/dashboard";

export function TasksCard() {
  const { data: tasks = [], isLoading } = useTasks();
  const addTask = useAddTask();
  const toggleTask = useToggleTask();
  const renameTask = useRenameTask();
  const deleteTask = useDeleteTask();
  const logActivity = useActivityStore((s) => s.logActivity);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <DashCard
      title="Today's Tasks"
      icon={<CheckSquare className="h-4 w-4" />}
      action={
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-primary">
          {remaining} left
        </span>
      }
      contentClassName="flex flex-col"
    >
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
        className="mb-3 flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task…"
          className={cn(
            "h-8 min-w-0 flex-1 rounded-lg border bg-muted/40 px-3 text-sm outline-none",
            "transition-all duration-200 placeholder:text-muted-foreground",
            "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
          )}
        />
        <button
          type="submit"
          aria-label="Add task"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <ul className="-mx-2 max-h-56 space-y-0.5 overflow-y-auto px-2">
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="group/task"
            >
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent">
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
                    "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border-2 transition-all duration-200",
                    task.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  <AnimatePresence>
                    {task.done && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 25 }}
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5 fill-none stroke-current stroke-[2.5]"
                      >
                        <path d="M2 6.5 4.5 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </button>
                {editingId === task.id ? (
                  <form
                    className="min-w-0 flex-1"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const title = editDraft.trim();
                      if (title && title !== task.title) {
                        renameTask.mutate({ id: task.id, title });
                      }
                      setEditingId(null);
                    }}
                  >
                    <input
                      value={editDraft}
                      onChange={(event) => setEditDraft(event.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      aria-label="Edit task title"
                      className="h-7 w-full rounded-md border bg-background px-2 text-sm outline-none focus:border-ring"
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
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditDraft(task.title);
                  }}
                  aria-label="Edit task"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground opacity-100 transition-all duration-150 hover:bg-accent hover:text-foreground sm:opacity-0 sm:group-hover/task:opacity-100"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  aria-label="Delete task"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground opacity-100 transition-all duration-150 hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover/task:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {!isLoading && tasks.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No tasks yet — add one above.
        </p>
      )}
    </DashCard>
  );
}
