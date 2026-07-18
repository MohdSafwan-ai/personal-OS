import { Router } from "express";
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

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), asyncHandler(register));
authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(login));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(getMe));
authRouter.patch("/me", requireAuth, validate({ body: updateMeSchema }), asyncHandler(updateMe));
