import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { isDatabaseConnected } from "../db.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Link } from "../models/Link.js";
import { fallbackStore } from "../store.js";
import { linkSchema } from "../validators.js";

export const linksRouter = Router();

linksRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!isDatabaseConnected()) {
    const links = await fallbackStore.listLinks(req.userId ?? "");
    return res.json({ success: true, links, storage: "fallback" });
  }

  const links = await Link.find({ userId: req.userId }).sort({ pinned: -1, order: 1, createdAt: 1 });
  return res.json({ success: true, links });
});

linksRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = linkSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  if (!isDatabaseConnected()) {
    const link = await fallbackStore.createLink(req.userId ?? "", parsed.data);
    return res.status(201).json({ success: true, link, storage: "fallback" });
  }

  const count = await Link.countDocuments({ userId: req.userId });
  const link = await Link.create({
    ...parsed.data,
    userId: req.userId,
    order: parsed.data.order ?? count + 1,
    scheduledAt: parsed.data.scheduledAt || undefined,
    expiresAt: parsed.data.expiresAt || undefined
  });

  return res.status(201).json({ success: true, link });
});

linksRouter.put("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = linkSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  if (!isDatabaseConnected()) {
    const link = await fallbackStore.updateLink(req.userId ?? "", String(req.params.id), parsed.data);
    if (!link) return res.status(404).json({ success: false, message: "Link not found." });
    return res.json({ success: true, link, storage: "fallback" });
  }

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
});

linksRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!isDatabaseConnected()) {
    await fallbackStore.deleteLink(req.userId ?? "", String(req.params.id));
    return res.json({ success: true, storage: "fallback" });
  }

  await Link.deleteOne({ _id: req.params.id, userId: req.userId });
  return res.json({ success: true });
});

linksRouter.patch("/:id/click", async (req, res) => {
  if (!isDatabaseConnected()) {
    const link = await fallbackStore.clickLink(req.params.id);
    if (!link) return res.status(404).json({ success: false, message: "Link not found." });
    return res.json({ success: true, storage: "fallback" });
  }

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
});

linksRouter.patch("/reset-clicks", requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!isDatabaseConnected()) {
    await fallbackStore.resetClicks(req.userId ?? "");
    return res.json({ success: true, storage: "fallback" });
  }

  await Link.updateMany({ userId: req.userId }, { clicks: 0 });
  return res.json({ success: true });
});
