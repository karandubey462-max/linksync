import { Router } from "express";
import mongoose from "mongoose";
import { asyncRoute } from "../asyncRoute.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Link } from "../models/Link.js";
import { linkSchema } from "../validators.js";

export const linksRouter = Router();

linksRouter.get("/", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const links = await Link.find({ userId: req.userId }).sort({ pinned: -1, order: 1, createdAt: 1 });
  return res.json({ success: true, links });
}));

linksRouter.post("/", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const parsed = linkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const count = await Link.countDocuments({ userId: req.userId });
  const link = await Link.create({
    ...parsed.data,
    userId: req.userId,
    order: parsed.data.order ?? count + 1,
    scheduledAt: parsed.data.scheduledAt || undefined,
    expiresAt: parsed.data.expiresAt || undefined
  });

  return res.status(201).json({ success: true, link });
}));

linksRouter.put("/:id", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid link id." });
  const parsed = linkSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const link = await Link.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    {
      ...parsed.data,
      scheduledAt: parsed.data.scheduledAt || undefined,
      expiresAt: parsed.data.expiresAt || undefined
    },
    { new: true }
  );

  if (!link) return res.status(404).json({ success: false, message: "Link not found." });
  return res.json({ success: true, link });
}));

linksRouter.delete("/:id", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid link id." });
  await Link.deleteOne({ _id: req.params.id, userId: req.userId });
  return res.json({ success: true });
}));

linksRouter.patch("/:id/click", asyncRoute(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid link id." });
  const link = await Link.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
  if (!link) return res.status(404).json({ success: false, message: "Link not found." });
  await AnalyticsEvent.create({
    userId: link.userId,
    linkId: link._id,
    type: "link_click",
    referrer: req.get("referer") ?? "direct",
    userAgent: req.get("user-agent")
  });
  return res.json({ success: true });
}));

linksRouter.patch("/reset-clicks", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  await Link.updateMany({ userId: req.userId }, { clicks: 0 });
  return res.json({ success: true });
}));
