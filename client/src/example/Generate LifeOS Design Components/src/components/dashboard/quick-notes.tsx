import { useState } from "react";
import { Plus, Pin, X } from "lucide-react";

const NOTE_COLORS = ["#FEF9C3", "#DCFCE7", "#DBEAFE", "#FCE7F3", "#F3E8FF"];

interface Note {
  id: number;
  text: string;
  color: string;
  pinned: boolean;
}

const initialNotes: Note[] = [
  { id: 1, text: "Ship the new dashboard by Thursday", color: "#FEF9C3", pinned: true },
  { id: 2, text: "Call dentist to reschedule appointment", color: "#DBEAFE", pinned: false },
  { id: 3, text: "Read chapter 5 of 'Deep Work'", color: "#DCFCE7", pinned: false },
];

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [input, setInput] = useState("");

  const addNote = () => {
    if (!input.trim()) return;
    const color = NOTE_COLORS[notes.length % NOTE_COLORS.length];
    setNotes((prev) => [...prev, { id: Date.now(), text: input.trim(), color, pinned: false }]);
    setInput("");
  };

  const removeNote = (id: number) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const togglePin = (id: number) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

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
          <div style={{ fontSize: 13, fontWeight: 500, color: "#71717A" }}>Quick Notes</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#18181B", marginTop: 2 }}>
            {notes.length} notes
          </div>
        </div>
      </div>

      {/* Add input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Jot something down…"
          style={{
            flex: 1,
            height: 36,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            background: "#F4F4F5",
            fontSize: 13,
            color: "#18181B",
            outline: "none",
          }}
        />
        <button
          onClick={addNote}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "none",
            background: "#5B5CEB",
            color: "#FFFFFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Notes grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {sorted.map((note) => (
          <div
            key={note.id}
            style={{
              background: note.color,
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 12,
              color: "#18181B",
              lineHeight: 1.5,
              position: "relative",
              maxWidth: "100%",
              flex: "1 1 140px",
              minHeight: 56,
              border: note.pinned ? "1.5px solid rgba(0,0,0,0.08)" : "1px solid transparent",
            }}
          >
            <div style={{ marginRight: 32, wordBreak: "break-word" }}>{note.text}</div>
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 4,
              }}
            >
              <button
                onClick={() => togglePin(note.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  opacity: note.pinned ? 1 : 0.4,
                }}
              >
                <Pin size={11} color="#18181B" fill={note.pinned ? "#18181B" : "none"} />
              </button>
              <button
                onClick={() => removeNote(note.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  opacity: 0.4,
                }}
              >
                <X size={11} color="#18181B" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
