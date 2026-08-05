import type {
  WorkspaceContactFormType,
  WorkspaceContactContent,
  WorkspaceCtaContent,
  WorkspaceFaqContent,
  WorkspaceGalleryContent,
  WorkspaceGalleryLayout,
  WorkspaceHeroContent,
  WorkspacePage,
  WorkspacePageStatus,
  WorkspaceProjectsContent,
  WorkspaceRichTextContent,
  WorkspaceSection,
  WorkspaceSectionAlignment,
  WorkspaceSectionContent,
  WorkspaceSectionStatus,
  WorkspaceSectionType,
  WorkspaceServicesContent,
  WorkspaceStatsContent,
  WorkspaceTestimonialsContent,
  WorkspaceUnknownContent,
  WorkspaceValidationIssue,
  WorkspaceVideoContent,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNullableString(value: unknown): string | null {
  const text = toTrimmedString(value);
  return text ? text : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => toTrimmedString(entry))
    .filter((entry) => Boolean(entry));
}

function toRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord);
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return fallback;
}

function toInteger(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return fallback;
}

function toDateString(value: unknown): string {
  if (typeof value === "string") {
    const text = value.trim();
    if (text) {
      const parsed = new Date(text);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }

      return text;
    }
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  return "";
}

function normalizeStatus<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }

  return fallback;
}

export function normalizeNullableString(value: unknown): string | null {
  return toNullableString(value);
}

export function normalizeRequiredString(value: unknown): string {
  return toTrimmedString(value);
}

export function normalizeStringArray(value: unknown): string[] {
  return toStringArray(value);
}

export function normalizeRecordArray(value: unknown): Record<string, unknown>[] {
  return toRecordArray(value);
}

export function normalizePageStatus(value: unknown): WorkspacePageStatus {
  return normalizeStatus(value, ["draft", "in_review", "approved", "published"], "draft");
}

export function normalizeSectionStatus(value: unknown): WorkspaceSectionStatus {
  return normalizeStatus(value, ["draft", "in_review", "approved"], "draft");
}

export function normalizeSectionType(value: unknown): WorkspaceSectionType {
  return normalizeStatus(
    value,
    [
      "hero",
      "rich_text",
      "stats",
      "services",
      "gallery",
      "projects",
      "video",
      "testimonials",
      "faq",
      "cta",
      "contact",
    ],
    "unknown",
  );
}

function normalizeAlignment(value: unknown): WorkspaceSectionAlignment {
  return normalizeStatus(value, ["left", "center", "right"], "left");
}

function normalizeGalleryLayout(value: unknown): WorkspaceGalleryLayout {
  return normalizeStatus(value, ["grid", "masonry", "carousel"], "grid");
}

function normalizeContactFormType(value: unknown): WorkspaceContactFormType {
  return normalizeStatus(value, ["default", "simple", "email"], "default");
}

function normalizeHeroContent(value: unknown): WorkspaceHeroContent {
  const content = isRecord(value) ? value : {};
  return {
    eyebrow: normalizeRequiredString(content.eyebrow),
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    background_asset_id: normalizeNullableString(content.background_asset_id ?? content.backgroundAssetId),
    primary_button_label: normalizeRequiredString(content.primary_button_label ?? content.primaryButtonLabel),
    primary_button_href: normalizeRequiredString(content.primary_button_href ?? content.primaryButtonHref),
    secondary_button_label: normalizeRequiredString(content.secondary_button_label ?? content.secondaryButtonLabel),
    secondary_button_href: normalizeRequiredString(content.secondary_button_href ?? content.secondaryButtonHref),
    alignment: normalizeAlignment(content.alignment),
  };
}

function normalizeRichTextContent(value: unknown): WorkspaceRichTextContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
  };
}

function normalizeStatsContent(value: unknown): WorkspaceStatsContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    items: toRecordArray(content.items).map((item) => ({
      value: normalizeRequiredString(item.value),
      label: normalizeRequiredString(item.label),
      description: normalizeRequiredString(item.description),
    })),
  };
}

function normalizeServicesContent(value: unknown): WorkspaceServicesContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    items: toRecordArray(content.items).map((item) => ({
      title: normalizeRequiredString(item.title),
      description: normalizeRequiredString(item.description),
      image_asset_id: normalizeNullableString(item.image_asset_id ?? item.imageAssetId),
      href: normalizeRequiredString(item.href),
    })),
  };
}

function normalizeGalleryContent(value: unknown): WorkspaceGalleryContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    asset_ids: normalizeStringArray(content.asset_ids ?? content.assetIds),
    captions_enabled: toBoolean(content.captions_enabled ?? content.captionsEnabled, false),
    layout: normalizeGalleryLayout(content.layout),
  };
}

