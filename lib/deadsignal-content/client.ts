import "server-only";
import type { HomepageContentResult, PublicContentPage } from "./types";
import { getFallbackPageContent } from "./fallback";
import { normalizePublicContentPage, normalizePublicContentResponse } from "./normalization";

const SITE_SLUG = "lbl-fabrications";
const DEFAULT_REVALIDATE_SECONDS = 60;

function parseRevalidateSeconds() {
  const raw = process.env.DEADSIGNAL_CONTENT_REVALIDATE_SECONDS?.trim();
  if (!raw) {
    return DEFAULT_REVALIDATE_SECONDS;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_REVALIDATE_SECONDS;
  }

  return Math.floor(parsed);
}

function getContentApiUrl() {
  const value = process.env.DEADSIGNAL_CONTENT_API_URL?.trim();
  if (!value) {
    return null;
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function mapResponsePage(page: PublicContentPage): PublicContentPage {
  const sections = [...page.sections].sort((a, b) => a.position - b.position);
  return {
    ...page,
    sections,
  };
}

export function shouldNoIndex() {
  return process.env.VERCEL_ENV !== "production";
}

export async function fetchContentPage(path: string): Promise<HomepageContentResult> {
  const apiUrl = getContentApiUrl();
  const apiKey = process.env.DEADSIGNAL_CONTENT_API_KEY?.trim();
  const normalizedPath = path.trim() || "/";

  if (!apiUrl || !apiKey) {
    return {
      page: getFallbackPageContent(normalizedPath),
      source: "fallback",
      reason: "Missing DEADSIGNAL_CONTENT_API_URL or DEADSIGNAL_CONTENT_API_KEY.",
    };
  }

  const endpoint = `${apiUrl}/api/public/sites/${SITE_SLUG}/content?page=${encodeURIComponent(normalizedPath)}&audience=staging`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-deadsignal-api-key": apiKey,
      },
      next: {
        revalidate: parseRevalidateSeconds(),
      },
    });

    if (!response.ok) {
      return {
        page: getFallbackPageContent(normalizedPath),
        source: "fallback",
        reason: `Content endpoint returned ${response.status}.`,
      };
    }

    const payload = (await response.json()) as unknown;
    const normalized = normalizePublicContentResponse(payload);
    if (!normalized) {
      return {
        page: getFallbackPageContent(normalizedPath),
        source: "fallback",
        reason: "Content endpoint returned an invalid payload.",
      };
    }

    return {
      page: mapResponsePage(normalizePublicContentPage(normalized.page)),
      source: "remote",
      reason: null,
    };
  } catch {
    return {
      page: getFallbackPageContent(normalizedPath),
      source: "fallback",
      reason: "Content endpoint request failed.",
    };
  }
}

export async function fetchHomepageContent(): Promise<HomepageContentResult> {
  return fetchContentPage("/");
}
