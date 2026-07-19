import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  getMe,
  login,
  logout,
  refresh,
  register,
  updateMe,
} from "./auth.controller.js";
import {
  loginSchema,
  registerSchema,
  updateMeSchema,
} from "./auth.validation.js";

/** Brute-force protection on credential endpoints. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts — try again in a few minutes" },
});

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate({ body: registerSchema }), asyncHandler(register));
authRouter.post("/login", authLimiter, validate({ body: loginSchema }), asyncHandler(login));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(getMe));
authRouter.patch("/me", requireAuth, validate({ body: updateMeSchema }), asyncHandler(updateMe));