function normalizeProjectsContent(value: unknown): WorkspaceProjectsContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    items: toRecordArray(content.items).map((item) => ({
      title: normalizeRequiredString(item.title),
      description: normalizeRequiredString(item.description),
      image_asset_id: normalizeNullableString(item.image_asset_id ?? item.imageAssetId),
      href: normalizeRequiredString(item.href),
    })),
  };
}

function normalizeVideoContent(value: unknown): WorkspaceVideoContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    video_asset_id: normalizeNullableString(content.video_asset_id ?? content.videoAssetId),
    poster_asset_id: normalizeNullableString(content.poster_asset_id ?? content.posterAssetId),
    controls: toBoolean(content.controls, true),
    autoplay: toBoolean(content.autoplay, false),
    muted: toBoolean(content.muted, true),
  };
}

function normalizeTestimonialsContent(value: unknown): WorkspaceTestimonialsContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    items: toRecordArray(content.items).map((item) => ({
      quote: normalizeRequiredString(item.quote),
      name: normalizeRequiredString(item.name),
      company: normalizeRequiredString(item.company),
      role: normalizeRequiredString(item.role),
    })),
  };
}

function normalizeFaqContent(value: unknown): WorkspaceFaqContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    items: toRecordArray(content.items).map((item) => ({
      question: normalizeRequiredString(item.question),
      answer: normalizeRequiredString(item.answer),
    })),
  };
}

function normalizeCtaContent(value: unknown): WorkspaceCtaContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    button_label: normalizeRequiredString(content.button_label ?? content.buttonLabel),
    button_href: normalizeRequiredString(content.button_href ?? content.buttonHref),
    secondary_button_label: normalizeRequiredString(content.secondary_button_label ?? content.secondaryButtonLabel),
    secondary_button_href: normalizeRequiredString(content.secondary_button_href ?? content.secondaryButtonHref),
    background_asset_id: normalizeNullableString(content.background_asset_id ?? content.backgroundAssetId),
  };
}

function normalizeContactContent(value: unknown): WorkspaceContactContent {
  const content = isRecord(value) ? value : {};
  return {
    heading: normalizeRequiredString(content.heading),
    body: normalizeRequiredString(content.body),
    show_phone: toBoolean(content.show_phone ?? content.showPhone, false),
    show_email: toBoolean(content.show_email ?? content.showEmail, false),
    show_address: toBoolean(content.show_address ?? content.showAddress, false),
    form_type: normalizeContactFormType(content.form_type ?? content.formType),
  };
}

function normalizeUnknownContent(): WorkspaceUnknownContent {
  return {};
}

export function normalizeSectionContent(type: "hero", value: unknown): WorkspaceHeroContent;
export function normalizeSectionContent(type: "rich_text", value: unknown): WorkspaceRichTextContent;
export function normalizeSectionContent(type: "stats", value: unknown): WorkspaceStatsContent;
export function normalizeSectionContent(type: "services", value: unknown): WorkspaceServicesContent;
export function normalizeSectionContent(type: "gallery", value: unknown): WorkspaceGalleryContent;
export function normalizeSectionContent(type: "projects", value: unknown): WorkspaceProjectsContent;
export function normalizeSectionContent(type: "video", value: unknown): WorkspaceVideoContent;
export function normalizeSectionContent(type: "testimonials", value: unknown): WorkspaceTestimonialsContent;
export function normalizeSectionContent(type: "faq", value: unknown): WorkspaceFaqContent;
export function normalizeSectionContent(type: "cta", value: unknown): WorkspaceCtaContent;
export function normalizeSectionContent(type: "contact", value: unknown): WorkspaceContactContent;
export function normalizeSectionContent(type: "unknown", value: unknown): WorkspaceUnknownContent;
export function normalizeSectionContent(type: WorkspaceSectionType, value: unknown): WorkspaceSectionContent {
  switch (type) {
    case "hero":
      return normalizeHeroContent(value);
    case "rich_text":
      return normalizeRichTextContent(value);
    case "stats":
      return normalizeStatsContent(value);
    case "services":
      return normalizeServicesContent(value);
    case "gallery":
      return normalizeGalleryContent(value);
    case "projects":
      return normalizeProjectsContent(value);
    case "video":
      return normalizeVideoContent(value);
    case "testimonials":
      return normalizeTestimonialsContent(value);
    case "faq":
      return normalizeFaqContent(value);
    case "cta":
      return normalizeCtaContent(value);
    case "contact":
      return normalizeContactContent(value);
    default:
      return normalizeUnknownContent();
  }
}

