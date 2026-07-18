import { createHash, randomBytes, randomUUID } from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Types } from "mongoose";
import { env } from "../../config/env.js";
import { RefreshToken } from "./refresh-token.model.js";

export function signAccessToken(userId: string): string {
  return jwt.sign({}, env.JWT_ACCESS_SECRET, {
    subject: userId,
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as SignOptions);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function refreshExpiry(): Date {
  return new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

/** Issue a brand-new refresh token starting a new family (login/register). */
export async function issueRefreshToken(
  userId: Types.ObjectId | string
): Promise<string> {
  const token = randomBytes(64).toString("hex");
  await RefreshToken.create({
    userId,
    tokenHash: hashToken(token),
    familyId: randomUUID(),
    expiresAt: refreshExpiry(),
  });
  return token;
}

/**
 * Rotate a refresh token. Returns the new token and its userId, or null if
 * the presented token is invalid/expired. Reuse of an already-rotated token
 * revokes the entire family (stolen-token defense).
 */
export async function rotateRefreshToken(
  presented: string
): Promise<{ token: string; userId: string } | null> {
  const presentedHash = hashToken(presented);
  const existing = await RefreshToken.findOne({ tokenHash: presentedHash });

  if (!existing || existing.expiresAt < new Date()) return null;

  if (existing.revokedAt) {
    // Token reuse — someone replayed an old token. Kill the whole family.
    await RefreshToken.updateMany(
      { familyId: existing.familyId, revokedAt: null },
      { revokedAt: new Date() }
    );
    return null;
  }

  const next = randomBytes(64).toString("hex");
  const nextHash = hashToken(next);
  await RefreshToken.create({
    userId: existing.userId,
    tokenHash: nextHash,
    familyId: existing.familyId,
    expiresAt: refreshExpiry(),
  });
  existing.revokedAt = new Date();
  existing.replacedByHash = nextHash;
  await existing.save();

  return { token: next, userId: existing.userId.toString() };
}

/** Revoke the family of the presented token (logout). Safe on invalid input. */
export async function revokeRefreshFamily(presented: string): Promise<void> {
  const existing = await RefreshToken.findOne({
    tokenHash: hashToken(presented),
  });
  if (!existing) return;
  await RefreshToken.updateMany(
    { familyId: existing.familyId, revokedAt: null },
    { revokedAt: new Date() }
  );
}
