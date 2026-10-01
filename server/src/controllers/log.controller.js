import mongoose from "mongoose";
import { z } from "zod";
import Log, { BODY_PARTS } from "../models/Log.js";

const logSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  bodyPart: z.enum(BODY_PARTS),
  exercise: z.string().min(2).max(80),
  durationMin: z.number().int().min(1).max(300),
  pain: z.number().int().min(1).max(10),
  notes: z.string().max(300).optional(),
});

// Galat id aaye to crash ki jagah 400 bhejte hain
function badId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid id" });
    return true;
  }
  return false;
}

export async function createLog(req, res) {
  const parsed = logSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }
  const log = await Log.create({
    ...parsed.data,
    date: new Date(parsed.data.date),
    user: req.user.id, // hamesha token se, body se kabhi nahi
  });
  res.status(201).json({ log });
}

export async function getLogs(req, res) {
  const filter = { user: req.user.id };
  if (BODY_PARTS.includes(req.query.bodyPart)) filter.bodyPart = req.query.bodyPart;

  const logs = await Log.find(filter).sort({ date: -1, createdAt: -1 });
  res.json({ logs });
}

export async function updateLog(req, res) {
  if (badId(req.params.id, res)) return;
  const parsed = logSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
  }
  // _id AUR user dono match hone chahiye, tabhi dusre ka log touch nahi hoga
  const log = await Log.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { ...parsed.data, date: new Date(parsed.data.date) },
    { new: true, runValidators: true }
  );
  if (!log) return res.status(404).json({ message: "Log not found" });
  res.json({ log });
}

export async function deleteLog(req, res) {
  if (badId(req.params.id, res)) return;
  const log = await Log.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!log) return res.status(404).json({ message: "Log not found" });
  res.json({ message: "Log deleted" });
}