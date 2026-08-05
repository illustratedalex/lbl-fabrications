import type { PublicContentApiResponse, PublicContentPage, PublicContentSection, PublicContentSectionType } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeRequiredString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableString(value: unknown): string | null {
  const text = normalizeRequiredString(value);
  return text ? text : null;
}

function normalizeStatus(value: unknown): PublicContentSection["status"] {
  return value === "draft" || value === "in_review" || value === "approved" ? value : "draft";
}

function normalizeSectionType(value: unknown): PublicContentSectionType {
  return value === "hero"
    || value === "rich_text"
    || value === "stats"
    || value === "services"
    || value === "gallery"
    || value === "projects"
    || value === "video"
    || value === "testimonials"
    || value === "faq"
    || value === "cta"
    || value === "contact"
    ? value
    : "unknown";
}

function normalizeSection(value: unknown): PublicContentSection {
  const section = isRecord(value) ? value : {};
  const sourceType = typeof section.type === "string" ? section.type : null;

  return {
    id: normalizeRequiredString(section.id),
    type: normalizeSectionType(section.type),
    sourceType,
    label: normalizeRequiredString(section.label),
    position: typeof section.position === "number" && Number.isFinite(section.position) ? Math.max(0, Math.floor(section.position)) : 0,
    status: normalizeStatus(section.status),
    content: isRecord(section.content) || Array.isArray(section.content) ? section.content : {},
    settings: isRecord(section.settings) ? section.settings : {},
  };
}

function normalizeAssetsById(value: unknown): PublicContentPage["assetsById"] {
  const assets = isRecord(value) ? value : {};
  const normalized: PublicContentPage["assetsById"] = {};

  for (const [id, asset] of Object.entries(assets)) {
    if (!isRecord(asset)) {
      continue;
    }

    normalized[id] = {
      id: normalizeRequiredString(asset.id) || id,
      category:
        asset.category === "image" || asset.category === "logo" || asset.category === "video" || asset.category === "document" || asset.category === "cad"
          ? asset.category
          : "other",
      name: normalizeRequiredString(asset.name),
      originalName: normalizeRequiredString(asset.originalName),
      mimeType: normalizeRequiredString(asset.mimeType),
      sizeBytes: typeof asset.sizeBytes === "number" && Number.isFinite(asset.sizeBytes) ? asset.sizeBytes : 0,
      width: typeof asset.width === "number" && Number.isFinite(asset.width) ? asset.width : null,
      height: typeof asset.height === "number" && Number.isFinite(asset.height) ? asset.height : null,
      altText: normalizeNullableString(asset.altText),
      url: normalizeNullableString(asset.url),
    };
  }

  return normalized;
}

export function normalizePublicContentPage(value: unknown): PublicContentPage {
  const page = isRecord(value) ? value : {};
  const sections = Array.isArray(page.sections) ? page.sections.map(normalizeSection) : [];

  return {
    pageId: normalizeRequiredString(page.pageId),
    siteSlug: normalizeRequiredString(page.siteSlug),
    path: normalizeRequiredString(page.path),
    title: normalizeRequiredString(page.title),
    status: page.status === "draft" || page.status === "in_review" || page.status === "approved" || page.status === "published" ? page.status : "draft",
    seo: {
      title: normalizeNullableString(page.seo && isRecord(page.seo) ? page.seo.title : null),
      description: normalizeNullableString(page.seo && isRecord(page.seo) ? page.seo.description : null),
      socialImageAssetId: normalizeNullableString(page.seo && isRecord(page.seo) ? page.seo.socialImageAssetId : null),
    },
    sections: sections.sort((left, right) => left.position - right.position),
    assetsById: normalizeAssetsById(page.assetsById),
  };
}

export function normalizePublicContentResponse(value: unknown): PublicContentApiResponse | null {
  if (!isRecord(value) || !isRecord(value.page)) {
    return null;
  }

  const meta = isRecord(value.meta) ? value.meta : {};

  return {
    page: normalizePublicContentPage(value.page),
    meta: {
      audience: meta.audience === "staging" || meta.audience === "production" ? meta.audience : "staging",
      generatedAt: typeof meta.generatedAt === "string" ? meta.generatedAt : new Date().toISOString(),
    },
  };
}
