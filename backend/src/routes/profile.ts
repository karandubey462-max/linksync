import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { isDatabaseConnected } from "../db.js";
import { Link } from "../models/Link.js";
import { User } from "../models/User.js";
import { fallbackStore } from "../store.js";
import { profileSchema } from "../validators.js";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!isDatabaseConnected()) {
    const user = await fallbackStore.findUserById(req.userId ?? "");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user: fallbackStore.publicUser(user), storage: "fallback" });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  return res.json({ success: true, user });
});

profileRouter.put("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  if (!isDatabaseConnected()) {
    const user = await fallbackStore.updateUser(req.userId ?? "", parsed.data);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user: fallbackStore.publicUser(user), storage: "fallback" });
  }

  const user = await User.findByIdAndUpdate(req.userId, parsed.data, { new: true });
  return res.json({ success: true, user });
});

profileRouter.get("/public/:username", async (req, res) => {
  if (!isDatabaseConnected()) {
    const user = await fallbackStore.findUserByUsername(req.params.username);
    if (!user) return res.status(404).json({ success: false, message: "Profile not found." });
    const links = (await fallbackStore.listLinks(user._id)).filter((link) => link.active);
    return res.json({ success: true, profile: fallbackStore.publicUser(user), links, storage: "fallback" });
  }

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
