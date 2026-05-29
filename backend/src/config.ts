import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(24, "JWT_SECRET must be at least 24 characters"),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional()
});

export const config = envSchema.parse(process.env);
