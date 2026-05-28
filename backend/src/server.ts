import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { config } from "./config.js";
import { connectDatabase } from "./db.js";
import { aiRouter } from "./routes/ai.js";
import { analyticsRouter } from "./routes/analytics.js";
import { authRouter } from "./routes/auth.js";
import { linksRouter } from "./routes/links.js";
import { profileRouter } from "./routes/profile.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({
  success: true,
  service: "linksync-api",
  database: connectState()
}));
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/links", linksRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRouter);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found." }));

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
};

app.use(errorHandler);

connectDatabase().catch((error) => {
  console.error("MongoDB connection failed during startup:", error.message);
});

app.listen(config.PORT, () => {
  console.log(`LinkSync API listening on ${config.PORT}`);
});

function connectState() {
  if (!process.env.MONGODB_URI) return "not_configured";
  if (mongoose.connection.readyState === 1) return "connected";
  if (mongoose.connection.readyState === 2) return "connecting";
  if (mongoose.connection.readyState === 3) return "disconnecting";
  return "disconnected";
}
