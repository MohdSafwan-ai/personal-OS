import { motion } from "framer-motion";
import { Check, Loader2, Minus, Plus, Monitor, Moon, Sun, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api, type PublicUser } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";

const inputCls = cn(
  "h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none",
  "transition-all duration-200 placeholder:text-muted-foreground",
  "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
);

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

function Stepper({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="grid h-7 w-7 place-items-center rounded-md border text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-16 text-center text-sm font-semibold tabular-nums">
          {value} {unit}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          className="grid h-7 w-7 place-items-center rounded-md border text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const uiTheme = useUiStore((s) => s.theme);
  const setUiTheme = useUiStore((s) => s.setTheme);

  const [name, setName] = useState(user?.name ?? "");
  const [pomodoro, setPomodoro] = useState(
    user?.settings.pomodoro ?? {
      focusMin: 25,
      shortBreakMin: 5,
      longBreakMin: 15,
      longBreakEvery: 4,
    }
  );
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const data = await api<{ user: PublicUser }>("/api/auth/me", {
        method: "PATCH",
        body: {
          name: name.trim(),
          settings: { theme: uiTheme, pomodoro },
        },
      });
      useAuthStore.setState({ user: data.user });
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
    } catch {
      setError("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl font-bold tracking-tight"
      >
        Settings
      </motion.h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Profile, appearance, and Pomodoro preferences.
      </p>

      <form onSubmit={onSave} className="mt-6 space-y-4">
        <Section title="Profile">
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            <User className="mr-1 inline h-3 w-3" /> Display name
          </label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          <p className="mt-3 text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user?.email}</span>
          </p>
        </Section>

        <Section title="Appearance">
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUiTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium",
                  "transition-all duration-150 active:scale-[0.97]",
                  uiTheme === value
                    ? "border-primary/50 bg-primary/[0.07] text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Theme applies instantly and is saved to your account with the button below.
          </p>
        </Section>

        <Section title="Pomodoro">
          <div className="divide-y">
            <Stepper
              label="Focus duration"
              value={pomodoro.focusMin}
              min={1}
              max={180}
              unit="min"
              onChange={(v) => setPomodoro((p) => ({ ...p, focusMin: v }))}
            />
            <Stepper
              label="Short break"
              value={pomodoro.shortBreakMin}
              min={1}
              max={60}
              unit="min"
              onChange={(v) => setPomodoro((p) => ({ ...p, shortBreakMin: v }))}
            />
            <Stepper
              label="Long break"
              value={pomodoro.longBreakMin}
              min={1}
              max={60}
              unit="min"
              onChange={(v) => setPomodoro((p) => ({ ...p, longBreakMin: v }))}
            />
            <Stepper
              label="Long break every"
              value={pomodoro.longBreakEvery}
              min={2}
              max={12}
              unit="sess."
              onChange={(v) => setPomodoro((p) => ({ ...p, longBreakEvery: v }))}
            />
          </div>
        </Section>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || name.trim().length === 0}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm",
              "transition-all duration-150 hover:brightness-110 active:scale-[0.98]",
              "disabled:pointer-events-none disabled:opacity-60"
            )}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : savedTick ? <Check className="h-4 w-4" /> : null}
            {savedTick ? "Saved" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
