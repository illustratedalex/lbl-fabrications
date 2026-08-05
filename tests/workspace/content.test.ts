import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  buildPublicDeliveryResponse,
  createWorkspaceContentRepository,
  getPageCompletionRequirements,
  getPresentationPageTitle,
  normalizeNullableString,
  normalizePageStatus,
  normalizeRecordArray,
  normalizeRequiredString,
  normalizeSectionContent,
  normalizeSectionStatus,
  normalizeSectionType,
  normalizeStringArray,
  normalizeWorkspacePage,
  normalizeWorkspaceSection,
  validatePageCompletion,
} from "../../lib/workspace/content";

const basePage = {
  id: "page-1",
  organizationId: "org-1",
  siteId: "site-1",
  siteSlug: "lbl-fabrications",
  title: "Homepage",
  slug: "home",
  path: "/",
  status: "published",
  seo: {
    title: "Homepage",
    description: "Homepage description",
    socialImageAssetId: null,
  },
  sections: [],
  assetsById: {},
  createdAt: "2026-07-31T00:00:00.000Z",
  updatedAt: "2026-07-31T00:00:00.000Z",
};

describe("workspace content normalization", () => {
  it("normalizes malformed page fields safely", () => {
    const page = normalizeWorkspacePage({
      ...basePage,
      title: undefined,
      path: undefined,
      status: "broken",
      seo: {
        title: undefined,
        description: undefined,
        socialImageAssetId: undefined,
      },
    });

    expect(page.title).toBe("");
    expect(page.path).toBe("");
    expect(page.status).toBe("draft");
    expect(page.seo.title).toBeNull();
    expect(page.seo.description).toBeNull();
  });

  it("preserves unknown section types and normalizes malformed content", () => {
    const section = normalizeWorkspaceSection({
      id: "section-1",
      organizationId: "org-1",
      siteId: "site-1",
      pageId: "page-1",
      type: "mystery",
      label: undefined,
      position: -12,
      status: "broken",
      content: undefined,
      settings: undefined,
      createdAt: "bad-date",
      updatedAt: undefined,
    });

    expect(section.type).toBe("unknown");
    expect(section.sourceType).toBe("mystery");
    expect(section.label).toBe("");
    expect(section.position).toBe(0);
    expect(section.status).toBe("draft");
    expect(section.content).toEqual({});
  });

  it("normalizes supported section content shapes", () => {
    expect(normalizeSectionContent("hero", { alignment: "diagonal" })).toMatchObject({
      eyebrow: "",
      alignment: "left",
    });
    expect(normalizeSectionContent("stats", { items: [{ value: "12", label: null, description: 3 }, null] })).toEqual({
      heading: "",
      body: "",
      items: [{ value: "12", label: "", description: "" }],
    });
    expect(normalizeSectionContent("services", { items: [{ title: "A", description: null, image_asset_id: null, href: null }] })).toEqual({
      heading: "",
      body: "",
      items: [{ title: "A", description: "", image_asset_id: null, href: "" }],
    });
    expect(normalizeSectionContent("gallery", { asset_ids: ["one", null, "two"], captions_enabled: "true", layout: "spiral" })).toEqual({
      heading: "",
      body: "",
      asset_ids: ["one", "two"],
      captions_enabled: true,
      layout: "grid",
    });
    expect(normalizeSectionContent("video", { autoplay: undefined, controls: "false", muted: 0 })).toEqual({
      heading: "",
      body: "",
      video_asset_id: null,
      poster_asset_id: null,
      controls: false,
      autoplay: false,
      muted: true,
    });
    expect(normalizeSectionContent("testimonials", { items: [{ quote: 1, name: undefined, company: null, role: false }] })).toEqual({
      heading: "",
      body: "",
      items: [{ quote: "", name: "", company: "", role: "" }],
    });
    expect(normalizeSectionContent("faq", { items: [{ question: 1, answer: null }] })).toEqual({
      heading: "",
      body: "",
      items: [{ question: "", answer: "" }],
    });
    expect(normalizeSectionContent("cta", { background_asset_id: 12 })).toMatchObject({
      background_asset_id: null,
    });
    expect(normalizeSectionContent("contact", { form_type: "custom", show_phone: "true" })).toEqual({
      heading: "",
      body: "",
      show_phone: true,
      show_email: false,
      show_address: false,
      form_type: "default",
    });
  });

  it("keeps completion aware of missing content even when presentation has a fallback label", () => {
    const page = normalizeWorkspacePage({ ...basePage, title: undefined });

    expect(getPresentationPageTitle(page)).toBe("Untitled page");
    expect(getPageCompletionRequirements(page)).toContain("title");
    expect(validatePageCompletion(page).some((issue) => issue.path === "title")).toBe(true);
  });

  it("normalization helpers accept only safe shapes", () => {
    expect(normalizeRequiredString(12)).toBe("");
    expect(normalizeNullableString(" hello ")).toBe("hello");
    expect(normalizeStringArray([" one ", null, 2, "two"])).toEqual(["one", "two"]);
    expect(normalizeRecordArray([{ a: 1 }, null, [], { b: 2 }])).toEqual([{ a: 1 }, { b: 2 }]);
    expect(normalizePageStatus("bad")).toBe("draft");
    expect(normalizeSectionStatus("bad")).toBe("draft");
    expect(normalizeSectionType("bad")).toBe("unknown");
  });
});

