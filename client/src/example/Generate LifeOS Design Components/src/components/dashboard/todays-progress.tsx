interface TodaysProgressProps {
  completed: number;
  total: number;
}

export default function TodaysProgress({ completed, total }: TodaysProgressProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Today's Progress</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            {completed}/{total} done
          </div>
        </div>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            background: pct >= 80 ? "#DCFCE7" : pct >= 40 ? "#FEF3C7" : "#EEEEFF",
            color: pct >= 80 ? "#15803D" : pct >= 40 ? "#B45309" : "#5B5CEB",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {pct >= 80 ? "On fire 🔥" : pct >= 40 ? "Halfway" : "Just started"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width={108} height={108} style={{ flexShrink: 0 }}>
          <circle cx={54} cy={54} r={r} fill="none" stroke="#F4F4F5" strokeWidth={10} />
          <circle
            cx={54}
            cy={54}
            r={r}
            fill="none"
            stroke="#5B5CEB"
            strokeWidth={10}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 54 54)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
          <text x={54} y={58} textAnchor="middle" fontSize={20} fontWeight={700} fill="#18181B">
            {pct}%
          </text>
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StatRow label="Completed" value={completed} color="#22C55E" />
            <StatRow label="Remaining" value={total - completed} color="#F59E0B" />
            <StatRow label="Overdue" value={2} color="#EF4444" />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          background: "#EEEEFF",
          fontSize: 13,
          color: "#5B5CEB",
          fontWeight: 500,
        }}
      >
        {pct >= 80
          ? "Amazing work! You're crushing today."
          : pct >= 50
          ? "Great momentum — keep it up!"
          : "Every task completed builds momentum."}
      </div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 13, color: "#71717A" }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#18181B" }}>{value}</span>
    </div>
  );
}
