import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Flag,
  Calendar,
  Circle,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due: string;
  category: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Design new onboarding flow", description: "Create wireframes and mockups for the new user onboarding experience.", priority: "high", status: "in-progress", due: "Jul 26", category: "Design" },
  { id: 2, title: "Implement dark mode", description: "Add system-aware dark mode across all pages and components.", priority: "medium", status: "todo", due: "Jul 28", category: "Engineering" },
  { id: 3, title: "Q3 analytics report", description: "Compile and analyze Q3 metrics for stakeholder presentation.", priority: "high", status: "done", due: "Jul 24", category: "Strategy" },
  { id: 4, title: "Fix mobile navigation bug", description: "Sidebar collapses incorrectly on iOS Safari 16.", priority: "medium", status: "in-progress", due: "Jul 25", category: "Engineering" },
  { id: 5, title: "Write team weekly update", description: "Summarize progress, blockers, and next week's goals.", priority: "low", status: "done", due: "Jul 24", category: "Ops" },
  { id: 6, title: "Conduct user interviews", description: "Schedule and run 5 user interviews for the new feature.", priority: "high", status: "todo", due: "Jul 30", category: "Research" },
  { id: 7, title: "Update API documentation", description: "Reflect the latest endpoint changes in our public API docs.", priority: "low", status: "todo", due: "Jul 31", category: "Engineering" },
  { id: 8, title: "Pricing page refresh", description: "Update pricing tiers to match new packaging.", priority: "medium", status: "todo", due: "Aug 3", category: "Design" },
];

const priorityColor: Record<Priority, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
};

const statusLabel: Record<Status, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

const statusBg: Record<Status, string> = {
  "todo": "#F4F4F5",
  "in-progress": "#EEEEFF",
  "done": "#DCFCE7",
};

const statusColor: Record<Status, string> = {
  "todo": "#71717A",
  "in-progress": "#5B5CEB",
  "done": "#15803D",
};

