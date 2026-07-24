import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/app-layout";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Tasks from "./pages/tasks";
import Habits from "./pages/habits";
import Focus from "./pages/focus";
import Calendar from "./pages/calendar";
import Notes from "./pages/notes";
import Settings from "./pages/settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
