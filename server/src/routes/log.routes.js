import { Router } from "express";
import { authUser } from "../middleware/auth.js";
import { createLog, getLogs, updateLog, deleteLog } from "../controllers/log.controller.js";

const router = Router();

router.use(authUser); // is file ke saare routes protected hain

router.post("/", createLog);
router.get("/", getLogs);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;