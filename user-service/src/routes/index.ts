import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { listUsers, getUserById, createUser, updateUser, deleteUser, getStats } from "../controllers/admin.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authenticate, me);

// Profile
router.get("/users/profile", authenticate, getProfile);
router.put("/users/profile", authenticate, updateProfile);

// Admin — user management
router.get("/admin/stats", authenticate, requireRole("admin"), getStats);
router.get("/admin/users", authenticate, requireRole("admin"), listUsers);
router.post("/admin/users", authenticate, requireRole("admin"), createUser);
router.get("/admin/users/:id", authenticate, requireRole("admin"), getUserById);
router.put("/admin/users/:id", authenticate, requireRole("admin"), updateUser);
router.delete("/admin/users/:id", authenticate, requireRole("admin"), deleteUser);

export default router;
