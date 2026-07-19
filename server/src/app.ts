import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { focusRouter } from "./modules/focus/focus.routes.js";
import { habitsRouter } from "./modules/habits/habit.routes.js";
import { notesRouter } from "./modules/notes/note.routes.js";
import { tasksRouter } from "./modules/tasks/task.routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "200kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Feature routers are mounted here as modules are built.
  app.use("/api/auth", authRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/habits", habitsRouter);
  app.use("/api/focus", focusRouter);
  app.use("/api/notes", notesRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
