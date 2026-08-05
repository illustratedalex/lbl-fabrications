export type PublicContentSectionType =
  | "hero"
  | "rich_text"
  | "stats"
  | "services"
  | "gallery"
  | "projects"
  | "video"
  | "testimonials"
  | "faq"
  | "cta"
  | "contact"
  | "unknown";

export type PublicContentAsset = {
  id: string;
  category: "image" | "logo" | "video" | "document" | "cad" | "other";
  name: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  url: string | null;
};

export type PublicContentSection = {
  id: string;
  type: PublicContentSectionType;
  sourceType?: string | null;
  label: string;
  position: number;
  status: "draft" | "in_review" | "approved";
  content: unknown;
  settings: Record<string, unknown>;
};

export type PublicContentPage = {
  pageId: string;
  siteSlug: string;
  path: string;
  title: string;
  status: "draft" | "in_review" | "approved" | "published";
  seo: {
    title: string | null;
    description: string | null;
    socialImageAssetId: string | null;
  };
  sections: PublicContentSection[];
  assetsById: Record<string, PublicContentAsset>;
};

export type PublicContentApiResponse = {
  page: PublicContentPage;
  meta: {
    audience: "staging" | "production";
    generatedAt: string;
  };
};

export type HomepageContentResult = {
  page: PublicContentPage;
  source: "remote" | "fallback";
  reason: string | null;
};