describe("workspace content repository and public delivery", () => {
  let tempDir: string;
  let storePath: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "workspace-content-"));
    storePath = path.join(tempDir, "workspace-content-dev.json");
    await writeFile(
      storePath,
      JSON.stringify(
        {
          pages: [
            {
              id: "stored-page",
              organizationId: "org-1",
              siteId: "site-1",
              siteSlug: "lbl-fabrications",
              title: undefined,
              slug: "stored",
              path: undefined,
              status: "broken",
              seo: {},
              sections: [
                {
                  id: "stored-section",
                  organizationId: "org-1",
                  siteId: "site-1",
                  pageId: "stored-page",
                  type: "unknown-type",
                  label: undefined,
                  position: -9,
                  status: "broken",
                  content: undefined,
                  settings: undefined,
                  createdAt: undefined,
                  updatedAt: undefined,
                },
              ],
              assetsById: {
                asset1: {
                  id: undefined,
                  category: "bad",
                  name: undefined,
                  originalName: undefined,
                  mimeType: undefined,
                  sizeBytes: "bad",
                  width: "bad",
                  height: "bad",
                  altText: undefined,
                  url: undefined,
                },
              },
              createdAt: undefined,
              updatedAt: undefined,
            },
          ],
        },
        null,
        2,
      ),
      "utf8",
    );
  });

  it("normalizes malformed development store rows and preserves existing fields on partial update", async () => {
    const repo = createWorkspaceContentRepository({ storePath });

    const pages = await repo.listPages();
    expect(pages).toHaveLength(1);
    expect(pages[0].title).toBe("");
    expect(pages[0].status).toBe("draft");
    expect(pages[0].sections[0].type).toBe("unknown");
    expect(pages[0].sections[0].label).toBe("");
    expect(pages[0].sections[0].position).toBe(0);

    const section = await repo.getSectionById("stored-section");
    expect(section?.type).toBe("unknown");

    const updatePatch = {
      status: undefined,
      title: "Updated title",
      seo: { title: undefined, description: "Updated description", socialImageAssetId: undefined },
    } as unknown as Parameters<typeof repo.updatePage>[1];

    const updated = await repo.updatePage("stored-page", updatePatch);

    expect(updated?.status).toBe("draft");
    expect(updated?.title).toBe("Updated title");
    expect(updated?.seo.description).toBe("Updated description");

    const reloaded = await repo.getPageById("stored-page");
    expect(reloaded?.status).toBe("draft");
    expect(reloaded?.seo.description).toBe("Updated description");
  });

  it("builds controlled delivery responses for malformed content", () => {
    const response = buildPublicDeliveryResponse(
      {
        ...basePage,
        status: "draft",
        title: undefined,
        path: undefined,
        sections: [
          {
            id: "section-1",
            organizationId: "org-1",
            siteId: "site-1",
            pageId: "page-1",
            type: "not-real",
            label: undefined,
            position: -1,
            status: "broken",
            content: undefined,
            settings: undefined,
            createdAt: undefined,
            updatedAt: undefined,
          },
        ],
      },
      "staging",
    );

    expect(response.page.sections[0].type).toBe("unknown");
    expect(response.page.sections[0].label).toBe("");
    expect(response.status).toBe(200);
    expect(response.issues.some((issue) => issue.path === "title")).toBe(true);
  });

  it("normalizes malformed public delivery content without throwing", () => {
    expect(() => buildPublicDeliveryResponse(null, "staging")).not.toThrow();
    const response = buildPublicDeliveryResponse(null, "staging");
    expect(response.page.title).toBe("");
  });
});