export function normalizeWorkspaceSection(value: unknown): WorkspaceSection {
  const section = isRecord(value) ? value : {};
  const sourceType = typeof section.type === "string" ? section.type : null;
  const type = normalizeSectionType(section.type);
  const warnings: string[] = [];

  if (!sourceType) {
    warnings.push("Missing section type.");
  } else if (type === "unknown") {
    warnings.push(`Unsupported section type: ${sourceType}.`);
  }

  if (!normalizeRequiredString(section.label)) {
    warnings.push("Missing section label.");
  }

  if (!toDateString(section.createdAt)) {
    warnings.push("Missing or invalid createdAt.");
  }

  if (!toDateString(section.updatedAt)) {
    warnings.push("Missing or invalid updatedAt.");
  }

  let normalizedContent: WorkspaceSectionContent;
  switch (type) {
    case "hero":
      normalizedContent = normalizeSectionContent("hero", section.content);
      break;
    case "rich_text":
      normalizedContent = normalizeSectionContent("rich_text", section.content);
      break;
    case "stats":
      normalizedContent = normalizeSectionContent("stats", section.content);
      break;
    case "services":
      normalizedContent = normalizeSectionContent("services", section.content);
      break;
    case "gallery":
      normalizedContent = normalizeSectionContent("gallery", section.content);
      break;
    case "projects":
      normalizedContent = normalizeSectionContent("projects", section.content);
      break;
    case "video":
      normalizedContent = normalizeSectionContent("video", section.content);
      break;
    case "testimonials":
      normalizedContent = normalizeSectionContent("testimonials", section.content);
      break;
    case "faq":
      normalizedContent = normalizeSectionContent("faq", section.content);
      break;
    case "cta":
      normalizedContent = normalizeSectionContent("cta", section.content);
      break;
    case "contact":
      normalizedContent = normalizeSectionContent("contact", section.content);
      break;
    default:
      normalizedContent = normalizeSectionContent("unknown", section.content);
      break;
  }

  return {
    id: normalizeRequiredString(section.id),
    organizationId: normalizeRequiredString(section.organizationId),
    siteId: normalizeRequiredString(section.siteId),
    pageId: normalizeRequiredString(section.pageId),
    type,
    sourceType,
    label: normalizeRequiredString(section.label),
    position: toInteger(section.position, 0),
    status: normalizeSectionStatus(section.status),
    content: normalizedContent,
    settings: isRecord(section.settings) ? section.settings : {},
    createdAt: toDateString(section.createdAt),
    updatedAt: toDateString(section.updatedAt),
    isIncomplete: warnings.length > 0,
    normalizationWarnings: warnings,
  };
}

function normalizeSeo(value: unknown) {
  const seo = isRecord(value) ? value : {};
  return {
    title: toNullableString(seo.title),
    description: toNullableString(seo.description),
    socialImageAssetId: toNullableString(seo.socialImageAssetId ?? seo.social_image_asset_id),
  };
}

function normalizeAssetsById(value: unknown) {
  const assets = isRecord(value) ? value : {};
  const normalized: Record<string, { id: string; category: WorkspacePage["assetsById"][string]["category"]; name: string; originalName: string; mimeType: string; sizeBytes: number; width: number | null; height: number | null; altText: string | null; url: string | null; }> = {};

  for (const [key, assetValue] of Object.entries(assets)) {
    if (!isRecord(assetValue)) {
      continue;
    }

    normalized[key] = {
      id: normalizeRequiredString(assetValue.id) || key,
      category: normalizeStatus(assetValue.category, ["image", "logo", "video", "document", "cad", "other"], "other"),
      name: normalizeRequiredString(assetValue.name),
      originalName: normalizeRequiredString(assetValue.originalName ?? assetValue.original_name),
      mimeType: normalizeRequiredString(assetValue.mimeType ?? assetValue.mime_type),
      sizeBytes: toInteger(assetValue.sizeBytes ?? assetValue.size_bytes, 0),
      width: typeof assetValue.width === "number" && Number.isFinite(assetValue.width) ? assetValue.width : null,
      height: typeof assetValue.height === "number" && Number.isFinite(assetValue.height) ? assetValue.height : null,
      altText: toNullableString(assetValue.altText ?? assetValue.alt_text),
      url: toNullableString(assetValue.url),
    };
  }

  return normalized;
}

