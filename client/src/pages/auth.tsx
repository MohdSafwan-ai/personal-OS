import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

type Mode = "login" | "register";

const inputCls = cn(
  "h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none",
  "transition-all duration-200 placeholder:text-muted-foreground",
  "focus:border-ring focus:bg-background focus:shadow-[0_0_0_3px_hsl(var(--ring)/0.15)]"
);

export default function AuthPage({ mode }: { mode: Mode }) {
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (isRegister && name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Something went wrong. Is the server running?"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/flowtrack-mark-512.png"
            alt="FlowTrack"
            className="h-16 w-16 object-contain"
          />
          <span className="mt-1 text-lg font-extrabold tracking-[-0.02em]">FlowTrack</span>
          <h1 className="mt-4 text-xl font-bold tracking-tight">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRegister
              ? "Track. Focus. Grow. with FlowTrack"
              : "Sign in to your FlowTrack workspace"}
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.1)]"
        >
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputCls}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? "8+ characters" : "Your password"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className={cn(inputCls, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm",
                "transition-all duration-150 hover:brightness-110 active:scale-[0.98]",
                "disabled:pointer-events-none disabled:opacity-60"
              )}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isRegister ? "Create account" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account? " : "New to FlowTrack? "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="font-medium text-primary transition-colors hover:underline"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
