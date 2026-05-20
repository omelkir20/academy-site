import { Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["student", "instructor", "admin"]).default("student"),
});

const UpdateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
  role: z.enum(["student", "instructor", "admin"]).optional(),
  isActive: z.boolean().optional(),
});

export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string || "1", 10);
  const limit = parseInt(req.query.limit as string || "20", 10);
  const search = req.query.search as string | undefined;

  let query: Record<string, unknown> = {};
  if (search) {
    query = {
      $or: [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    };
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-passwordHash")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({ users, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function getUserById(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json(user);
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password, firstName, lastName, role } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Email déjà utilisé" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, firstName, lastName, role });
  const { passwordHash: _, ...safe } = user.toObject();
  res.status(201).json(safe);
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  const parsed = UpdateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const user = await User.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).select("-passwordHash");
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json(user);
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-passwordHash");
  if (!user) {
    res.status(404).json({ error: "Utilisateur introuvable" });
    return;
  }
  res.json({ message: "Compte désactivé", user });
}

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  const [total, students, instructors, admins, active] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "instructor" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isActive: true }),
  ]);
  res.json({ total, students, instructors, admins, active, inactive: total - active });
}
