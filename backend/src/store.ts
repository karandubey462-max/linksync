import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type { z } from "zod";
import type { linkSchema, profileSchema, signupSchema } from "./validators.js";

type StoredUser = Omit<z.infer<typeof signupSchema>, "password"> & {
  _id: string;
  passwordHash: string;
  bio?: string;
  avatar?: string;
  accentColor?: string;
  selectedTheme?: string;
  customDomain?: string;
  newsletterUrl?: string;
  tipUrl?: string;
  sponsorEmail?: string;
  socialLinks?: Record<string, string>;
};

type StoredLink = z.infer<typeof linkSchema> & {
  _id: string;
  userId: string;
  active: boolean;
  order: number;
  clicks: number;
  category: string;
  pinned: boolean;
};

type Database = {
  users: StoredUser[];
  links: StoredLink[];
};

const dbPath = path.join(process.cwd(), "linksync-fallback-db.json");

async function readDb(): Promise<Database> {
  try {
    return JSON.parse(await fs.readFile(dbPath, "utf8")) as Database;
  } catch {
    return { users: [], links: [] };
  }
}

async function writeDb(db: Database) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function publicUser(user: StoredUser) {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}

export const fallbackStore = {
  async findUserByEmail(email: string) {
    const db = await readDb();
    return db.users.find((user) => user.email === email.toLowerCase()) ?? null;
  },
  async findUserByUsername(username: string) {
    const db = await readDb();
    return db.users.find((user) => user.username === username.toLowerCase()) ?? null;
  },
  async findUserById(id: string) {
    const db = await readDb();
    return db.users.find((user) => user._id === id) ?? null;
  },
  async createUser(input: z.infer<typeof signupSchema>, passwordHash: string) {
    const db = await readDb();
    const { password, ...safeInput } = input;
    void password;
    const user: StoredUser = {
      ...safeInput,
      _id: crypto.randomUUID(),
      passwordHash,
      bio: "",
      avatar: "",
      accentColor: "#2dd4bf",
      selectedTheme: "aura",
      socialLinks: {}
    };
    db.users.push(user);
    await writeDb(db);
    return user;
  },
  async updateUser(id: string, input: z.infer<typeof profileSchema>) {
    const db = await readDb();
    const index = db.users.findIndex((user) => user._id === id);
    if (index < 0) return null;
    db.users[index] = { ...db.users[index], ...input };
    await writeDb(db);
    return db.users[index];
  },
  publicUser,
  async listLinks(userId: string) {
    const db = await readDb();
    return db.links.filter((link) => link.userId === userId).sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.order - b.order);
  },
  async createLink(userId: string, input: z.infer<typeof linkSchema>) {
    const db = await readDb();
    const order = db.links.filter((link) => link.userId === userId).length + 1;
    const link: StoredLink = {
      ...input,
      _id: crypto.randomUUID(),
      userId,
      active: input.active ?? true,
      order: input.order ?? order,
      clicks: input.clicks ?? 0,
      category: input.category || "General",
      pinned: input.pinned ?? false
    };
    db.links.push(link);
    await writeDb(db);
    return link;
  },
  async updateLink(userId: string, id: string, input: Partial<z.infer<typeof linkSchema>>) {
    const db = await readDb();
    const index = db.links.findIndex((link) => link.userId === userId && link._id === id);
    if (index < 0) return null;
    db.links[index] = { ...db.links[index], ...input };
    await writeDb(db);
    return db.links[index];
  },
  async deleteLink(userId: string, id: string) {
    const db = await readDb();
    db.links = db.links.filter((link) => !(link.userId === userId && link._id === id));
    await writeDb(db);
  },
  async clickLink(id: string) {
    const db = await readDb();
    const link = db.links.find((item) => item._id === id);
    if (!link) return null;
    link.clicks += 1;
    await writeDb(db);
    return link;
  },
  async resetClicks(userId: string) {
    const db = await readDb();
    db.links = db.links.map((link) => link.userId === userId ? { ...link, clicks: 0 } : link);
    await writeDb(db);
  }
};
