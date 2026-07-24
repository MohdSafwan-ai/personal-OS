import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useActivityStore } from "@/store/dashboard";
import { Sidebar, MobileDrawer } from "./sidebar";
import { Topbar } from "./topbar";

export function AppLayout() {
  const location = useLocation();
  const userId = useAuthStore((state) => state.user?.id);
  const initializeActivityOwner = useActivityStore((state) => state.initializeOwner);

  useEffect(() => {
    if (userId) initializeActivityOwner(userId);
  }, [initializeActivityOwner, userId]);

  return (
    <div className="flex h-dvh min-h-[480px] overflow-hidden bg-background dark:bg-transparent">
      <Sidebar />
      <MobileDrawer />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="touch-scroll flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-[1344px] px-3 py-4 sm:px-5 md:px-7 md:py-7 xl:px-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Link
        to="/tasks"
        aria-label="Quickly add a task"
        className="fixed bottom-4 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-[#8b8cf8] text-primary-foreground shadow-[0_6px_24px_rgba(91,92,235,0.4)] transition-transform hover:scale-105 active:scale-95 dark:to-primary dark:shadow-[0_0_28px_hsl(var(--primary)/0.28)] sm:bottom-6 sm:right-6 md:h-[52px] md:w-[52px]"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}
