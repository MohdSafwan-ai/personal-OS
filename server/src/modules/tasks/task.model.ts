import { Schema, model, type Document, type Types } from "mongoose";

export interface TaskDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  title: string;
  done: boolean;
  /** Local-day key the task belongs to, e.g. "2026-07-18". */
  day: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 300 },
    done: { type: Boolean, default: false },
    day: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, day: 1 });

export function toPublicTask(task: TaskDocument) {
  return {
    id: task._id.toString(),
    title: task.title,
    done: task.done,
    day: task.day,
    createdAt: task.createdAt,
  };
}

export const Task = model<TaskDocument>("Task", taskSchema);
