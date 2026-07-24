import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Repeat2,
  Timer,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  User,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/habits", icon: Repeat2, label: "Habits" },
  { to: "/focus", icon: Timer, label: "Focus" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/notes", icon: FileText, label: "Notes" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      style={{
        width: collapsed ? 68 : 228,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 18px" : "0 20px",
          gap: 10,
          borderBottom: "1px solid #F3F4F6",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg, #5B5CEB 0%, #8B8CF8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(91,92,235,0.3)",
          }}
        >
          <Zap size={16} color="#fff" fill="#fff" />
        </div>
        {!collapsed && (
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#18181B",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            LifeOS
          </span>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: collapsed ? "10px 18px" : "10px 16px",
              margin: "0 8px",
              borderRadius: 10,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? "#5B5CEB" : "#71717A",
              background: isActive ? "#EEEEFF" : "transparent",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            })}
            className="sidebar-link"
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  style={{ flexShrink: 0, color: isActive ? "#5B5CEB" : "#71717A" }}
                />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          borderTop: "1px solid #F3F4F6",
          padding: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: collapsed ? "10px 18px" : "10px 16px",
            margin: "0 8px",
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            color: isActive ? "#5B5CEB" : "#71717A",
            background: isActive ? "#EEEEFF" : "transparent",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
            overflow: "hidden",
          })}
        >
          {({ isActive }) => (
            <>
              <Settings size={18} style={{ flexShrink: 0, color: isActive ? "#5B5CEB" : "#71717A" }} />
              {!collapsed && <span>Settings</span>}
            </>
          )}
        </NavLink>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "10px 18px" : "10px 16px",
            margin: "0 8px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a78bfa, #5B5CEB)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Alex Morgan
              </div>
              <div style={{ fontSize: 11, color: "#A1A1AA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                alex@lifeos.app
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: "absolute",
          right: -12,
          top: 72,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          zIndex: 50,
        }}
      >
        {collapsed ? <ChevronRight size={12} color="#71717A" /> : <ChevronLeft size={12} color="#71717A" />}
      </button>
    </aside>
  );
}
