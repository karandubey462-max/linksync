import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { asyncRoute } from "../asyncRoute.js";
import { User } from "../models/User.js";
import { loginSchema, signupSchema } from "../validators.js";

export const authRouter = Router();

authRouter.post("/signup", asyncRoute(async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const existing = await User.findOne({ $or: [{ email: parsed.data.email }, { username: parsed.data.username }] });
  if (existing) return res.status(409).json({ success: false, message: "Email or username is already taken." });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ ...parsed.data, passwordHash });
  const token = jwt.sign({ userId: user._id.toString() }, config.JWT_SECRET, { expiresIn: "14d" });

  return res.status(201).json({ success: true, token, user });
}));

authRouter.post("/login", asyncRoute(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const user = await User.findOne({ email: parsed.data.email });
  if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: "Invalid email or password." });

  const token = jwt.sign({ userId: user._id.toString() }, config.JWT_SECRET, { expiresIn: "14d" });
  return res.json({ success: true, token, user });
}));
