import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Link,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Camera,
} from "lucide-react";

const SECTIONS = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "privacy", icon: Shield, label: "Privacy" },
  { id: "integrations", icon: Link, label: "Integrations" },
  { id: "data", icon: Download, label: "Data" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: value ? "#5B5CEB" : "#E5E7EB",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#FFFFFF",
          transition: "left 0.2s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        padding: "16px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#18181B" }}>{label}</div>
        {description && <div style={{ fontSize: 13, color: "#71717A", marginTop: 2 }}>{description}</div>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@lifeos.app");
  const [bio, setBio] = useState("Product designer & maker. Building LifeOS to optimize my days.");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [notifs, setNotifs] = useState({ daily: true, habits: true, focus: false, weekly: true, email: false });
  const [privacy, setPrivacy] = useState({ analytics: true, crashReports: true, publicProfile: false });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", gap: 28 }}>
      {/* Sidebar nav */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#FFFFFF",
          borderRadius: 18,
          padding: "12px",
          border: "1px solid #E5E7EB",
          height: "fit-content",
          position: "sticky",
          top: 28,
        }}
      >
        {SECTIONS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: section === id ? "#EEEEFF" : "transparent",
              color: section === id ? "#5B5CEB" : "#71717A",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E5E7EB", padding: "28px 32px" }}>
          {section === "profile" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Profile</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Manage your personal information.</p>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #a78bfa, #5B5CEB)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#FFFFFF",
                    }}
                  >
                    AM
                  </div>
                  <button
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#5B5CEB",
                      border: "2px solid #FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera size={11} color="#FFFFFF" />
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#18181B" }}>Alex Morgan</div>
                  <div style={{ fontSize: 13, color: "#71717A" }}>alex@lifeos.app</div>
                  <button style={{ fontSize: 12, color: "#5B5CEB", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontWeight: 600 }}>
                    Change avatar
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#18181B", display: "block", marginBottom: 6 }}>Full name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 14,
                      color: "#18181B",
                      outline: "none",
                      background: "#FAFAF8",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#18181B", display: "block", marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 14,
                      color: "#18181B",
                      outline: "none",
                      background: "#FAFAF8",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#18181B", display: "block", marginBottom: 6 }}>Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 14,
                      color: "#18181B",
                      outline: "none",
                      background: "#FAFAF8",
                      fontFamily: "inherit",
                      resize: "none",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {section === "appearance" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Appearance</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Customize how LifeOS looks.</p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#18181B", marginBottom: 12 }}>Theme</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: `2px solid ${theme === t ? "#5B5CEB" : "#E5E7EB"}`,
                        background: theme === t ? "#EEEEFF" : "#FAFAF8",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme === t ? "#5B5CEB" : "#71717A", textTransform: "capitalize" }}>
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <SettingRow label="Compact mode" description="Reduce spacing for denser layouts">
                <Toggle value={false} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Animations" description="Enable smooth transitions">
                <Toggle value={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Language" description="Interface language">
                <select style={{ height: 36, padding: "0 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, background: "#FAFAF8", outline: "none" }}>
                  <option>English (US)</option>
                  <option>Español</option>
                  <option>Français</option>
                </select>
              </SettingRow>
            </>
          )}

          {section === "notifications" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Notifications</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Control when and how you get notified.</p>

              <SettingRow label="Daily reminder" description="Get a morning overview each day at 8 AM">
                <Toggle value={notifs.daily} onChange={(v) => setNotifs((p) => ({ ...p, daily: v }))} />
              </SettingRow>
              <SettingRow label="Habit reminders" description="Nudges when you haven't logged habits">
                <Toggle value={notifs.habits} onChange={(v) => setNotifs((p) => ({ ...p, habits: v }))} />
              </SettingRow>
              <SettingRow label="Focus session alerts" description="Get notified when a session ends">
                <Toggle value={notifs.focus} onChange={(v) => setNotifs((p) => ({ ...p, focus: v }))} />
              </SettingRow>
              <SettingRow label="Weekly report" description="Summary of your week every Sunday">
                <Toggle value={notifs.weekly} onChange={(v) => setNotifs((p) => ({ ...p, weekly: v }))} />
              </SettingRow>
              <SettingRow label="Email notifications" description="Receive important updates via email">
                <Toggle value={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} />
              </SettingRow>
            </>
          )}

          {section === "privacy" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Privacy</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Manage your data and privacy settings.</p>

              <SettingRow label="Usage analytics" description="Help us improve with anonymous usage data">
                <Toggle value={privacy.analytics} onChange={(v) => setPrivacy((p) => ({ ...p, analytics: v }))} />
              </SettingRow>
              <SettingRow label="Crash reports" description="Automatically send crash logs">
                <Toggle value={privacy.crashReports} onChange={(v) => setPrivacy((p) => ({ ...p, crashReports: v }))} />
              </SettingRow>
              <SettingRow label="Public profile" description="Allow others to see your profile">
                <Toggle value={privacy.publicProfile} onChange={(v) => setPrivacy((p) => ({ ...p, publicProfile: v }))} />
              </SettingRow>
            </>
          )}

          {section === "integrations" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Integrations</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Connect LifeOS with your other tools.</p>

              {[
                { name: "Google Calendar", icon: "📅", connected: true, desc: "Sync events bidirectionally" },
                { name: "Notion", icon: "📝", connected: false, desc: "Import notes and databases" },
                { name: "Slack", icon: "💬", connected: true, desc: "Daily standup summaries" },
                { name: "GitHub", icon: "🐙", connected: false, desc: "Track commits as tasks" },
                { name: "Apple Health", icon: "❤️", connected: false, desc: "Sync fitness and sleep data" },
              ].map((app) => (
                <div
                  key={app.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom: "1px solid #F3F4F6",
                  }}
                >
                  <div style={{ fontSize: 28 }}>{app.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#18181B" }}>{app.name}</div>
                    <div style={{ fontSize: 12, color: "#71717A" }}>{app.desc}</div>
                  </div>
                  <button
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: `1px solid ${app.connected ? "#22C55E" : "#E5E7EB"}`,
                      background: app.connected ? "#DCFCE7" : "#FFFFFF",
                      color: app.connected ? "#15803D" : "#71717A",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {app.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </>
          )}

          {section === "data" && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181B", marginBottom: 6, letterSpacing: "-0.02em" }}>Data</h2>
              <p style={{ fontSize: 14, color: "#71717A", marginBottom: 24 }}>Export, import, or delete your data.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    background: "#FAFAF8",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Download size={18} color="#15803D" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#18181B" }}>Export all data</div>
                    <div style={{ fontSize: 12, color: "#71717A" }}>Download a copy of all your data as JSON or CSV</div>
                  </div>
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    background: "#FAFAF8",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F4F4F5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEEEFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Upload size={18} color="#5B5CEB" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#18181B" }}>Import data</div>
                    <div style={{ fontSize: 12, color: "#71717A" }}>Import from Notion, Todoist, or LifeOS backup</div>
                  </div>
                </button>
              </div>

              <div
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: "1.5px solid #FCA5A5",
                  background: "#FEF2F2",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>Danger Zone</div>
                    <div style={{ fontSize: 13, color: "#EF4444", marginTop: 2 }}>
                      These actions are permanent and cannot be undone.
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1.5px solid #EF4444",
                    background: "transparent",
                    color: "#EF4444",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
                >
                  Delete account
                </button>
              </div>
            </>
          )}

          {/* Save button */}
          {section !== "data" && section !== "integrations" && (
            <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "10px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: "#5B5CEB",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 8px rgba(91,92,235,0.3)",
                  transition: "opacity 0.15s ease",
                }}
              >
                {saved ? <><Check size={15} /> Saved!</> : "Save changes"}
              </button>
              <button
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  background: "#FFFFFF",
                  color: "#71717A",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
