import { useState } from "react";
import { Flame, Plus, Check, TrendingUp, BarChart2 } from "lucide-react";

interface Habit {
  id: number;
  name: string;
  emoji: string;
  category: string;
  streak: number;
  longestStreak: number;
  completionRate: number;
  weekDays: boolean[];
  color: string;
}

const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Morning meditation", emoji: "🧘", category: "Wellness", streak: 14, longestStreak: 21, completionRate: 93, weekDays: [true, true, true, true, true, false, false], color: "#5B5CEB" },
  { id: 2, name: "Exercise 30 min", emoji: "🏃", category: "Fitness", streak: 7, longestStreak: 30, completionRate: 78, weekDays: [true, false, true, false, true, true, false], color: "#22C55E" },
  { id: 3, name: "Read 20 pages", emoji: "📚", category: "Learning", streak: 5, longestStreak: 12, completionRate: 65, weekDays: [true, true, false, true, false, false, true], color: "#F59E0B" },
  { id: 4, name: "Cold shower", emoji: "🚿", category: "Wellness", streak: 3, longestStreak: 14, completionRate: 54, weekDays: [true, true, true, false, false, false, false], color: "#EF4444" },
  { id: 5, name: "No sugar", emoji: "🍎", category: "Nutrition", streak: 21, longestStreak: 21, completionRate: 88, weekDays: [true, true, true, true, true, true, true], color: "#EC4899" },
  { id: 6, name: "Journaling", emoji: "✍️", category: "Mindset", streak: 8, longestStreak: 45, completionRate: 71, weekDays: [false, true, false, true, false, true, true], color: "#8B5CF6" },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const heatmapData = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const r = Math.random();
    return r > 0.3 ? (r > 0.7 ? 2 : 1) : 0;
  })
);

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [todayChecked, setTodayChecked] = useState<Set<number>>(new Set([1, 2, 5]));
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(habits.map((h) => h.category)))];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  const filteredHabits =
    activeCategory === "All" ? habits : habits.filter((h) => h.category === activeCategory);

  const toggleToday = (id: number) => {
    setTodayChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const donePct = Math.round((todayChecked.size / habits.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>Habits</h1>
          <p style={{ fontSize: 14, color: "#71717A", marginTop: 4 }}>
            {todayChecked.size} of {habits.length} habits done today
          </p>
        </div>
        <button
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
          <Plus size={16} /> New Habit
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Today's completion", value: `${donePct}%`, sub: `${todayChecked.size} habits done`, color: "#5B5CEB", bg: "#EEEEFF" },
          { label: "Best current streak", value: "21 days", sub: "No sugar 🍎", color: "#22C55E", bg: "#DCFCE7" },
          { label: "Avg completion rate", value: "74%", sub: "Last 30 days", color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Total habits", value: `${habits.length}`, sub: "Across 5 categories", color: "#8B5CF6", bg: "#F3E8FF" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px 24px", border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#71717A" }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#18181B", marginTop: 4, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 500, marginTop: 4, padding: "2px 8px", background: s.bg, borderRadius: 6, display: "inline-block" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: activeCategory === cat ? "#5B5CEB" : "#F4F4F5",
              color: activeCategory === cat ? "#FFFFFF" : "#71717A",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habit list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {filteredHabits.map((habit) => {
          const checked = todayChecked.has(habit.id);
          return (
            <div
              key={habit.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 18,
                padding: "20px",
                border: `1px solid ${checked ? habit.color + "30" : "#E5E7EB"}`,
                transition: "all 0.2s ease",
                boxShadow: checked ? `0 0 0 1px ${habit.color}20, 0 4px 20px ${habit.color}10` : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: habit.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {habit.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#18181B" }}>{habit.name}</div>
                    <div style={{ fontSize: 12, color: "#71717A", marginTop: 1 }}>{habit.category}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleToday(habit.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `2px solid ${checked ? habit.color : "#E5E7EB"}`,
                    background: checked ? habit.color : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  <Check size={16} color={checked ? "#FFFFFF" : "#D1D5DB"} strokeWidth={3} />
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Flame size={12} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#18181B" }}>{habit.streak}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#A1A1AA" }}>streak</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#18181B" }}>{habit.longestStreak}</div>
                  <div style={{ fontSize: 10, color: "#A1A1AA" }}>best</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#18181B" }}>{habit.completionRate}%</div>
                  <div style={{ fontSize: 10, color: "#A1A1AA" }}>rate</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 4, background: "#F4F4F5", borderRadius: 2, overflow: "hidden", marginTop: 8 }}>
                    <div style={{ height: "100%", width: `${habit.completionRate}%`, background: habit.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              </div>

              {/* Week days */}
              <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
                {DAYS.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <span style={{ fontSize: 9, color: i === todayIdx ? habit.color : "#A1A1AA", fontWeight: 600 }}>{d}</span>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 26,
                        aspectRatio: "1",
                        borderRadius: 5,
                        background: habit.weekDays[i] ? habit.color : "#F4F4F5",
                        opacity: habit.weekDays[i] ? (i === todayIdx ? 1 : 0.6) : 1,
                        border: i === todayIdx ? `2px solid ${habit.color}` : "2px solid transparent",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "24px", border: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#18181B", marginBottom: 16 }}>Activity Heatmap</div>
        <div style={{ display: "flex", gap: 4 }}>
          {heatmapData.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {week.map((val, di) => (
                <div
                  key={di}
                  title={`Week ${wi + 1}, Day ${di + 1}`}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    background: val === 0 ? "#F4F4F5" : val === 1 ? "#A5B4FC" : "#5B5CEB",
                    transition: "opacity 0.1s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#A1A1AA" }}>Less</span>
          {["#F4F4F5", "#A5B4FC", "#5B5CEB"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
          ))}
          <span style={{ fontSize: 11, color: "#A1A1AA" }}>More</span>
        </div>
      </div>
    </div>
  );
}
