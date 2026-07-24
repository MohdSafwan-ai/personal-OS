import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Flame } from "lucide-react";

const POMODORO_MINS = 25;

export default function FocusTimerCard() {
  const [running, setRunning] = useState(false);
  const [secsLeft, setSecsLeft] = useState(POMODORO_MINS * 60);
  const [sessions, setSessions] = useState(3);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSecsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            setSessions((prev) => prev + 1);
            return POMODORO_MINS * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const secs = String(secsLeft % 60).padStart(2, "0");
  const pct = ((POMODORO_MINS * 60 - secsLeft) / (POMODORO_MINS * 60)) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Focus Timer</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            Deep Work Session
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 20,
            background: "#FEF3C7",
            color: "#B45309",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Flame size={12} fill="#F59E0B" color="#F59E0B" />
          {sessions} sessions today
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={96} height={96}>
            <circle cx={48} cy={48} r={r} fill="none" stroke="#F4F4F5" strokeWidth={8} />
            <circle
              cx={48}
              cy={48}
              r={r}
              fill="none"
              stroke={running ? "#5B5CEB" : "#D1D5DB"}
              strokeWidth={8}
              strokeDasharray={`${(pct / 100) * circ} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
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
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>
              {mins}:{secs}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setRunning((v) => !v)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                border: "none",
                background: running ? "#F4F4F5" : "#5B5CEB",
                color: running ? "#18181B" : "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              {running ? <><Pause size={14} /> Pause</> : <><Play size={14} fill="currentColor" /> Start</>}
            </button>
            <button
              onClick={() => { setRunning(false); setSecsLeft(POMODORO_MINS * 60); }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RotateCcw size={14} color="#71717A" />
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#A1A1AA", marginTop: 8, textAlign: "center" }}>
            {POMODORO_MINS} min pomodoro · {4 - (sessions % 4)} until long break
          </div>
        </div>
      </div>
    </div>
  );
}
