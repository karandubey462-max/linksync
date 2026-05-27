import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const aiRouter = Router();

aiRouter.post("/suggestions", requireAuth, async (req, res) => {
  const links: Array<{ title: string; clicks?: number }> = Array.isArray(req.body.links) ? req.body.links : [];
  const topLink = [...links].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))[0];

  return res.json({
    success: true,
    bio: "I help my audience discover my best work, offers, and updates from one polished creator profile.",
    suggestions: [
      {
        title: topLink ? `Keep "${topLink.title}" above the fold` : "Add a primary link",
        body: "Lead with the highest-intent destination, then follow with social proof and community links.",
        action: "Optimize"
      },
      {
        title: "Add a timed campaign",
        body: "Use scheduled and expiring links for launches, sponsor promos, and flash offers.",
        action: "Schedule"
      },
      {
        title: "Capture email before social",
        body: "Move newsletter capture above low-intent social profiles during growth campaigns.",
        action: "Capture"
      }
    ]
  });
});