export function normalizeWorkspacePage(value: unknown): WorkspacePage {
  const page = isRecord(value) ? value : {};
  const sections = Array.isArray(page.sections) ? page.sections.map(normalizeWorkspaceSection) : [];
  const warnings: string[] = [];

  if (!normalizeRequiredString(page.title)) {
    warnings.push("Missing page title.");
  }

  if (!normalizeRequiredString(page.path)) {
    warnings.push("Missing page path.");
  }

  if (!toDateString(page.createdAt)) {
    warnings.push("Missing or invalid createdAt.");
  }

  if (!toDateString(page.updatedAt)) {
    warnings.push("Missing or invalid updatedAt.");
  }

  if (sections.some((section) => section.isIncomplete)) {
    warnings.push("Contains incomplete sections.");
  }

  return {
    id: normalizeRequiredString(page.id),
    organizationId: normalizeRequiredString(page.organizationId),
    siteId: normalizeRequiredString(page.siteId),
    siteSlug: normalizeRequiredString(page.siteSlug),
    title: normalizeRequiredString(page.title),
    slug: normalizeRequiredString(page.slug),
    path: normalizeRequiredString(page.path),
    status: normalizePageStatus(page.status),
    seo: normalizeSeo(page.seo),
    sections,
    assetsById: normalizeAssetsById(page.assetsById),
    createdAt: toDateString(page.createdAt),
    updatedAt: toDateString(page.updatedAt),
    isIncomplete: warnings.length > 0 || !normalizeRequiredString(page.title) || !normalizeRequiredString(page.path),
    normalizationWarnings: warnings,
  };
}

export function validateWorkspacePage(page: WorkspacePage): WorkspaceValidationIssue[] {
  const issues: WorkspaceValidationIssue[] = [];

  if (!page.id) {
    issues.push({ path: "id", message: "Page id is required.", severity: "error" });
  }

  if (!page.title) {
    issues.push({ path: "title", message: "Page title is required.", severity: "warning" });
  }

  if (!page.path) {
    issues.push({ path: "path", message: "Page path is required.", severity: "warning" });
  }

  if (page.status === "draft" && page.normalizationWarnings.length > 0) {
    issues.push({ path: "status", message: "Page fell back to draft status after normalization.", severity: "warning" });
  }

  return issues;
}

export function validateWorkspaceSection(section: WorkspaceSection): WorkspaceValidationIssue[] {
  const issues: WorkspaceValidationIssue[] = [];

  if (!section.id) {
    issues.push({ path: "id", message: "Section id is required.", severity: "error" });
  }

  if (!section.label) {
    issues.push({ path: "label", message: "Section label is required.", severity: "warning" });
  }

  if (section.type === "unknown") {
    issues.push({ path: "type", message: "Unknown section type was preserved.", severity: "warning" });
  }

  if (section.isIncomplete) {
    issues.push({ path: "content", message: "Section content was normalized from malformed data.", severity: "warning" });
  }

  return issues;
}

export function normalizeAndValidatePage(value: unknown) {
  const page = normalizeWorkspacePage(value);
  return {
    page,
    issues: validateWorkspacePage(page),
  };
}

export function getPresentationPageTitle(page: WorkspacePage): string {
  return page.title || "Untitled page";
}

export function getPresentationSectionLabel(section: WorkspaceSection): string {
  return section.label || "";
}

export function getPageCompletionRequirements(page: WorkspacePage): string[] {
  const requirements: string[] = [];

  if (!page.title) {
    requirements.push("title");
  }

  if (!page.path) {
    requirements.push("path");
  }

  if (page.sections.length === 0) {
    requirements.push("sections");
  }

  return requirements;
}

export function hasMeaningfulSectionContent(section: WorkspaceSection): boolean {
  switch (section.type) {
    case "hero": {
      const content = section.content as WorkspaceHeroContent;
      return Boolean(content.heading || content.body || content.primary_button_label || content.secondary_button_label);
    }
    case "rich_text": {
      const content = section.content as WorkspaceRichTextContent;
      return Boolean(content.heading || content.body);
    }
    case "stats": {
      const content = section.content as WorkspaceStatsContent;
      return content.items.length > 0 && content.items.some((item) => Boolean(item.value || item.label || item.description));
    }
    case "services": {
      const content = section.content as WorkspaceServicesContent;
      return content.items.length > 0 && content.items.some((item) => Boolean(item.title || item.description || item.href || item.image_asset_id));
    }
    case "gallery": {
      const content = section.content as WorkspaceGalleryContent;
      return content.asset_ids.length > 0;
    }
    case "projects": {
      const content = section.content as WorkspaceProjectsContent;
      return content.items.length > 0;
    }
    case "video": {
      const content = section.content as WorkspaceVideoContent;
      return Boolean(content.video_asset_id || content.poster_asset_id);
    }
    case "testimonials": {
      const content = section.content as WorkspaceTestimonialsContent;
      return content.items.length > 0;
    }
    case "faq": {
      const content = section.content as WorkspaceFaqContent;
      return content.items.length > 0;
    }
    case "cta": {
      const content = section.content as WorkspaceCtaContent;
      return Boolean(content.heading || content.body || content.button_label || content.secondary_button_label);
    }
    case "contact": {
      const content = section.content as WorkspaceContactContent;
      return Boolean(content.heading || content.body || content.show_phone || content.show_email || content.show_address);
    }
    default:
      return false;
  }
}
