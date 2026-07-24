import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  ChevronsLeft,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Repeat,
  Settings,
  Timer,
  Globe2,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/habits", label: "Habits", icon: Repeat },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/flowverse", label: "FlowVerse", icon: Globe2 },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/notes", label: "Notes", icon: NotebookPen },
];

const EASE = [0.32, 0.72, 0, 1] as const;

/** Full-height overlay drawer for mobile; mirrors the desktop sidebar nav. */
export function MobileDrawer() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const close = () => useUiStore.getState().setMobileNavOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(86vw,280px)] flex-col border-r bg-card shadow-2xl md:hidden"
          >
            <div className="flex h-16 items-center gap-2.5 border-b px-5">
              <img
                src="/flowtrack-mark-512.png"
                alt=""
                className="h-9 w-9 shrink-0 object-contain"
              />
              <span className="text-[17px] font-bold tracking-[-0.02em]">FlowTrack</span>
            </div>
            <nav className="flex-1 space-y-1 p-2 pt-3">
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t p-2">
              <NavLink
                to="/settings"
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <Settings className="h-4 w-4 shrink-0" />
                Settings
              </NavLink>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 228 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative z-30 hidden shrink-0 flex-col border-r bg-card md:flex"
    >
      <div className={cn("flex h-16 items-center gap-2.5 overflow-hidden border-b", collapsed ? "px-[18px]" : "px-5")}>
        <img
          src="/flowtrack-mark-512.png"
          alt=""
          className="h-9 w-9 shrink-0 object-contain"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap text-[17px] font-bold tracking-[-0.02em]"
            >
              FlowTrack
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="touch-scroll flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden p-2 pt-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "group relative flex h-10 items-center gap-3 rounded-[10px] px-2.5 text-sm font-medium",
                "transition-colors duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute left-0 h-5 w-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t p-2">
        <NavLink
          to="/settings"
          title={collapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            cn(
              "group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors duration-150",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )
          }
        >
          <Settings className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </NavLink>
        <div
          className={cn(
            "flex min-w-0 items-center gap-2.5 rounded-[10px] px-2.5 py-2",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] to-primary text-white">
            <User className="h-3.5 w-3.5" />
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{user?.name}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{user?.email}</span>
              </span>
              <button
                onClick={() => void logout()}
                aria-label="Sign out"
                className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
        <button
          onClick={toggle}
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm font-medium text-muted-foreground",
            "transition-colors duration-150 hover:bg-accent hover:text-foreground"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid shrink-0 place-items-center"
          >
            <ChevronsLeft className="h-4 w-4" />
          </motion.span>
          {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
