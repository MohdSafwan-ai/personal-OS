import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, TrendingUp } from "lucide-react";

const data = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 5.8 },
  { day: "Thu", hours: 8.1 },
  { day: "Fri", hours: 7.6 },
  { day: "Sat", hours: 3.2 },
  { day: "Sun", hours: 1.5 },
];

export default function TimeWorked() {
  const total = data.reduce((s, d) => s + d.hours, 0);
  const today = data[4].hours;

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Hours Worked</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>
              {today}h
            </span>
            <span style={{ fontSize: 13, color: "#A1A1AA" }}>today</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#71717A" }}>This week</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#18181B" }}>{total.toFixed(1)}h</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              color: "#15803D",
              fontWeight: 600,
              justifyContent: "flex-end",
              marginTop: 2,
            }}
          >
            <TrendingUp size={10} />
            +14% vs last week
          </div>
        </div>
      </div>

      <div style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B5CEB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#5B5CEB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#A1A1AA" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              formatter={(v: number) => [`${v}h`, "Hours"]}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#5B5CEB"
              strokeWidth={2}
              fill="url(#hoursGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#5B5CEB", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
