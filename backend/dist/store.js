import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
const dbPath = path.join(process.cwd(), "linksync-fallback-db.json");
async function readDb() {
    try {
        return JSON.parse(await fs.readFile(dbPath, "utf8"));
    }
    catch {
        return { users: [], links: [] };
    }
}
async function writeDb(db) {
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}
function publicUser(user) {
    const { passwordHash, ...safeUser } = user;
    void passwordHash;
    return safeUser;
}
export const fallbackStore = {
    async findUserByEmail(email) {
        const db = await readDb();
        return db.users.find((user) => user.email === email.toLowerCase()) ?? null;
    },
    async findUserByUsername(username) {
        const db = await readDb();
        return db.users.find((user) => user.username === username.toLowerCase()) ?? null;
    },
    async findUserById(id) {
        const db = await readDb();
        return db.users.find((user) => user._id === id) ?? null;
    },
    async createUser(input, passwordHash) {
        const db = await readDb();
        const { password, ...safeInput } = input;
        void password;
        const user = {
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
    async updateUser(id, input) {
        const db = await readDb();
        const index = db.users.findIndex((user) => user._id === id);
        if (index < 0)
            return null;
        db.users[index] = { ...db.users[index], ...input };
        await writeDb(db);
        return db.users[index];
    },
    publicUser,
    async listLinks(userId) {
        const db = await readDb();
        return db.links.filter((link) => link.userId === userId).sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.order - b.order);
    },
    async createLink(userId, input) {
        const db = await readDb();
        const order = db.links.filter((link) => link.userId === userId).length + 1;
        const link = {
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
    async updateLink(userId, id, input) {
        const db = await readDb();
        const index = db.links.findIndex((link) => link.userId === userId && link._id === id);
        if (index < 0)
            return null;
        db.links[index] = { ...db.links[index], ...input };
        await writeDb(db);
        return db.links[index];
    },
    async deleteLink(userId, id) {
        const db = await readDb();
        db.links = db.links.filter((link) => !(link.userId === userId && link._id === id));
        await writeDb(db);
    },
    async clickLink(id) {
        const db = await readDb();
        const link = db.links.find((item) => item._id === id);
        if (!link)
            return null;
        link.clicks += 1;
        await writeDb(db);
        return link;
    },
    async resetClicks(userId) {
        const db = await readDb();
        db.links = db.links.map((link) => link.userId === userId ? { ...link, clicks: 0 } : link);
        await writeDb(db);
    }
};
