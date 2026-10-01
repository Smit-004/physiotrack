import { Router } from "express";
import { authUser } from "../middleware/auth.js";
import { getStats } from "../controllers/stats.controller.js";

const router = Router();

router.get("/", authUser, getStats);

export default router;