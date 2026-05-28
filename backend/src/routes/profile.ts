import { Router } from "express";
import QRCode from "qrcode";
import { asyncRoute } from "../asyncRoute.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { config } from "../config.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Link } from "../models/Link.js";
import { User } from "../models/User.js";
import { profileSchema } from "../validators.js";

export const profileRouter = Router();

profileRouter.get("/", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  return res.json({ success: true, user });
}));

profileRouter.put("/", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message });

  const user = await User.findByIdAndUpdate(req.userId, parsed.data, { new: true });
  return res.json({ success: true, user });
}));

profileRouter.get("/qr", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  const username = String(user.username);
  const profileUrl = `${config.CLIENT_ORIGIN.replace(/\/$/, "")}/${username}`;
  const trackingUrl = `${req.protocol}://${req.get("host")}/api/profile/public/${username}/qr-scan`;
  const qrDataUrl = await QRCode.toDataURL(trackingUrl, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: {
      dark: user.accentColor || "#0f172a",
      light: "#ffffff"
    }
  });

  return res.json({ success: true, profileUrl, trackingUrl, qrDataUrl });
}));

profileRouter.get("/public/:username/qr-scan", asyncRoute(async (req, res) => {
  const username = String(req.params.username ?? "").toLowerCase();
  const user = await User.findOne({ username });
  const redirectUrl = `${config.CLIENT_ORIGIN.replace(/\/$/, "")}/${username}`;

  if (user) {
    await AnalyticsEvent.create({
      userId: user._id,
      type: "qr_scan",
      referrer: req.get("referer") ?? "direct",
      userAgent: req.get("user-agent")
    });
  }

  return res.redirect(302, redirectUrl);
}));

profileRouter.get("/public/:username", asyncRoute(async (req, res) => {
  const username = String(req.params.username ?? "").toLowerCase();
  const user = await User.findOne({ username });
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
}));
