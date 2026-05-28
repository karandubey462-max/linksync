import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { asyncRoute } from "../asyncRoute.js";
export const aiRouter = Router();
aiRouter.post("/suggestions", requireAuth, asyncRoute(async (req, res) => {
    const links = Array.isArray(req.body.links) ? req.body.links : [];
    const topLink = [...links].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))[0];
    const name = typeof req.body.name === "string" && req.body.name.trim() ? req.body.name.trim() : "I";
    return res.json({
        success: true,
        bio: `${name} shares important links, updates, and ways to connect in one simple profile.`,
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
}));
