import { motion } from "framer-motion";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

/** Full-screen pulse shown while the refresh-cookie session check runs. */
function BootScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid h-16 w-16 place-items-center"
      >
        <img
          src="/flowtrack-mark-512.png"
          alt="Loading FlowTrack"
          className="h-full w-full object-contain"
        />
      </motion.div>
    </div>
  );
}

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const location = useLocation();

  if (initializing) return <BootScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

/** Inverse guard: bounce authenticated users away from login/register. */
export function GuestRoute() {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return <BootScreen />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
