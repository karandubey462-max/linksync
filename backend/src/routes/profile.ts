import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { Link } from "../models/Link.js";
import { User } from "../models/User.js";
import { profileSchema } from "../validators.js";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  return res.json({ success: true, user });
});

profileRouter.put("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const user = await User.findByIdAndUpdate(req.userId, parsed.data, { new: true });
  return res.json({ success: true, user });
});

profileRouter.get("/public/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) return res.status(404).json({ success: false, message: "Profile not found." });

  const now = new Date();
  const links = await Link.find({
    userId: user._id,
    active: true,
    $and: [
      { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] },
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }
    ]
  }).sort({ pinned: -1, order: 1, createdAt: 1 });

  return res.json({ success: true, profile: user, links });
});
