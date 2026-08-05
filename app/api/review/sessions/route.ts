import { NextResponse, type NextRequest } from "next/server";
import { fetchHomepageContent } from "../../../../lib/deadsignal-content";
import { normalizePublicContentPage } from "../../../../lib/deadsignal-content/normalization";

const SITE_SLUG = "lbl-fabrications";
const REQUEST_TIMEOUT_MS = 8000;

function getMainPlatformBaseUrl() {
  return process.env.DEADSIGNAL_MAIN_PLATFORM_URL?.trim() || "http://localhost:3000";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { sectionId?: string | null };
    const result = await fetchHomepageContent();
    const page = normalizePublicContentPage(result.page);
    const section = body.sectionId ? page.sections.find((item) => item.id === body.sectionId) ?? null : null;
    try {
      const response = await fetch(`${getMainPlatformBaseUrl()}/api/review/sessions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          siteSlug: SITE_SLUG,
          siteId: page.siteSlug,
          organizationId: page.siteSlug,
          pageId: page.pageId,
          pagePath: page.path,
          pageTitle: page.title,
          pageLabel: page.title,
          sectionId: section?.id ?? null,
          sectionType: section?.type ?? null,
          sectionLabel: section?.label ?? null,
          userId: "reviewer-client",
          userUuid: null,
          userName: "Client reviewer",
          userRole: "client",
          targetOrigin: request.nextUrl.origin,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const payload = (await response.json().catch(() => ({ error: "Invalid response from review backend." }))) as unknown;
      return NextResponse.json(payload, { status: response.status });
    } catch (error) {
      if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
        return NextResponse.json({ error: "Main platform review service timed out." }, { status: 504 });
      }

      return NextResponse.json({ error: "Main platform review service is unavailable." }, { status: 502 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create review session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
