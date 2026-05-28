import { z } from "zod";
export const signupSchema = z.object({
    name: z.string().trim().min(2),
    username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(6)
});
export const loginSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1)
});
export const profileSchema = z.object({
    name: z.string().trim().min(1).optional(),
    username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/).optional(),
    bio: z.string().max(280).optional(),
    avatar: z.string().refine((value) => {
        if (value === "")
            return true;
        if (value.startsWith("data:image/"))
            return value.length <= 250_000;
        return z.string().url().safeParse(value).success;
    }, "Avatar must be a valid image URL or compressed image.").optional(),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    selectedTheme: z.string().optional(),
    customDomain: z.string().max(120).optional(),
    newsletterUrl: z.string().max(300).optional(),
    tipUrl: z.string().max(300).optional(),
    sponsorEmail: z.string().max(120).optional(),
    socialLinks: z.object({
        instagram: z.string().max(200).optional(),
        twitter: z.string().max(200).optional(),
        linkedin: z.string().max(200).optional(),
        youtube: z.string().max(200).optional()
    }).optional()
});
export const linkSchema = z.object({
    title: z.string().trim().min(1).max(80),
    url: z.string().trim().min(3).max(500),
    active: z.boolean().optional(),
    order: z.number().optional(),
    clicks: z.number().optional(),
    category: z.string().max(60).optional(),
    pinned: z.boolean().optional(),
    priority: z.enum(["normal", "high"]).optional(),
    scheduledAt: z.string().datetime().optional().or(z.literal("")),
    expiresAt: z.string().datetime().optional().or(z.literal("")),
    duplicateOf: z.string().optional()
});
