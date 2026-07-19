import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { GuestRoute, ProtectedRoute } from "@/components/layout/protected-route";
import { Toaster, toast } from "@/components/ui/toast";
import { ApiRequestError } from "@/lib/api";
import AuthPage from "@/pages/auth";
import CalendarPage from "@/pages/calendar";
import DashboardPage from "@/pages/dashboard";
import FocusPage from "@/pages/focus";
import HabitsPage from "@/pages/habits";
import NotesPage from "@/pages/notes";
import SettingsPage from "@/pages/settings";
import TasksPage from "@/pages/tasks";
import { useAuthStore } from "@/store/auth";

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
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
