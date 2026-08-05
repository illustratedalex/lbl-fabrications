export type WorkspacePageStatus = "draft" | "in_review" | "approved" | "published";

export type WorkspaceSectionStatus = "draft" | "in_review" | "approved";

export type WorkspaceSectionType =
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

export type WorkspaceSectionAlignment = "left" | "center" | "right";

export type WorkspaceGalleryLayout = "grid" | "masonry" | "carousel";

export type WorkspaceContactFormType = "default" | "simple" | "email";

export type WorkspaceAsset = {
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

export type WorkspaceHeroContent = {
  eyebrow: string;
  heading: string;
  body: string;
  background_asset_id: string | null;
  primary_button_label: string;
  primary_button_href: string;
  secondary_button_label: string;
  secondary_button_href: string;
  alignment: WorkspaceSectionAlignment;
};

export type WorkspaceRichTextContent = {
  heading: string;
  body: string;
};

export type WorkspaceStatsContent = {
  heading: string;
  body: string;
  items: Array<{
    value: string;
    label: string;
    description: string;
  }>;
};

export type WorkspaceServicesContent = {
  heading: string;
  body: string;
  items: Array<{
    title: string;
    description: string;
    image_asset_id: string | null;
    href: string;
  }>;
};

export type WorkspaceGalleryContent = {
  heading: string;
  body: string;
  asset_ids: string[];
  captions_enabled: boolean;
  layout: WorkspaceGalleryLayout;
};

export type WorkspaceProjectsContent = {
  heading: string;
  body: string;
  items: Array<{
    title: string;
    description: string;
    image_asset_id: string | null;
    href: string;
  }>;
};

export type WorkspaceVideoContent = {
  heading: string;
  body: string;
  video_asset_id: string | null;
  poster_asset_id: string | null;
  controls: boolean;
  autoplay: boolean;
  muted: boolean;
};

export type WorkspaceTestimonialsContent = {
  heading: string;
  body: string;
  items: Array<{
    quote: string;
    name: string;
    company: string;
    role: string;
  }>;
};

export type WorkspaceFaqContent = {
  heading: string;
  body: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export type WorkspaceCtaContent = {
  heading: string;
  body: string;
  button_label: string;
  button_href: string;
  secondary_button_label: string;
  secondary_button_href: string;
  background_asset_id: string | null;
};

export type WorkspaceContactContent = {
  heading: string;
  body: string;
  show_phone: boolean;
  show_email: boolean;
  show_address: boolean;
  form_type: WorkspaceContactFormType;
};

export type WorkspaceUnknownContent = Record<string, never>;

export type WorkspaceSectionContentByType = {
  hero: WorkspaceHeroContent;
  rich_text: WorkspaceRichTextContent;
  stats: WorkspaceStatsContent;
  services: WorkspaceServicesContent;
  gallery: WorkspaceGalleryContent;
  projects: WorkspaceProjectsContent;
  video: WorkspaceVideoContent;
  testimonials: WorkspaceTestimonialsContent;
  faq: WorkspaceFaqContent;
  cta: WorkspaceCtaContent;
  contact: WorkspaceContactContent;
  unknown: WorkspaceUnknownContent;
};

export type WorkspaceSectionContent = WorkspaceSectionContentByType[WorkspaceSectionType];

export type WorkspaceSection = {
  id: string;
  organizationId: string;
  siteId: string;
  pageId: string;
  type: WorkspaceSectionType;
  sourceType: string | null;
  label: string;
  position: number;
  status: WorkspaceSectionStatus;
  content: WorkspaceSectionContent;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  isIncomplete: boolean;
  normalizationWarnings: string[];
};

export type WorkspaceSeo = {
  title: string | null;
  description: string | null;
  socialImageAssetId: string | null;
};

export type WorkspacePage = {
  id: string;
  organizationId: string;
  siteId: string;
  siteSlug: string;
  title: string;
  slug: string;
  path: string;
  status: WorkspacePageStatus;
  seo: WorkspaceSeo;
  sections: WorkspaceSection[];
  assetsById: Record<string, WorkspaceAsset>;
  createdAt: string;
  updatedAt: string;
  isIncomplete: boolean;
  normalizationWarnings: string[];
};

export type WorkspaceValidationIssue = {
  path: string;
  message: string;
  severity: "error" | "warning";
};

export type WorkspaceContentStore = {
  pages: WorkspacePage[];
};

export type WorkspaceContentRepositoryOptions = {
  storePath?: string;
};