const COLUMNS: Status[] = ["todo", "in-progress", "done"];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTo, setAddingTo] = useState<Status | null>(null);

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterPriority === "all" || t.priority === filterPriority)
  );

  const addTask = (status: Status) => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTaskTitle.trim(),
        description: "",
        priority: "medium",
        status,
        due: "No due date",
        category: "General",
      },
    ]);
    setNewTaskTitle("");
    setAddingTo(null);
  };

  const toggleDone = (id: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      )
    );

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>Tasks</h1>
          <p style={{ fontSize: 14, color: "#71717A", marginTop: 4 }}>
            {done} of {tasks.length} tasks completed
          </p>
        </div>
        <button
          onClick={() => setAddingTo("todo")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            borderRadius: 12,
            border: "none",
            background: "#5B5CEB",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(91,92,235,0.3)",
          }}
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {(["todo", "in-progress", "done"] as Status[]).map((s) => {
          const count = tasks.filter((t) => t.status === s).length;
          return (
            <div
              key={s}
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 12, color: "#71717A", fontWeight: 500 }}>{statusLabel[s]}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#18181B", marginTop: 4 }}>{count}</div>
              <div
                style={{
                  height: 3,
                  marginTop: 8,
                  borderRadius: 2,
                  background: statusColor[s],
                  opacity: 0.4,
                  width: `${(count / tasks.length) * 100}%`,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          );
        })}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            padding: "16px 20px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: 12, color: "#71717A", fontWeight: 500 }}>Overdue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#EF4444", marginTop: 4 }}>2</div>
          <div style={{ height: 3, marginTop: 8, borderRadius: 2, background: "#EF4444", opacity: 0.4, width: "25%" }} />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#A1A1AA" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={{
              width: "100%",
              height: 38,
              paddingLeft: 36,
              paddingRight: 12,
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              fontSize: 13,
              color: "#18181B",
              outline: "none",
            }}
          />
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
          style={{
            height: 38,
            padding: "0 12px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            fontSize: 13,
            color: "#18181B",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div style={{ marginLeft: "auto", display: "flex", background: "#F4F4F5", borderRadius: 10, padding: 3 }}>
          {(["kanban", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                width: 36,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: view === v ? "#FFFFFF" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {v === "kanban" ? <LayoutGrid size={15} color={view === v ? "#5B5CEB" : "#71717A"} /> : <List size={15} color={view === v ? "#5B5CEB" : "#71717A"} />}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      {view === "kanban" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "start" }}>
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col);
            return (
              <div
                key={col}
                style={{
                  background: "#F4F4F5",
                  borderRadius: 16,
                  padding: "16px",
                  minHeight: 200,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: statusColor[col],
                        background: statusBg[col],
                        padding: "3px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {statusLabel[col]}
                    </span>
                    <span style={{ fontSize: 12, color: "#A1A1AA" }}>{colTasks.length}</span>
                  </div>
                  <button
                    onClick={() => setAddingTo(col)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      border: "none",
                      background: "#E5E7EB",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={14} color="#71717A" />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onToggle={toggleDone} onDelete={deleteTask} />
                  ))}

                  {addingTo === col && (
                    <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "12px", border: "2px solid #5B5CEB" }}>
                      <input
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addTask(col);
                          if (e.key === "Escape") { setAddingTo(null); setNewTaskTitle(""); }
                        }}
                        placeholder="Task title…"
                        style={{
                          width: "100%",
                          border: "none",
                          outline: "none",
                          fontSize: 13,
                          color: "#18181B",
                          background: "transparent",
                        }}
                      />
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button
                          onClick={() => addTask(col)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: "#5B5CEB",
                            color: "#FFFFFF",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => { setAddingTo(null); setNewTaskTitle(""); }}
                          style={{
                            padding: "4px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: "#F4F4F5",
                            color: "#71717A",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 18,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          {filtered.map((task, i) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <button
                onClick={() => toggleDone(task.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
              >
                {task.status === "done" ? (
                  <CheckCircle2 size={18} color="#22C55E" fill="#22C55E" />
                ) : (
                  <Circle size={18} color="#D1D5DB" />
                )}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: task.status === "done" ? "#A1A1AA" : "#18181B",
                    textDecoration: task.status === "done" ? "line-through" : "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {task.description}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#71717A", padding: "2px 8px", borderRadius: 6, background: "#F4F4F5", flexShrink: 0 }}>
                {task.category}
              </span>
              <Flag size={12} color={priorityColor[task.priority]} fill={priorityColor[task.priority]} style={{ flexShrink: 0 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Calendar size={12} color="#A1A1AA" />
                <span style={{ fontSize: 12, color: "#A1A1AA" }}>{task.due}</span>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: statusBg[task.status],
                  color: statusColor[task.status],
                  flexShrink: 0,
                }}
              >
                {statusLabel[task.status]}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#A1A1AA", flexShrink: 0 }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
  const priorityColor: Record<Priority, string> = { high: "#EF4444", medium: "#F59E0B", low: "#22C55E" };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 12,
        padding: "14px",
        border: "1px solid #E5E7EB",
        transition: "box-shadow 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B", lineHeight: 1.4, marginBottom: 6 }}>
            {task.title}
          </div>
          {task.description && (
            <div style={{ fontSize: 12, color: "#71717A", lineHeight: 1.4, marginBottom: 8 }}>
              {task.description}
            </div>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 500,
                background: "#F4F4F5",
                color: "#71717A",
              }}
            >
              {task.category}
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                background: `${priorityColor[task.priority]}18`,
                color: priorityColor[task.priority],
              }}
            >
              <Flag size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
              {task.priority}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#D1D5DB", flexShrink: 0 }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar size={11} color="#A1A1AA" />
          <span style={{ fontSize: 11, color: "#A1A1AA" }}>{task.due}</span>
        </div>
        <button
          onClick={() => onToggle(task.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {task.status === "done" ? (
            <CheckCircle2 size={16} color="#22C55E" fill="#22C55E" />
          ) : (
            <Circle size={16} color="#D1D5DB" />
          )}
        </button>
      </div>
    </div>
  );
}
