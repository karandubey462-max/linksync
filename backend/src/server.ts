import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { connectDatabase } from "./db.js";
import { aiRouter } from "./routes/ai.js";
import { analyticsRouter } from "./routes/analytics.js";
import { authRouter } from "./routes/auth.js";
import { linksRouter } from "./routes/links.js";
import { profileRouter } from "./routes/profile.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ success: true, service: "linksync-api" }));
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/links", linksRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRouter);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found." }));

await connectDatabase();

app.listen(config.PORT, () => {
  console.log(`LinkSync API listening on ${config.PORT}`);
});
