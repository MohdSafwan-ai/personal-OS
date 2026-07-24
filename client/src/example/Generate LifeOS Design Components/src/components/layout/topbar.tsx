import { useState } from "react";
import { Search, Bell, Plus, Sun, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface TopbarProps {
  onQuickAdd?: () => void;
}

export default function Topbar({ onQuickAdd }: TopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const today = new Date();

  return (
    <header
      style={{
        height: 64,
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Search */}
      <div
        style={{
          flex: 1,
          maxWidth: 400,
          position: "relative",
        }}
      >
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#A1A1AA",
          }}
        />
        <input
          placeholder="Search tasks, notes, habits…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 36,
            paddingRight: 16,
            borderRadius: 10,
            border: `1px solid ${searchFocused ? "#5B5CEB" : "#E5E7EB"}`,
            background: searchFocused ? "#FFFFFF" : "#F4F4F5",
            fontSize: 13,
            color: "#18181B",
            outline: "none",
            transition: "all 0.15s ease",
            boxShadow: searchFocused ? "0 0 0 3px rgba(91,92,235,0.12)" : "none",
          }}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#71717A",
          fontWeight: 500,
        }}
      >
        <Sun size={14} color="#F59E0B" />
        <span>{format(today, "EEEE, MMMM d")}</span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />

      {/* Quick Add */}
      <button
        onClick={onQuickAdd}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 10,
          background: "#5B5CEB",
          border: "none",
          color: "#FFFFFF",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: "0 1px 4px rgba(91,92,235,0.3)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#4445C8")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#5B5CEB")}
      >
        <Plus size={14} />
        Quick Add
      </button>

      {/* Bell */}
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
      >
        <Bell size={16} color="#71717A" />
        <span
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#5B5CEB",
            border: "2px solid #FFFFFF",
          }}
        />
      </button>

      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a78bfa, #5B5CEB)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
          color: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        AM
      </div>
    </header>
  );
}
