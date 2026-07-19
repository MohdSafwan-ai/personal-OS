import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env, isProd } from "./config/env.js";
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
  // Behind a hosting proxy (Render/Railway/Fly), needed for correct client
  // IPs (rate limiting) and secure cookies.
  if (isProd) app.set("trust proxy", 1);
  app.use(
    helmet({
      // Allow the inline theme-init script and Google Fonts in index.html.
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
          "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
        },
      },
    })
  );
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

  // In production, serve the built client (single-service deploy).
  if (isProd) {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const clientDist = path.resolve(dirname, "../../client/dist");
    app.use(express.static(clientDist));
    // SPA fallback: any non-API GET serves index.html.
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
