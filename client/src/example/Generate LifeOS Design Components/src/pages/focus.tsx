import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, SkipForward, Volume2, Flame, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Mode = "pomodoro" | "shortBreak" | "longBreak";

const MODES: Record<Mode, { label: string; mins: number; color: string }> = {
  pomodoro: { label: "Focus", mins: 25, color: "#5B5CEB" },
  shortBreak: { label: "Short Break", mins: 5, color: "#22C55E" },
  longBreak: { label: "Long Break", mins: 15, color: "#F59E0B" },
};

const AMBIENTS = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "forest", label: "Forest", emoji: "🌲" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "ocean", label: "Ocean", emoji: "🌊" },
  { id: "fire", label: "Fireplace", emoji: "🔥" },
];

const weeklyFocus = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 5.2 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 6.1 },
  { day: "Fri", hours: 4.4 },
  { day: "Sat", hours: 1.2 },
  { day: "Sun", hours: 0.8 },
];

const sessionHistory = [
  { time: "9:00 AM", duration: "25 min", task: "Design review prep", completed: true },
  { time: "9:35 AM", duration: "5 min", task: "Short break", completed: true },
  { time: "9:40 AM", duration: "25 min", task: "Wireframe iteration", completed: true },
  { time: "10:15 AM", duration: "25 min", task: "Code review", completed: false },
];

export default function Focus() {
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [running, setRunning] = useState(false);
  const [secsLeft, setSecsLeft] = useState(25 * 60);
  const [session, setSession] = useState(0);
  const [ambient, setAmbient] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const totalSecs = MODES[mode].mins * 60;

  useEffect(() => {
    setRunning(false);
    setSecsLeft(MODES[mode].mins * 60);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            if (mode === "pomodoro") setSession((p) => p + 1);
            return MODES[mode].mins * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const secs = String(secsLeft % 60).padStart(2, "0");
  const pct = ((totalSecs - secsLeft) / totalSecs) * 100;
  const circleR = 120;
  const circleCirc = 2 * Math.PI * circleR;
  const activeColor = MODES[mode].color;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>Focus</h1>
        <p style={{ fontSize: 14, color: "#71717A", marginTop: 4 }}>Deep work sessions with intention.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { icon: <Flame size={16} color="#F59E0B" fill="#F59E0B" />, label: "Sessions today", value: `${session + 3}`, bg: "#FEF3C7", color: "#B45309" },
          { icon: <Clock size={16} color="#5B5CEB" />, label: "Focus time today", value: "4h 20m", bg: "#EEEEFF", color: "#5B5CEB" },
          { icon: <TrendingUp size={16} color="#22C55E" />, label: "Weekly total", value: "24.0h", bg: "#DCFCE7", color: "#15803D" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px 24px", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: "#71717A" }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main focus area */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Timer card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "40px",
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* Mode tabs */}
          <div style={{ display: "flex", background: "#F4F4F5", borderRadius: 12, padding: 4, gap: 2 }}>
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 9,
                  border: "none",
                  background: mode === m ? "#FFFFFF" : "transparent",
                  color: mode === m ? "#18181B" : "#71717A",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>

          {/* Circle timer */}
          <div style={{ position: "relative", width: 280, height: 280 }}>
            <svg width={280} height={280} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={140} cy={140} r={circleR} fill="none" stroke="#F4F4F5" strokeWidth={14} />
              <circle
                cx={140}
                cy={140}
                r={circleR}
                fill="none"
                stroke={activeColor}
                strokeWidth={14}
                strokeDasharray={`${(pct / 100) * circleCirc} ${circleCirc}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.3s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 58,
                  fontWeight: 800,
                  color: "#18181B",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {mins}:{secs}
              </span>
              <span style={{ fontSize: 14, color: "#71717A", fontWeight: 500 }}>
                {MODES[mode].label}
              </span>
              {running && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: activeColor,
                    marginTop: 4,
                    animation: "pulse-ring 1.5s ease infinite",
                  }}
                />
              )}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => { setRunning(false); setSecsLeft(MODES[mode].mins * 60); }}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <RotateCcw size={18} color="#71717A" />
            </button>

            <button
              onClick={() => setRunning((v) => !v)}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "none",
                background: activeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: `0 8px 24px ${activeColor}40`,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {running ? <Pause size={28} color="#fff" fill="#fff" /> : <Play size={28} color="#fff" fill="#fff" />}
            </button>

            <button
              onClick={() => setMode(mode === "pomodoro" ? "shortBreak" : "pomodoro")}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <SkipForward size={18} color="#71717A" />
            </button>
          </div>

          <div style={{ fontSize: 13, color: "#A1A1AA" }}>
            Session {session + 1} of 4 · {4 - (session % 4) - 1} until long break
          </div>

          {/* Productivity tips */}
          <div
            style={{
              width: "100%",
              padding: "14px 18px",
              background: "#EEEEFF",
              borderRadius: 14,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 18 }}>💡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#5B5CEB", marginBottom: 2 }}>Productivity tip</div>
              <div style={{ fontSize: 13, color: "#4445C8", lineHeight: 1.5 }}>
                Turn off notifications during focus sessions. Even brief interruptions can take 23 minutes to recover from.
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Ambient sounds */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px", border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Volume2 size={16} color="#71717A" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#18181B" }}>Ambient Sound</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {AMBIENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAmbient(ambient === a.id ? null : a.id)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: `1.5px solid ${ambient === a.id ? "#5B5CEB" : "#E5E7EB"}`,
                    background: ambient === a.id ? "#EEEEFF" : "#FAFAF8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: ambient === a.id ? "#5B5CEB" : "#71717A",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{a.emoji}</span> {a.label}
                </button>
              ))}
              <button
                onClick={() => setAmbient(null)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1.5px solid ${ambient === null ? "#5B5CEB" : "#E5E7EB"}`,
                  background: ambient === null ? "#EEEEFF" : "#FAFAF8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: ambient === null ? "#5B5CEB" : "#71717A",
                  transition: "all 0.15s ease",
                  gridColumn: "span 2",
                }}
              >
                🔇 No sound
              </button>
            </div>
          </div>

          {/* Session history */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px", border: "1px solid #E5E7EB", flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#18181B", marginBottom: 14 }}>Session History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sessionHistory.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: s.completed ? "#F0FDF4" : "#FEE2E2",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: s.completed ? "#22C55E" : "#EF4444",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.task}
                    </div>
                    <div style={{ fontSize: 11, color: "#71717A" }}>
                      {s.time} · {s.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "24px", border: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#18181B", marginBottom: 20 }}>Weekly Focus Hours</div>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyFocus} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B5CEB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#5B5CEB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                formatter={(v: number) => [`${v}h`, "Focus"]}
              />
              <Area type="monotone" dataKey="hours" stroke="#5B5CEB" strokeWidth={2.5} fill="url(#focusGrad)" dot={false} activeDot={{ r: 5, fill: "#5B5CEB", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
