import { z } from "zod";

const blockedHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export function normalizePublicUrl(rawUrl: string) {
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  const parsed = z.string().url().safeParse(withProtocol);
  if (!parsed.success) return { ok: false as const, statusCode: 400, message: "Enter a valid URL." };

  const url = new URL(withProtocol);
  if (!["http:", "https:"].includes(url.protocol)) {
    return { ok: false as const, statusCode: 400, message: "Only http and https links are allowed." };
  }

  if (blockedHosts.has(url.hostname.toLowerCase())) {
    return { ok: false as const, statusCode: 400, message: "Local/private links cannot be saved." };
  }

  return { ok: true as const, url: url.toString() };
}

export async function validatePublicUrl(rawUrl: string) {
  const normalized = normalizePublicUrl(rawUrl);
  if (!normalized.ok) return normalized;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);
  const headers = { "user-agent": "LinkSync-Link-Validator/1.0" };

  try {
    let response = await fetch(normalized.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(normalized.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { ...headers, range: "bytes=0-256" }
      });
    }

    if (response.status === 404 || response.status === 410) {
      return {
        ok: false as const,
        statusCode: 404,
        message: "404 Not Found: this link page does not exist. Please check the URL."
      };
    }

    return { ok: true as const, url: normalized.url };
  } catch {
    return { ok: false as const, statusCode: 400, message: "This link could not be reached. Please check the URL." };
  } finally {
    clearTimeout(timeout);
  }
}
