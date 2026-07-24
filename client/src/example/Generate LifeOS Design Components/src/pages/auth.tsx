import { useState } from "react";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("alex@lifeos.app");
  const [password, setPassword] = useState("••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAF8",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Left panel — illustration */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #5B5CEB 0%, #7C3AED 100%)",
          padding: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        {[300, 460, 620].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, zIndex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={24} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            LifeOS
          </span>
        </div>

        {/* Stats cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360, zIndex: 1 }}>
          {[
            { label: "Avg productivity boost", value: "+34%", icon: "📈" },
            { label: "Daily habits tracked", value: "12,400+", icon: "✅" },
            { label: "Focus hours logged", value: "2.1M hrs", icon: "⏱️" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>
                  {stat.value}
                </div>
              </div>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
            </div>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 32, textAlign: "center", zIndex: 1, maxWidth: 320 }}>
          Join 48,000+ people who run their entire life on LifeOS — from tasks to habits to deep work.
        </p>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          width: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 48px",
          background: "#FFFFFF",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#18181B", letterSpacing: "-0.02em" }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p style={{ fontSize: 14, color: "#71717A", marginTop: 6 }}>
              {mode === "login"
                ? "Sign in to continue your productivity journey."
                : "Start building better habits and focus."}
            </p>
          </div>

          {/* OAuth */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[
              { icon: <span style={{ fontSize: 16 }}>G</span>, label: "Google" },
              { icon: <span style={{ fontSize: 16 }}>⌘</span>, label: "GitHub" },
            ].map((btn) => (
              <button
                key={btn.label}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#18181B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#A1A1AA" }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#18181B", display: "block", marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1.5px solid #E5E7EB",
                  background: "#FAFAF8",
                  fontSize: 14,
                  color: "#18181B",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#18181B" }}>Password</label>
                {mode === "login" && (
                  <a href="#" style={{ fontSize: 12, color: "#5B5CEB", textDecoration: "none" }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 44px 0 14px",
                    borderRadius: 12,
                    border: "1.5px solid #E5E7EB",
                    background: "#FAFAF8",
                    fontSize: 14,
                    color: "#18181B",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    color: "#A1A1AA",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: "#5B5CEB", width: 15, height: 15 }}
                />
                <span style={{ fontSize: 13, color: "#71717A" }}>Remember me for 30 days</span>
              </label>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                height: 46,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #5B5CEB, #7C3AED)",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(91,92,235,0.35)",
                transition: "opacity 0.15s ease, transform 0.1s ease",
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.92";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#71717A", marginTop: 24 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{
                background: "none",
                border: "none",
                color: "#5B5CEB",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          <p style={{ textAlign: "center", fontSize: 11, color: "#A1A1AA", marginTop: 32 }}>
            By continuing, you agree to our{" "}
            <a href="#" style={{ color: "#71717A" }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "#71717A" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
