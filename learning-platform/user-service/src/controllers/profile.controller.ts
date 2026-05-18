import { Response } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

const UpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
});

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user?.sub).select("-passwordHash");
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json(user);
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const user = await User.findByIdAndUpdate(req.user?.sub, parsed.data, { new: true }).select("-passwordHash");
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json(user);
}

export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "20", 10);
  const users = await User.find().select("-passwordHash").skip((page - 1) * limit).limit(limit);
  res.json(users);
}
