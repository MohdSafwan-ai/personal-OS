import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import type { z } from "zod";
import { env, isProd } from "../../config/env.js";
import { ApiError } from "../../middleware/error-handler.js";
import { toPublicUser, User } from "../users/user.model.js";
import type {
  loginSchema,
  registerSchema,
  updateMeSchema,
} from "./auth.validation.js";
import {
  issueRefreshToken,
  revokeRefreshFamily,
  rotateRefreshToken,
  signAccessToken,
} from "./token.service.js";

const REFRESH_COOKIE = "refreshToken";
const BCRYPT_COST = 12;

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/auth",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body as z.infer<typeof registerSchema>;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const user = await User.create({ email, passwordHash, name });

  const accessToken = signAccessToken(user._id.toString());
  setRefreshCookie(res, await issueRefreshToken(user._id));
  res.status(201).json({ user: toPublicUser(user), accessToken });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = await User.findOne({ email }).select("+passwordHash");
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const accessToken = signAccessToken(user._id.toString());
  setRefreshCookie(res, await issueRefreshToken(user._id));
  res.json({ user: toPublicUser(user), accessToken });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const presented = (req.cookies as Record<string, string>)[REFRESH_COOKIE];
  if (!presented) throw new ApiError(401, "Unauthorized");

  const rotated = await rotateRefreshToken(presented);
  if (!rotated) {
    clearRefreshCookie(res);
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(rotated.userId);
  if (!user) {
    clearRefreshCookie(res);
    throw new ApiError(401, "Unauthorized");
  }

  setRefreshCookie(res, rotated.token);
  res.json({ user: toPublicUser(user), accessToken: signAccessToken(rotated.userId) });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const presented = (req.cookies as Record<string, string>)[REFRESH_COOKIE];
  if (presented) await revokeRefreshFamily(presented);
  clearRefreshCookie(res);
  res.status(204).end();
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(401, "Unauthorized");
  res.json({ user: toPublicUser(user) });
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const body = req.body as z.infer<typeof updateMeSchema>;

  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(401, "Unauthorized");

  if (body.name !== undefined) user.name = body.name;
  if (body.settings?.theme !== undefined) user.settings.theme = body.settings.theme;
  if (body.settings?.pomodoro) {
    Object.assign(user.settings.pomodoro, body.settings.pomodoro);
  }
  await user.save();

  res.json({ user: toPublicUser(user) });
}
