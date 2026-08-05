import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHomepageContent } from "../../lib/deadsignal-content/client";

describe("deadsignal content client", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("returns fallback when API config is missing", async () => {
    delete process.env.DEADSIGNAL_CONTENT_API_URL;
    delete process.env.DEADSIGNAL_CONTENT_API_KEY;

    const result = await fetchHomepageContent();

    expect(result.source).toBe("fallback");
    expect(result.reason).toMatch("Missing");
    expect(result.page.sections.length).toBeGreaterThan(0);
  });

  it("returns remote page when API succeeds", async () => {
    process.env.DEADSIGNAL_CONTENT_API_URL = "https://platform.example.com";
    process.env.DEADSIGNAL_CONTENT_API_KEY = "secret";

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          page: {
            pageId: "home-1",
            siteSlug: "lbl-fabrications",
            path: "/",
            title: "Homepage",
            status: "approved",
            seo: {
              title: "LBL",
              description: "Description",
              socialImageAssetId: null,
            },
            sections: [
              {
                id: "sec-b",
                type: "rich_text",
                label: "B",
                position: 2,
                status: "approved",
                content: { body: "second" },
                settings: {},
              },
              {
                id: "sec-a",
                type: "rich_text",
                label: "A",
                position: 1,
                status: "approved",
                content: { body: "first" },
                settings: {},
              },
            ],
            assetsById: {},
          },
          meta: {
            audience: "staging",
            generatedAt: new Date().toISOString(),
          },
        }),
      }) as unknown as Response) as unknown as typeof fetch,
    );

    const result = await fetchHomepageContent();

    expect(result.source).toBe("remote");
    expect(result.page.sections[0].id).toBe("sec-a");
  });
});
