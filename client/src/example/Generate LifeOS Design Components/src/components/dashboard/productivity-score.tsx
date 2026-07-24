import { TrendingUp, TrendingDown } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

interface ProductivityScoreProps {
  score: number;
  previousScore: number;
}

export default function ProductivityScore({ score, previousScore }: ProductivityScoreProps) {
  const diff = score - previousScore;
  const isUp = diff >= 0;

  const data = [
    { name: "Score", value: score, fill: "#5B5CEB" },
    { name: "Base", value: 100, fill: "#F4F4F5" },
  ];

  const insights = [
    { label: "Focus time", value: "4h 20m", trend: "+12%" },
    { label: "Task rate", value: "87%", trend: "+5%" },
    { label: "Habit streak", value: "14 days", trend: "—" },
  ];

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Productivity Score</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>
              {score}
            </span>
            <span style={{ fontSize: 16, color: "#A1A1AA" }}>/100</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 20,
            background: isUp ? "#DCFCE7" : "#FEE2E2",
            color: isUp ? "#15803D" : "#DC2626",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? "+" : ""}{diff} vs last week
        </div>
      </div>

      <div style={{ height: 100, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="90%"
            innerRadius="70%"
            outerRadius="100%"
            barSize={12}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 12,
            color: "#A1A1AA",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {score < 60 ? "Needs work" : score < 80 ? "Good progress" : "Excellent"}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {insights.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 10,
              background: "#F4F4F5",
            }}
          >
            <span style={{ fontSize: 13, color: "#71717A" }}>{item.label}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#18181B" }}>{item.value}</span>
              <span
                style={{
                  fontSize: 11,
                  color: item.trend.startsWith("+") ? "#15803D" : "#71717A",
                  fontWeight: 500,
                }}
              >
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
