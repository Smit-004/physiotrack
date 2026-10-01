import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authUser, getMe);

export default router;