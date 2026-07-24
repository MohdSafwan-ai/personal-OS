import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { Plus } from "lucide-react";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAFAF8" }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
          }}
        >
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* FAB */}
      <button
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5B5CEB 0%, #8B8CF8 100%)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(91,92,235,0.4)",
          zIndex: 100,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(91,92,235,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(91,92,235,0.4)";
        }}
      >
        <Plus size={22} color="#fff" />
      </button>
    </div>
  );
}
