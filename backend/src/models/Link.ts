import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0, index: true },
  clicks: { type: Number, default: 0 },
  category: { type: String, default: "General" },
  pinned: { type: Boolean, default: false },
  priority: { type: String, enum: ["normal", "high"], default: "normal" },
  scheduledAt: Date,
  expiresAt: Date,
  duplicateOf: String
}, { timestamps: true });

export const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);
