import { CheckCircle2, Circle, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tasks = [
  { id: 1, title: "Review Q3 analytics report", done: true, priority: "high" },
  { id: 2, title: "Write weekly team update", done: true, priority: "medium" },
  { id: 3, title: "Design new onboarding flow", done: false, priority: "high" },
  { id: 4, title: "Fix mobile nav bug", done: false, priority: "low" },
  { id: 5, title: "Schedule 1:1 with team lead", done: false, priority: "medium" },
];

const priorityColor: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
};

export default function TasksCard() {
  const navigate = useNavigate();
  const done = tasks.filter((t) => t.done).length;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: "24px",
        border: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Today's Tasks</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            {done} of {tasks.length} complete
          </div>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#5B5CEB",
            background: "#EEEEFF",
            border: "none",
            borderRadius: 8,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          View all
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "#F4F4F5", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${(done / tasks.length) * 100}%`,
            background: "linear-gradient(90deg, #5B5CEB, #8B8CF8)",
            borderRadius: 2,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: "1px solid #F3F4F6",
              cursor: "pointer",
            }}
          >
            {task.done ? (
              <CheckCircle2 size={18} color="#22C55E" fill="#22C55E" style={{ flexShrink: 0 }} />
            ) : (
              <Circle size={18} color="#D1D5DB" style={{ flexShrink: 0 }} />
            )}
            <span
              style={{
                flex: 1,
                fontSize: 13,
                color: task.done ? "#A1A1AA" : "#18181B",
                textDecoration: task.done ? "line-through" : "none",
                fontWeight: task.done ? 400 : 500,
              }}
            >
              {task.title}
            </span>
            <Flag size={12} color={priorityColor[task.priority]} fill={priorityColor[task.priority]} style={{ flexShrink: 0, opacity: 0.8 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
