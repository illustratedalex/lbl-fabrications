import type { WorkspacePage } from "./types";
import { normalizeWorkspacePage } from "./normalization";
import { validatePageCompletion } from "./validation";

export type PublicDeliveryAudience = "staging" | "production";

export type PublicDeliveryResponse =
  | {
      ok: true;
      status: 200;
      page: WorkspacePage;
      issues: ReturnType<typeof validatePageCompletion>;
    }
  | {
      ok: false;
      status: 422;
      page: WorkspacePage;
      issues: ReturnType<typeof validatePageCompletion>;
      reason: string;
    };

export function buildPublicDeliveryResponse(rawPage: unknown, audience: PublicDeliveryAudience): PublicDeliveryResponse {
  const normalizedPage = normalizeWorkspacePage(rawPage);
  const issues = validatePageCompletion(normalizedPage);
  const hasErrors = issues.some((issue) => issue.severity === "error");
  const isPublished = normalizedPage.status === "published";
  const isApproved = normalizedPage.status === "approved";

  if (hasErrors || (audience === "production" && !isPublished && !isApproved)) {
    return {
      ok: false,
      status: 422,
      page: normalizedPage,
      issues,
      reason: hasErrors ? "Malformed content could not be delivered." : "Content is not approved for production delivery.",
    };
  }

  return {
    ok: true,
    status: 200,
    page: normalizedPage,
    issues,
  };
}

export function normalizePublicDeliveryPage(rawPage: unknown): WorkspacePage {
  return normalizeWorkspacePage(rawPage);
}
