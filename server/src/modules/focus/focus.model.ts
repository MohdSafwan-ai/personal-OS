import { Schema, model, type Document, type Types } from "mongoose";

export interface FocusSessionDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  /** Local-day key the session counts toward. */
  day: string;
  seconds: number;
  createdAt: Date;
}

const focusSessionSchema = new Schema<FocusSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    day: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    seconds: { type: Number, required: true, min: 1, max: 24 * 3600 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

focusSessionSchema.index({ userId: 1, day: 1 });

export const FocusSession = model<FocusSessionDocument>("FocusSession", focusSessionSchema);
