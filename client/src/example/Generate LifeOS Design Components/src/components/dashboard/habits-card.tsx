import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";

const habits = [
  { id: 1, name: "Morning meditation", emoji: "🧘", done: true, streak: 14 },
  { id: 2, name: "Exercise 30 min", emoji: "🏃", done: true, streak: 7 },
  { id: 3, name: "Read 20 pages", emoji: "📚", done: false, streak: 5 },
  { id: 4, name: "Cold shower", emoji: "🚿", done: false, streak: 3 },
  { id: 5, name: "No sugar", emoji: "🍎", done: true, streak: 21 },
];

export default function HabitsCard() {
  const navigate = useNavigate();
  const done = habits.filter((h) => h.done).length;
  const pct = Math.round((done / habits.length) * 100);

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Today's Habits</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            {pct}% complete
          </div>
        </div>
        <button
          onClick={() => navigate("/habits")}
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

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {habits.map((habit) => (
          <div
            key={habit.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              background: habit.done ? "#F0FDF4" : "#F4F4F5",
              border: `1px solid ${habit.done ? "#BBF7D0" : "transparent"}`,
              transition: "all 0.15s ease",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16 }}>{habit.emoji}</span>
            <span
              style={{
                flex: 1,
                fontSize: 13,
                fontWeight: 500,
                color: habit.done ? "#166534" : "#18181B",
                textDecoration: habit.done ? "line-through" : "none",
              }}
            >
              {habit.name}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Flame size={11} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#B45309" }}>{habit.streak}</span>
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: habit.done ? "#22C55E" : "#FFFFFF",
                border: `2px solid ${habit.done ? "#22C55E" : "#D1D5DB"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {habit.done && (
                <svg width={10} height={10} viewBox="0 0 10 10">
                  <polyline points="2,5 4,7 8,3" stroke="#fff" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
