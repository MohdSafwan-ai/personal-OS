import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  duration: string;
  color: string;
  type: string;
}

const today = new Date();

const EVENTS: Event[] = [
  { id: 1, title: "Team standup", date: today, time: "9:00", duration: "30m", color: "#5B5CEB", type: "Meeting" },
  { id: 2, title: "Design review", date: today, time: "11:30", duration: "1h", color: "#22C55E", type: "Meeting" },
  { id: 3, title: "Deep work", date: today, time: "14:00", duration: "2h", color: "#F59E0B", type: "Focus" },
  { id: 4, title: "Product roadmap", date: new Date(today.getTime() + 86400000), time: "10:00", duration: "45m", color: "#EF4444", type: "Meeting" },
  { id: 5, title: "Sprint planning", date: new Date(today.getTime() + 86400000 * 2), time: "9:30", duration: "2h", color: "#8B5CF6", type: "Meeting" },
  { id: 6, title: "1:1 with team lead", date: new Date(today.getTime() + 86400000 * 3), time: "15:00", duration: "30m", color: "#EC4899", type: "Meeting" },
  { id: 7, title: "User interviews", date: new Date(today.getTime() + 86400000 * 5), time: "11:00", duration: "2h", color: "#14B8A6", type: "Research" },
];

const WEEK_HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am–8pm

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today);
  const [view, setView] = useState<"month" | "week" | "agenda">("month");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedEvents = EVENTS.filter((e) => isSameDay(e.date, selectedDay));
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>Calendar</h1>
          <p style={{ fontSize: 14, color: "#71717A", marginTop: 4 }}>
            {EVENTS.length} events this month
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "#F4F4F5", borderRadius: 10, padding: 3 }}>
            {(["month", "week", "agenda"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: view === v ? "#FFFFFF" : "transparent",
                  color: view === v ? "#18181B" : "#71717A",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 12,
              border: "none",
              background: "#5B5CEB",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={15} /> New Event
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Calendar grid */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          {/* Month nav */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#71717A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#18181B" }}>
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#71717A" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #F3F4F6" }}>
            {dayNames.map((d) => (
              <div key={d} style={{ textAlign: "center", padding: "10px 0", fontSize: 12, fontWeight: 600, color: "#A1A1AA" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {allDays.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);
              const isSelected = isSameDay(day, selectedDay);
              const dayEvents = EVENTS.filter((e) => isSameDay(e.date, day));

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: 80,
                    padding: "8px",
                    borderRight: (i + 1) % 7 !== 0 ? "1px solid #F3F4F6" : "none",
                    borderBottom: "1px solid #F3F4F6",
                    cursor: "pointer",
                    background: isSelected ? "#EEEEFF" : "transparent",
                    transition: "background 0.1s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#FAFAF8"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: isToday ? "#5B5CEB" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? "#FFFFFF" : isCurrentMonth ? "#18181B" : "#D1D5DB",
                    }}
                  >
                    {format(day, "d")}
                  </div>
                  <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "#FFFFFF",
                          background: ev.color,
                          borderRadius: 3,
                          padding: "1px 4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: 10, color: "#71717A", fontWeight: 500 }}>+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Selected day */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px", border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>{format(selectedDay, "EEEE")}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#18181B", marginTop: 2, letterSpacing: "-0.02em" }}>
              {format(selectedDay, "MMMM d")}
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedEvents.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#A1A1AA",
                    fontSize: 13,
                    background: "#FAFAF8",
                    borderRadius: 12,
                    border: "1px dashed #E5E7EB",
                  }}
                >
                  No events. Enjoy your free time! 🌿
                </div>
              ) : (
                selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      background: ev.color + "15",
                      border: `1px solid ${ev.color}30`,
                    }}
                  >
                    <div style={{ width: 3, background: ev.color, borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B" }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: "#71717A", marginTop: 2 }}>
                        {ev.time} · {ev.duration} · {ev.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "20px", border: "1px solid #E5E7EB", flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#18181B", marginBottom: 12 }}>Upcoming</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EVENTS.filter((e) => e.date >= today).slice(0, 5).map((ev) => (
                <div key={ev.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: ev.color + "18",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: ev.color, lineHeight: 1 }}>
                      {format(ev.date, "d")}
                    </span>
                    <span style={{ fontSize: 8, color: ev.color, fontWeight: 500 }}>{format(ev.date, "MMM")}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#71717A" }}>{ev.time} · {ev.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
