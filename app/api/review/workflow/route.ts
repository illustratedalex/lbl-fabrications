import { NextResponse, type NextRequest } from "next/server";

const SITE_SLUG = "lbl-fabrications";
const REQUEST_TIMEOUT_MS = 8000;

function getMainPlatformBaseUrl() {
  return process.env.DEADSIGNAL_MAIN_PLATFORM_URL?.trim() || "http://localhost:3000";
}

async function proxyWorkflow(url: string, init: RequestInit) {
  try {
    const response = await fetch(url, {
      ...init,
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
}

export async function GET(request: NextRequest) {
  const targetUrl = new URL("/api/review/workflow", getMainPlatformBaseUrl());
  targetUrl.searchParams.set("site", SITE_SLUG);
  const page = request.nextUrl.searchParams.get("page");
  if (page) {
    targetUrl.searchParams.set("page", page);
  }

  return proxyWorkflow(targetUrl.toString(), { method: "GET" });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return proxyWorkflow(`${getMainPlatformBaseUrl()}/api/review/workflow`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...(typeof body === "object" && body ? body : {}),
      siteSlug: SITE_SLUG,
    }),
  });
}
