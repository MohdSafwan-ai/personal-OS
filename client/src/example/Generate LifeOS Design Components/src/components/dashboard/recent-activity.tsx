import { CheckCircle2, Repeat2, FileText, Timer, Trophy } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "task",
    icon: <CheckCircle2 size={14} />,
    color: "#22C55E",
    bg: "#DCFCE7",
    text: "Completed \"Review Q3 analytics report\"",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "habit",
    icon: <Repeat2 size={14} />,
    color: "#5B5CEB",
    bg: "#EEEEFF",
    text: "Checked off Morning meditation",
    time: "42 min ago",
  },
  {
    id: 3,
    type: "focus",
    icon: <Timer size={14} />,
    color: "#F59E0B",
    bg: "#FEF3C7",
    text: "Finished 25-min focus session",
    time: "1h ago",
  },
  {
    id: 4,
    type: "note",
    icon: <FileText size={14} />,
    color: "#71717A",
    bg: "#F4F4F5",
    text: "Added note: Ship dashboard by Thursday",
    time: "2h ago",
  },
  {
    id: 5,
    type: "achievement",
    icon: <Trophy size={14} />,
    color: "#F59E0B",
    bg: "#FEF3C7",
    text: "Reached 14-day meditation streak 🎉",
    time: "3h ago",
  },
];

export default function RecentActivity() {
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
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Recent Activity</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#18181B", marginTop: 2 }}>Timeline</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {activities.map((item, i) => (
          <div key={item.id} style={{ display: "flex", gap: 12, position: "relative" }}>
            {/* Timeline line */}
            {i < activities.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  top: 30,
                  bottom: 0,
                  width: 1,
                  background: "#F3F4F6",
                }}
              />
            )}
            {/* Icon */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: item.bg,
                color: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1, paddingBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#18181B", fontWeight: 500, lineHeight: 1.4 }}>
                {item.text}
              </div>
              <div style={{ fontSize: 11, color: "#A1A1AA", marginTop: 2 }}>{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
