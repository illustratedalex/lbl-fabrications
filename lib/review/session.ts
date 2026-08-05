import { createHmac, timingSafeEqual } from "node:crypto";

export type ReviewViewport = {
  width: number;
  height: number;
  devicePixelRatio: number;
};

export type ReviewSessionTokenPayload = {
  version: 1;
  allowedAction: "submit_feedback";
  siteSlug: string;
  siteId: string;
  organizationId: string;
  pageId: string;
  pagePath: string;
  pageTitle: string;
  pageLabel: string;
  sectionId: string | null;
  sectionType: string | null;
  sectionLabel: string | null;
  userId: string;
  userUuid: string | null;
  userName: string;
  userRole: string;
  issuedAt: number;
  expiresAt: number;
};

export type ReviewSession = {
  token: string;
  payload: ReviewSessionTokenPayload;
};

function getSecret() {
  const secret = process.env.DEADSIGNAL_REVIEW_SESSION_SECRET?.trim();
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DEADSIGNAL_REVIEW_SESSION_SECRET is required in production.");
  }

  return "deadsignal-review-session-dev-secret";
}

function decodePayload(encodedPayload: string) {
  return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as ReviewSessionTokenPayload;
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");
}

function isValidPayload(payload: ReviewSessionTokenPayload) {
  return payload.version === 1
    && payload.allowedAction === "submit_feedback"
    && typeof payload.siteSlug === "string"
    && typeof payload.siteId === "string"
    && typeof payload.organizationId === "string"
    && typeof payload.pageId === "string"
    && typeof payload.pagePath === "string"
    && typeof payload.pageTitle === "string"
    && typeof payload.pageLabel === "string"
    && typeof payload.userId === "string"
    && typeof payload.userName === "string"
    && typeof payload.userRole === "string"
    && Number.isFinite(payload.issuedAt)
    && Number.isFinite(payload.expiresAt)
    && payload.expiresAt > payload.issuedAt;
}

export function createReviewSessionToken(payload: ReviewSessionTokenPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyReviewSessionToken(token: string): ReviewSession | null {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = decodePayload(encodedPayload);
    if (!isValidPayload(payload) || payload.expiresAt <= Date.now()) {
      return null;
    }

    return { token, payload };
  } catch {
    return null;
  }
}

export function buildReviewSessionUrl(baseUrl: string, pagePath: string, token: string) {
  const url = new URL(baseUrl);
  url.pathname = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  url.searchParams.set("review", token);
  return url.toString();
}
