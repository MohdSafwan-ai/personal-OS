import { BarChart2, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import TodaysProgress from "../components/dashboard/todays-progress";
import ProductivityScore from "../components/dashboard/productivity-score";
import TasksCard from "../components/dashboard/tasks-card";
import TimeWorked from "../components/dashboard/time-worked";
import FocusTimerCard from "../components/dashboard/focus-timer";
import HabitsCard from "../components/dashboard/habits-card";
import CalendarCard from "../components/dashboard/calendar-card";
import QuickNotes from "../components/dashboard/quick-notes";
import RecentActivity from "../components/dashboard/recent-activity";

const weeklyData = [
  { day: "Mon", tasks: 8, habits: 5, focus: 4 },
  { day: "Tue", tasks: 12, habits: 6, focus: 6 },
  { day: "Wed", tasks: 7, habits: 4, focus: 3 },
  { day: "Thu", tasks: 15, habits: 7, focus: 7 },
  { day: "Fri", tasks: 11, habits: 5, focus: 5 },
  { day: "Sat", tasks: 4, habits: 3, focus: 2 },
  { day: "Sun", tasks: 2, habits: 2, focus: 1 },
];

const quotes = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Small daily improvements are the key to staggering long-term results.",
  "You don't have to be great to start, but you have to start to be great.",
];

export default function Dashboard() {
  const today = new Date();
  const greeting =
    today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";
  const quote = quotes[today.getDay() % quotes.length];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1280 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>
            {greeting}, Alex 👋
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#71717A",
              marginTop: 4,
              fontStyle: "italic",
              maxWidth: 480,
            }}
          >
            "{quote}"
          </div>
        </div>
        <div
          style={{
            padding: "10px 16px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #EEEEFF 0%, #F3E8FF 100%)",
            border: "1px solid #C4B5FD",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={16} color="#7C3AED" />
          <div>
            <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 500 }}>AI Insight</div>
            <div style={{ fontSize: 13, color: "#4C1D95", fontWeight: 600 }}>
              You're 23% more focused on Thursdays
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Tasks Done", value: "12", sub: "of 17 today", color: "#5B5CEB", bg: "#EEEEFF" },
          { label: "Habits", value: "60%", sub: "3 of 5 done", color: "#22C55E", bg: "#DCFCE7" },
          { label: "Focus Time", value: "4h 20m", sub: "+12% vs avg", color: "#F59E0B", bg: "#FEF3C7" },
          { label: "Streak", value: "14 days", sub: "personal best!", color: "#EF4444", bg: "#FEE2E2" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#FFFFFF",
              borderRadius: 18,
              padding: "20px 24px",
              border: "1px solid #E5E7EB",
              transition: "box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#71717A" }}>{stat.label}</div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#18181B",
                letterSpacing: "-0.02em",
                marginTop: 4,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: stat.color,
                fontWeight: 500,
                marginTop: 4,
                padding: "2px 8px",
                background: stat.bg,
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <TodaysProgress completed={12} total={17} />
        <ProductivityScore score={82} previousScore={74} />
        <FocusTimerCard />
      </div>

      {/* Weekly chart */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 18,
          padding: "24px",
          border: "1px solid #E5E7EB",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#18181B" }}>Weekly Overview</div>
            <div style={{ fontSize: 13, color: "#71717A", marginTop: 2 }}>Tasks, habits, and focus hours</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { color: "#5B5CEB", label: "Tasks" },
              { color: "#22C55E", label: "Habits" },
              { color: "#F59E0B", label: "Focus hrs" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 12, color: "#71717A" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
                cursor={{ fill: "#F4F4F5", radius: 4 }}
              />
              <Bar dataKey="tasks" fill="#5B5CEB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="habits" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="focus" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TasksCard />
        <HabitsCard />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TimeWorked />
        <CalendarCard />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <QuickNotes />
        <RecentActivity />
      </div>
    </div>
  );
}
