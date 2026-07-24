import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellOff,
  CalendarDays,
  CheckSquare,
  LogOut,
  Menu,
  Moon,
  NotebookPen,
  Plus,
  Repeat,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFocusWeek, useHabits, useNote, useTasks } from "@/lib/queries";
import { cn, toDayKey } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";

const pop = {
  initial: { opacity: 0, y: 6, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.97 },
  transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const },
};

function useClickOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

interface SearchHit {
  kind: "task" | "habit" | "note";
  label: string;
  sub?: string;
  to: string;
}

const HIT_ICON = { task: CheckSquare, habit: Repeat, note: NotebookPen };

/** Notifications derived from real state — no fake data. */
function useNotifications() {
  const { data: tasks = [] } = useTasks();
  const { data: habits = [] } = useHabits();
  const { data: focusByDay = {} } = useFocusWeek();
  const today = toDayKey();

  return useMemo(() => {
    const items: { id: string; title: string; body: string; to: string }[] = [];

    const openTasks = tasks.filter((t) => !t.done).length;
    if (openTasks > 0) {
      items.push({
        id: "tasks-open",
        title: `${openTasks} task${openTasks === 1 ? "" : "s"} remaining`,
        body: "Finish today's list to hit 100% progress.",
        to: "/tasks",
      });
    }

    const unchecked = habits.filter((h) => h.lastDoneDay !== today);
    if (unchecked.length > 0) {
      items.push({
        id: "habits-due",
        title: `${unchecked.length} habit${unchecked.length === 1 ? "" : "s"} to check in`,
        body: unchecked
          .map((h) => h.name)
          .slice(0, 3)
          .join(", "),
        to: "/habits",
      });
    }

    const streakAtRisk = habits.filter((h) => h.streak >= 3 && h.lastDoneDay !== today);
    if (streakAtRisk.length > 0) {
      items.push({
        id: "streak-risk",
        title: "Streak at risk",
        body: `Don't break your ${Math.max(...streakAtRisk.map((h) => h.streak))}-day streak on ${streakAtRisk[0].name}.`,
        to: "/habits",
      });
    }

    if ((focusByDay[today] ?? 0) === 0) {
      items.push({
        id: "no-focus",
        title: "No focus time yet today",
        body: "Start a Pomodoro session to get going.",
        to: "/focus",
      });
    }

    return items;
  }, [tasks, habits, focusByDay, today]);
}

export function Topbar() {
  const [open, setOpen] = useState<"notifications" | "profile" | null>(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const menuRef = useClickOutside(() => setOpen(null));
  const searchWrapRef = useClickOutside(() => setSearchFocused(false));
  const searchRef = useRef<HTMLInputElement>(null);

  const notifications = useNotifications();
  const { data: tasks = [] } = useTasks();
  const { data: habits = [] } = useHabits();
  const { data: noteContent = "" } = useNote();

  const initials = (user?.name ?? "?")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchHit[] = [];
    for (const t of tasks) {
      if (t.title.toLowerCase().includes(q)) {
        out.push({ kind: "task", label: t.title, sub: t.done ? "Done" : "Open", to: "/tasks" });
      }
    }
    for (const h of habits) {
      if (h.name.toLowerCase().includes(q)) {
        out.push({ kind: "habit", label: `${h.emoji} ${h.name}`, sub: `${h.streak} day streak`, to: "/habits" });
      }
    }
    if (noteContent.toLowerCase().includes(q)) {
      const idx = noteContent.toLowerCase().indexOf(q);
      const snippet = noteContent.slice(Math.max(0, idx - 20), idx + 40).trim();
      out.push({ kind: "note", label: "Quick note", sub: `…${snippet}…`, to: "/notes" });
    }
    return out.slice(0, 8);
  }, [query, tasks, habits, noteContent]);

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const showSearchPanel = searchFocused && query.trim().length > 0;

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-card/95 px-3 backdrop-blur-md sm:gap-3 sm:px-4 md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={() => useUiStore.getState().setMobileNavOpen(true)}
        aria-label="Open navigation"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative min-w-0 flex-1 sm:max-w-[400px]" ref={searchWrapRef}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search tasks, notes, habits…"
          className={cn(
            "h-9 w-full rounded-[10px] border bg-muted/70 pl-9 pr-3 text-xs outline-none sm:pr-16 sm:text-sm",
            "transition-all duration-200 placeholder:text-muted-foreground",
            "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
          )}
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium text-muted-foreground sm:block">
          ⌘K
        </kbd>

        <AnimatePresence>
          {showSearchPanel && (
            <motion.div
              {...pop}
              className="absolute left-0 right-0 top-11 overflow-hidden rounded-xl border bg-popover shadow-[0_16px_48px_-12px_rgba(0,0,0,0.18)]"
            >
              {hits.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results for "{query.trim()}"
                </p>
              ) : (
                hits.map((hit, i) => {
                  const Icon = HIT_ICON[hit.kind];
                  return (
                    <button
                      key={`${hit.kind}-${i}`}
                      onClick={() => {
                        navigate(hit.to);
                        setQuery("");
                        setSearchFocused(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{hit.label}</span>
                        {hit.sub && (
                          <span className="block truncate text-xs text-muted-foreground">{hit.sub}</span>
                        )}
                      </span>
                    </button>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5" ref={menuRef}>
        <div className="mr-1 hidden items-center gap-1.5 whitespace-nowrap text-xs font-medium text-muted-foreground xl:flex">
          <CalendarDays className="h-3.5 w-3.5 text-amber-500" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>

        <button
          onClick={() => navigate("/tasks")}
          className="hidden h-9 items-center gap-1.5 rounded-[10px] bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-[0_1px_4px_rgba(91,92,235,0.3)] transition-colors hover:brightness-95 lg:flex"
        >
          <Plus className="h-3.5 w-3.5" />
          Quick Add
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="hidden h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 sm:grid"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? "sun" : "moon"}
              initial={{ rotate: -60, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 60, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === "notifications" ? null : "notifications")}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90"
          >
            <Bell className="h-[18px] w-[18px]" />
            {notifications.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground shadow-sm"
              >
                {notifications.length}
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {open === "notifications" && (
              <motion.div
                {...pop}
                className="fixed left-3 right-3 top-[68px] overflow-hidden rounded-xl border bg-popover shadow-[0_16px_48px_-12px_rgba(0,0,0,0.18)] sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-80"
              >
                <div className="border-b px-4 py-2.5">
                  <span className="text-sm font-semibold">Notifications</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center px-4 py-8 text-center">
                      <BellOff className="h-6 w-6 text-muted-foreground/40" />
                      <p className="mt-2 text-sm text-muted-foreground">All caught up 🎉</p>
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          navigate(n.to);
                          setOpen(null);
                        }}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{n.title}</span>
                          <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                        </span>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === "profile" ? null : "profile")}
            aria-label="Profile menu"
            className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-4 text-xs font-semibold text-primary-foreground shadow-sm ring-2 ring-transparent transition-all duration-150 hover:ring-primary/30 active:scale-95"
          >
            {initials}
          </button>
          <AnimatePresence>
            {open === "profile" && (
              <motion.div
                {...pop}
                className="fixed left-3 right-3 top-[68px] overflow-hidden rounded-xl border bg-popover p-1.5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.18)] sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-56"
              >
                <div className="border-b px-3 py-2.5">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="pt-1">
                  {[
                    { icon: User, label: "Profile" },
                    { icon: Settings, label: "Settings" },
                  ].map(({ icon: Icon, label }) => (
                    <Link
                      key={label}
                      to="/settings"
                      onClick={() => setOpen(null)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => void logout()}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
