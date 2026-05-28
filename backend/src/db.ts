import mongoose from "mongoose";
import { config } from "./config.js";

mongoose.set("bufferCommands", false);

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(config.MONGODB_URI, {
    autoIndex: config.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 10_000
  });
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
