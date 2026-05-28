import { Router } from "express";
import mongoose from "mongoose";
import { asyncRoute } from "../asyncRoute.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Link } from "../models/Link.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, asyncRoute(async (req: AuthenticatedRequest, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  const [clicks, links, events] = await Promise.all([
    Link.aggregate([{ $match: { userId } }, { $group: { _id: null, clicks: { $sum: "$clicks" } } }]),
    Link.find({ userId: req.userId }).sort({ clicks: -1 }).limit(5),
    AnalyticsEvent.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(250)
  ]);

  return res.json({
    success: true,
    summary: {
      clicks: clicks[0]?.clicks ?? 0,
      topLinks: links,
      recentEvents: events
    }
  });
}));
