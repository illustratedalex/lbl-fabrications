import { NextResponse, type NextRequest } from "next/server";

const REQUEST_TIMEOUT_MS = 8000;

function getMainPlatformBaseUrl() {
  return process.env.DEADSIGNAL_MAIN_PLATFORM_URL?.trim() || "http://localhost:3000";
}

async function proxyFeedback(body: unknown) {
  try {
    const response = await fetch(`${getMainPlatformBaseUrl()}/api/review/feedback`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyFeedback(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit review feedback.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
