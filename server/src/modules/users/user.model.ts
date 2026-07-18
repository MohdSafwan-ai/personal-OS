import { Schema, model, type Document, type Types } from "mongoose";

export interface PomodoroSettings {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  longBreakEvery: number;
}

export interface UserDocument extends Document<Types.ObjectId> {
  email: string;
  passwordHash: string;
  name: string;
  settings: {
    theme: "light" | "dark" | "system";
    pomodoro: PomodoroSettings;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      pomodoro: {
        focusMin: { type: Number, default: 25, min: 1, max: 180 },
        shortBreakMin: { type: Number, default: 5, min: 1, max: 60 },
        longBreakMin: { type: Number, default: 15, min: 1, max: 60 },
        longBreakEvery: { type: Number, default: 4, min: 2, max: 12 },
      },
    },
  },
  { timestamps: true }
);

export function toPublicUser(user: UserDocument) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    settings: user.settings,
    createdAt: user.createdAt,
  };
}

export const User = model<UserDocument>("User", userSchema);
