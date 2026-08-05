import { describe, expect, it } from "vitest";
import { createReviewSessionToken, verifyReviewSessionToken } from "../../lib/review/session";

describe("review session token", () => {
  it("verifies a valid token", () => {
    const now = Date.now();
    const token = createReviewSessionToken({
      version: 1,
      allowedAction: "submit_feedback",
      siteSlug: "lbl-fabrications",
      siteId: "site-1",
      organizationId: "org-1",
      pageId: "page-1",
      pagePath: "/",
      pageTitle: "Homepage",
      pageLabel: "Homepage",
      sectionId: null,
      sectionType: null,
      sectionLabel: null,
      userId: "user-1",
      userUuid: "uuid-1",
      userName: "Tester",
      userRole: "admin",
      issuedAt: now,
      expiresAt: now + 60_000,
    });

    const verified = verifyReviewSessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.payload.pageId).toBe("page-1");
  });

  it("rejects an expired token", () => {
    const now = Date.now();
    const token = createReviewSessionToken({
      version: 1,
      allowedAction: "submit_feedback",
      siteSlug: "lbl-fabrications",
      siteId: "site-1",
      organizationId: "org-1",
      pageId: "page-1",
      pagePath: "/",
      pageTitle: "Homepage",
      pageLabel: "Homepage",
      sectionId: null,
      sectionType: null,
      sectionLabel: null,
      userId: "user-1",
      userUuid: "uuid-1",
      userName: "Tester",
      userRole: "admin",
      issuedAt: now - 120_000,
      expiresAt: now - 60_000,
    });

    const verified = verifyReviewSessionToken(token);
    expect(verified).toBeNull();
  });
});
