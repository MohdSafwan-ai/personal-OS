import { useState } from "react";
import { Plus, Search, Pin, Tag, Folder, Star, MoreHorizontal, X, Hash } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  pinned: boolean;
  starred: boolean;
  updatedAt: string;
  color: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    title: "Q3 Product Strategy",
    content: "Key focus areas for Q3: 1) Mobile-first redesign 2) AI features integration 3) Partnership expansion in APAC markets. The goal is to hit $2M ARR by end of quarter.\n\nCore metrics to track:\n- Daily active users\n- Churn rate\n- Feature adoption",
    folder: "Work",
    tags: ["strategy", "product"],
    pinned: true,
    starred: true,
    updatedAt: "Today, 2:30 PM",
    color: "#EEEEFF",
  },
  {
    id: 2,
    title: "Book notes: Deep Work",
    content: "\"The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.\"\n\nKey concepts:\n- Schedule deep work like meetings\n- Digital minimalism\n- Quit social media",
    folder: "Personal",
    tags: ["books", "productivity"],
    pinned: true,
    starred: false,
    updatedAt: "Yesterday",
    color: "#DCFCE7",
  },
  {
    id: 3,
    title: "Weekly review template",
    content: "What went well this week?\nWhat could be improved?\nTop 3 priorities for next week?\nGratitude — 3 things I'm grateful for\nEnergy levels — how am I feeling overall?",
    folder: "Templates",
    tags: ["template", "weekly"],
    pinned: false,
    starred: false,
    updatedAt: "Jul 22",
    color: "#FEF9C3",
  },
  {
    id: 4,
    title: "Meeting notes — Design sync",
    content: "Attendees: Alex, Sarah, Marcus, Priya\n\nDiscussion:\n- New color system needs to be accessible (WCAG AA)\n- Component library migration to be done by Aug 1\n- Mobile breakpoints: 375, 768, 1024, 1440",
    folder: "Work",
    tags: ["meeting", "design"],
    pinned: false,
    starred: false,
    updatedAt: "Jul 21",
    color: "#FCE7F3",
  },
  {
    id: 5,
    title: "2024 goals tracker",
    content: "✅ Learn to code React\n✅ Run a half marathon\n⬜ Read 24 books — 14/24\n⬜ Ship a side project\n⬜ Meditate 100 hours — 62h done\n⬜ Travel to 3 new countries — 1/3",
    folder: "Personal",
    tags: ["goals", "yearly"],
    pinned: false,
    starred: true,
    updatedAt: "Jul 20",
    color: "#DBEAFE",
  },
  {
    id: 6,
    title: "Startup ideas",
    content: "1. AI writing coach for non-native English speakers\n2. Sleep optimization app with smart alarm\n3. Collaborative habit tracker for couples\n4. Local business review aggregator\n5. Voice-to-task capture with smart categorization",
    folder: "Ideas",
    tags: ["ideas", "startup"],
    pinned: false,
    starred: false,
    updatedAt: "Jul 18",
    color: "#F3E8FF",
  },
];

const FOLDERS = ["All", "Work", "Personal", "Templates", "Ideas"];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selected, setSelected] = useState<Note>(INITIAL_NOTES[0]);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [editContent, setEditContent] = useState(INITIAL_NOTES[0].content);
  const [editTitle, setEditTitle] = useState(INITIAL_NOTES[0].title);

  const filtered = notes.filter(
    (n) =>
      (folder === "All" || n.folder === folder) &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()))
  );

  const pinned = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);

  const selectNote = (n: Note) => {
    setSelected(n);
    setEditContent(n.content);
    setEditTitle(n.title);
  };

  const saveNote = () => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selected.id ? { ...n, title: editTitle, content: editContent, updatedAt: "Just now" } : n
      )
    );
    setSelected((prev) => ({ ...prev, title: editTitle, content: editContent }));
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled note",
      content: "",
      folder: "Personal",
      tags: [],
      pinned: false,
      starred: false,
      updatedAt: "Just now",
      color: "#FFFFFF",
    };
    setNotes((prev) => [newNote, ...prev]);
    selectNote(newNote);
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* Left sidebar */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A1A1AA" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            style={{
              width: "100%",
              height: 36,
              paddingLeft: 32,
              paddingRight: 10,
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* New note button */}
        <button
          onClick={addNote}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "none",
            background: "#5B5CEB",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Plus size={15} /> New Note
        </button>

        {/* Folders */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, padding: "0 4px" }}>
            Folders
          </div>
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 8,
                border: "none",
                background: folder === f ? "#EEEEFF" : "transparent",
                color: folder === f ? "#5B5CEB" : "#71717A",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Folder size={14} />
              {f}
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#A1A1AA" }}>
                {f === "All" ? notes.length : notes.filter((n) => n.folder === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Note list */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {pinned.length > 0 && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 4px 6px" }}>
              Pinned
            </div>
          )}
          {[...pinned, ...unpinned].map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: selected.id === note.id ? "#EEEEFF" : "transparent",
                border: `1px solid ${selected.id === note.id ? "#C7D2FE" : "transparent"}`,
                transition: "all 0.1s ease",
              }}
              onMouseEnter={(e) => { if (selected.id !== note.id) e.currentTarget.style.background = "#F4F4F5"; }}
              onMouseLeave={(e) => { if (selected.id !== note.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B", lineHeight: 1.3, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {note.title}
                </div>
                {note.pinned && <Pin size={10} color="#5B5CEB" fill="#5B5CEB" style={{ flexShrink: 0, marginTop: 2 }} />}
              </div>
              <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>
                {note.content}
              </div>
              <div style={{ fontSize: 10, color: "#D1D5DB", marginTop: 4 }}>{note.updatedAt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          background: "#FFFFFF",
          borderRadius: 18,
          border: "1px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Editor toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 24px",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
            <span style={{ padding: "3px 10px", borderRadius: 6, background: "#F4F4F5", fontSize: 12, fontWeight: 500, color: "#71717A" }}>
              {selected.folder}
            </span>
            {selected.tags.map((tag) => (
              <span key={tag} style={{ padding: "3px 8px", borderRadius: 6, background: "#EEEEFF", fontSize: 12, fontWeight: 500, color: "#5B5CEB", display: "flex", alignItems: "center", gap: 3 }}>
                <Hash size={9} />
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717A" }}>
              <Star size={15} fill={selected.starred ? "#F59E0B" : "none"} color={selected.starred ? "#F59E0B" : "currentColor"} />
            </button>
            <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717A" }}>
              <MoreHorizontal size={15} />
            </button>
          </div>
          <button
            onClick={saveNote}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "#5B5CEB",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>

        {/* Editor content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveNote}
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#18181B",
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              letterSpacing: "-0.02em",
              fontFamily: "inherit",
            }}
          />
          <div style={{ fontSize: 12, color: "#A1A1AA" }}>Updated {selected.updatedAt}</div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={saveNote}
            placeholder="Start writing…"
            style={{
              flex: 1,
              fontSize: 15,
              color: "#18181B",
              lineHeight: 1.8,
              border: "none",
              outline: "none",
              background: "transparent",
              resize: "none",
              fontFamily: "inherit",
              minHeight: 400,
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
