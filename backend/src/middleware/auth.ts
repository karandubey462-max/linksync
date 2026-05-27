import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type AuthenticatedRequest = Request & { userId?: string };

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing authentication token." });
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
