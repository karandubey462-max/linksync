import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Link } from "../models/Link.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, async (req: AuthenticatedRequest, res) => {
  const [clicks, links, events] = await Promise.all([
    Link.aggregate([{ $match: { userId: req.userId } }, { $group: { _id: null, clicks: { $sum: "$clicks" } } }]),
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
});
