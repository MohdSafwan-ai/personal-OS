import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError } from "zod";
import { isProd } from "../config/env.js";

/** Operational error with an HTTP status. Throw from controllers/services. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Express 4 doesn't catch async rejections — wrap every async controller. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }

  if (err instanceof ZodError) {
    res
      .status(400)
      .json({ error: "Validation failed", details: err.flatten().fieldErrors });
    return;
  }

  // Mongoose invalid ObjectId etc.
  if (err instanceof Error && err.name === "CastError") {
    res.status(400).json({ error: "Invalid identifier" });
    return;
  }

  // Mongo duplicate key
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === 11000
  ) {
    res.status(409).json({ error: "Resource already exists" });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: isProd ? "Internal server error" : String(err),
  });
}
