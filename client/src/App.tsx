import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { GuestRoute, ProtectedRoute } from "@/components/layout/protected-route";
import { Toaster, toast } from "@/components/ui/toast";
import { ApiRequestError } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const AuthPage = lazy(() => import("@/pages/auth"));
const CalendarPage = lazy(() => import("@/pages/calendar"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const FocusPage = lazy(() => import("@/pages/focus"));
const FlowversePage = lazy(() => import("@/pages/flowverse"));
const HabitsPage = lazy(() => import("@/pages/habits"));
const NotesPage = lazy(() => import("@/pages/notes"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const TasksPage = lazy(() => import("@/pages/tasks"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  // Any failed mutation surfaces as a toast (optimistic updates already roll back).
  mutationCache: new MutationCache({
    onError: (error) => {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Something went wrong — check your connection.";
      toast(message);
    },
  }),
});

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center bg-background">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="login" element={<AuthPage mode="login" />} />
              <Route path="register" element={<AuthPage mode="register" />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="habits" element={<HabitsPage />} />
                <Route path="focus" element={<FocusPage />} />
                <Route path="flowverse" element={<FlowversePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
