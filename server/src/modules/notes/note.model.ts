import { Schema, model, type Document, type Types } from "mongoose";

/** One quick-notes document per user (upserted). */
export interface NoteDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  content: string;
  updatedAt: Date;
}

const noteSchema = new Schema<NoteDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    content: { type: String, default: "", maxlength: 20_000 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Note = model<NoteDocument>("Note", noteSchema);
