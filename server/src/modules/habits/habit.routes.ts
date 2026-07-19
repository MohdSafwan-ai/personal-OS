import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  checkinHabit,
  createHabit,
  deleteHabit,
  listHabits,
  updateHabit,
} from "./habit.controller.js";
import {
  checkinSchema,
  createHabitSchema,
  idParamsSchema,
  updateHabitSchema,
} from "./habit.validation.js";

export const habitsRouter = Router();

habitsRouter.use(requireAuth);
habitsRouter.get("/", asyncHandler(listHabits));
habitsRouter.post("/", validate({ body: createHabitSchema }), asyncHandler(createHabit));
habitsRouter.patch(
  "/:id",
  validate({ params: idParamsSchema, body: updateHabitSchema }),
  asyncHandler(updateHabit)
);
habitsRouter.post(
  "/:id/checkin",
  validate({ params: idParamsSchema, body: checkinSchema }),
  asyncHandler(checkinHabit)
);
habitsRouter.delete("/:id", validate({ params: idParamsSchema }), asyncHandler(deleteHabit));
