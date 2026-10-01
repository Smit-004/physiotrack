import Log, { BODY_PARTS } from "../models/Log.js";
import { computeStats, toKey } from "../services/stats.service.js";

export async function getStats(req, res) {
  // Frontend apni local date bhejta hai (?today=2026-10-02), taaki timezone ka jhanjhat na ho
  const today = /^\d{4}-\d{2}-\d{2}$/.test(req.query.today || "")
    ? req.query.today
    : toKey(Date.now());

  const filter = { user: req.user.id };
  if (BODY_PARTS.includes(req.query.bodyPart)) filter.bodyPart = req.query.bodyPart;

  const logs = await Log.find(filter).select("date pain -_id").lean();
  res.json(computeStats(logs, today));
}