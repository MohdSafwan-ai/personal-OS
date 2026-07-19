import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import { focusSummary, logFocus } from "./focus.controller.js";
import { logFocusSchema, summaryQuerySchema } from "./focus.validation.js";

export const focusRouter = Router();

focusRouter.use(requireAuth);
focusRouter.post("/", validate({ body: logFocusSchema }), asyncHandler(logFocus));
focusRouter.get("/summary", validate({ query: summaryQuerySchema }), asyncHandler(focusSummary));
