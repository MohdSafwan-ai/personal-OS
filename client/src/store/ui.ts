import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UiState {
  theme: Theme;
  sidebarCollapsed: boolean;
  /** Mobile-only overlay drawer; intentionally not persisted meaningfully. */
  mobileNavOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: "system",
      sidebarCollapsed: false,
      mobileNavOpen: false,
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: "personal-os-ui",
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);

// Follow OS changes while in "system" mode.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  const { theme } = useUiStore.getState();
  if (theme === "system") applyTheme(theme);
});
