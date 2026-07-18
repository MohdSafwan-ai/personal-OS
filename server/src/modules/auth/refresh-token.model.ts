import { Schema, model, type Document, type Types } from "mongoose";

export interface RefreshTokenDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  tokenHash: string;
  familyId: string;
  revokedAt: Date | null;
  replacedByHash: string | null;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL: Mongo removes documents once expiresAt passes.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);
