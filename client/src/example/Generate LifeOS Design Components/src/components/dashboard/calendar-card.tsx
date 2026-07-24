import { Clock, Video, Users } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Team standup",
    time: "9:00 AM",
    duration: "30 min",
    type: "meeting",
    icon: <Users size={12} />,
    color: "#5B5CEB",
    bg: "#EEEEFF",
  },
  {
    id: 2,
    title: "Design review",
    time: "11:30 AM",
    duration: "1h",
    type: "meeting",
    icon: <Video size={12} />,
    color: "#22C55E",
    bg: "#DCFCE7",
  },
  {
    id: 3,
    title: "Deep work block",
    time: "2:00 PM",
    duration: "2h",
    type: "focus",
    icon: <Clock size={12} />,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: 4,
    title: "Product roadmap sync",
    time: "4:30 PM",
    duration: "45 min",
    type: "meeting",
    icon: <Users size={12} />,
    color: "#EF4444",
    bg: "#FEE2E2",
  },
];

export default function CalendarCard() {
  const now = new Date();
  const hour = now.getHours();

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Today's Schedule</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            {events.length} events
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#71717A" }}>
          {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: event.bg,
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 44,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: event.color }}>
                {event.time.split(" ")[0]}
              </div>
              <div style={{ fontSize: 10, color: event.color, opacity: 0.7 }}>
                {event.time.split(" ")[1]}
              </div>
            </div>
            <div style={{ width: 2, background: event.color, borderRadius: 1, opacity: 0.4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B" }}>{event.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <span style={{ color: event.color }}>{event.icon}</span>
                <span style={{ fontSize: 11, color: "#71717A" }}>{event.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
