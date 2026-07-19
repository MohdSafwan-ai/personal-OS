import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import { Note } from "./note.model.js";

const putNoteSchema = z.object({ content: z.string().max(20_000) });

async function getNote(req: Request, res: Response): Promise<void> {
  const note = await Note.findOne({ userId: req.userId });
  res.json({ content: note?.content ?? "", updatedAt: note?.updatedAt ?? null });
}

async function putNote(req: Request, res: Response): Promise<void> {
  const { content } = req.body as z.infer<typeof putNoteSchema>;
  const note = await Note.findOneAndUpdate(
    { userId: req.userId },
    { $set: { content } },
    { new: true, upsert: true }
  );
  res.json({ content: note.content, updatedAt: note.updatedAt });
}

export const notesRouter = Router();

notesRouter.use(requireAuth);
notesRouter.get("/", asyncHandler(getNote));
notesRouter.put("/", validate({ body: putNoteSchema }), asyncHandler(putNote));
