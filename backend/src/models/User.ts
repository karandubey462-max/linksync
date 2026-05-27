import mongoose, { Schema } from "mongoose";

const SocialLinksSchema = new Schema({
  instagram: String,
  twitter: String,
  linkedin: String,
  youtube: String
}, { _id: false });

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  accentColor: { type: String, default: "#2dd4bf" },
  selectedTheme: { type: String, default: "aura" },
  customDomain: { type: String, default: "" },
  newsletterUrl: { type: String, default: "" },
  tipUrl: { type: String, default: "" },
  sponsorEmail: { type: String, default: "" },
  socialLinks: { type: SocialLinksSchema, default: {} }
}, { timestamps: true });

UserSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
