import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { getProfile, updateProfile, listUsers } from "../controllers/profile.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authenticate, me);

// Profile
router.get("/users/profile", authenticate, getProfile);
router.put("/users/profile", authenticate, updateProfile);

// Admin
router.get("/users", authenticate, requireRole("admin"), listUsers);

export default router;
