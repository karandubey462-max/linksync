import mongoose, { Schema } from "mongoose";
const AnalyticsEventSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    linkId: { type: Schema.Types.ObjectId, ref: "Link", index: true },
    type: { type: String, enum: ["profile_view", "link_click", "qr_scan"], required: true, index: true },
    country: String,
    device: String,
    referrer: String,
    userAgent: String,
    ipHash: String
}, { timestamps: true });
export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
