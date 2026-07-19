import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import { createTask, deleteTask, listTasks, updateTask } from "./task.controller.js";
import {
  createTaskSchema,
  idParamsSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from "./task.validation.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);
tasksRouter.get("/", validate({ query: listTasksQuerySchema }), asyncHandler(listTasks));
tasksRouter.post("/", validate({ body: createTaskSchema }), asyncHandler(createTask));
tasksRouter.patch(
  "/:id",
  validate({ params: idParamsSchema, body: updateTaskSchema }),
  asyncHandler(updateTask)
);
tasksRouter.delete("/:id", validate({ params: idParamsSchema }), asyncHandler(deleteTask));
