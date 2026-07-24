import type { Request, Response } from "express";
import type { z } from "zod";
import { ApiError } from "../../middleware/error-handler.js";
import { Task, toPublicTask } from "./task.model.js";
import type {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "./task.validation.js";

export async function listTasks(req: Request, res: Response): Promise<void> {
  const { day, from, to } = req.query as z.infer<typeof listTasksQuerySchema>;
  const filter: Record<string, unknown> = { userId: req.userId };
  if (day) filter.day = day;
  if (from && to) filter.day = { $gte: from, $lte: to };
  const tasks = await Task.find(filter).sort({ createdAt: 1 });
  res.json({ tasks: tasks.map(toPublicTask) });
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const { title, day } = req.body as z.infer<typeof createTaskSchema>;
  const task = await Task.create({ userId: req.userId, title, day });
  res.status(201).json({ task: toPublicTask(task) });
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const updates = req.body as z.infer<typeof updateTaskSchema>;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: updates },
    { new: true }
  );
  if (!task) throw new ApiError(404, "Task not found");
  res.json({ task: toPublicTask(task) });
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!task) throw new ApiError(404, "Task not found");
  res.status(204).end();
}
