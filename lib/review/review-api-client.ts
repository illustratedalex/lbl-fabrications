import "server-only";

const SITE_SLUG = "lbl-fabrications";
const REQUEST_TIMEOUT_MS = 8000;

export const REVIEW_STATUSES = ["new", "in_progress", "ready_for_review", "approved", "published", "rejected"] as const;
export const REVIEW_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const REVIEW_SOURCES = ["preview"] as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type ReviewPriority = (typeof REVIEW_PRIORITIES)[number];
export type ReviewSource = (typeof REVIEW_SOURCES)[number];
export type ReviewEventKind =
  | "feedback_created"
  | "content_edited"
  | "status_changed"
  | "approval"
  | "publish"
  | "comment_added"
  | "notification";
export type ReviewNotificationKind =
  | "feedback_assigned"
  | "ready_for_review"
  | "approved"
  | "rejected"
  | "published";

export type ReviewComment = {
  id: string;
  body: string;
  createdBy: string;
  createdAt: string;
};

export type ReviewFeedback = {
  id: string;
  siteSlug: string;
  pageId: string;
  pagePath: string;
  pageTitle: string;
  pageLabel: string;
  sectionId: string | null;
  sectionType: string | null;
  sectionLabel: string | null;
  url: string;
  priority: ReviewPriority;
  status: ReviewStatus;
  source: ReviewSource;
  createdBy: string;
  assignedDeveloper: string | null;
  assignedReviewer: string | null;
  dueDate: string | null;
  title: string;
  description: string;
  comments: ReviewComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  publishedAt: string | null;
  versionNumber: number | null;
  associatedFeedbackIds: string[];
};

export type ReviewEvent = {
  id: string;
  siteSlug: string;
  pageId: string;
  feedbackId: string | null;
  kind: ReviewEventKind;
  title: string;
  detail: string;
  createdAt: string;
  actor: string;
};

export type ReviewNotification = {
  id: string;
  siteSlug: string;
  pageId: string;
  feedbackId: string | null;
  kind: ReviewNotificationKind;
  title: string;
  detail: string;
  createdAt: string;
  readAt: string | null;
};

export type ReviewVersion = {
  id: string;
  siteSlug: string;
  pageId: string;
  versionNumber: number;
  publisher: string;
  publishedAt: string;
  feedbackCount: number;
  feedbackIds: string[];
  summary: string;
};

export type ReviewDeployment = {
  id: string;
  siteSlug: string;
  pageId: string;
  versionNumber: number;
  publisher: string;
  publishedAt: string;
  feedbackIds: string[];
  summary: string;
};

export type ReviewDashboardSummary = {
  openFeedback: number;
  readyForReview: number;
  pendingApproval: number;
  publishedToday: number;
  lastDeployment: ReviewDeployment | null;
};

function getMainPlatformBaseUrl() {
  return process.env.DEADSIGNAL_MAIN_PLATFORM_URL?.trim() || "http://localhost:3000";
}

async function fetchMainPlatformJson<T>(path: string, init: RequestInit, fallbackMessage: string) {
  try {
    const response = await fetch(new URL(path, getMainPlatformBaseUrl()), {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
    if (!response.ok) {
      throw new Error(payload.error ?? fallbackMessage);
    }

    return payload;
  } catch (error) {
    if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
      throw new Error("Main platform review service timed out.");
    }

    throw error instanceof Error ? error : new Error(fallbackMessage);
  }
}

function workflowUrl(pageId?: string) {
  const url = new URL("/api/review/workflow", getMainPlatformBaseUrl());
  url.searchParams.set("site", SITE_SLUG);
  if (pageId) {
    url.searchParams.set("page", pageId);
  }
  return url.toString();
}

async function fetchSnapshot(pageId?: string) {
  return fetchMainPlatformJson<{
    summary: ReviewDashboardSummary;
    workflows: Array<{
      feedbackId: string;
      siteSlug: string;
      pageId: string | null;
      sectionId: string | null;
      status: ReviewStatus;
      priority: ReviewPriority;
      assignedDeveloperId: string | null;
      assignedReviewerId: string | null;
      dueAt: string | null;
      releaseVersion: number | null;
      publishedAt: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    events: Array<{
      id: string;
      siteSlug: string;
      pageId: string | null;
      feedbackId: string | null;
      type: string;
      summary: string;
      createdAt: string;
      actorUserId: string | null;
    }>;
    notifications: Array<{
      id: string;
      siteSlug: string;
      feedbackId: string | null;
      type: string;
      title: string;
      body: string;
      createdAt: string;
      readAt: string | null;
    }>;
    versions: Array<{
      id: string;
      siteSlug: string;
      pageId: string | null;
      version: number;
      publisherName: string;
      createdAt: string;
      feedbackCount: number;
      feedbackIds: string[];
    }>;
    releases: Array<{
      id: string;
      siteSlug: string;
      pageId: string | null;
      version: number;
      recordedByName: string;
      recordedAt: string;
      feedbackIds: string[];
    }>;
  }>(workflowUrl(pageId), { method: "GET" }, "Unable to load review workflow.");
}

function mapWorkflowToReviewFeedback(workflow: Awaited<ReturnType<typeof fetchSnapshot>>["workflows"][number]): ReviewFeedback {
  return {
    id: workflow.feedbackId,
    siteSlug: workflow.siteSlug,
    pageId: workflow.pageId ?? "unknown",
    pagePath: "/",
    pageTitle: "Untitled page",
    pageLabel: "Untitled page",
    sectionId: workflow.sectionId,
    sectionType: null,
    sectionLabel: null,
    url: "",
    priority: workflow.priority,
    status: workflow.status,
    source: "preview",
    createdBy: "Workspace member",
    assignedDeveloper: workflow.assignedDeveloperId,
    assignedReviewer: workflow.assignedReviewerId,
    dueDate: workflow.dueAt,
    title: "Feedback",
    description: "Feedback details are managed in Compass.",
    comments: [],
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
    resolvedAt: workflow.publishedAt,
    publishedAt: workflow.publishedAt,
    versionNumber: workflow.releaseVersion,
    associatedFeedbackIds: [],
  };
}

function mapEvent(event: Awaited<ReturnType<typeof fetchSnapshot>>["events"][number]): ReviewEvent {
  return {
    id: event.id,
    siteSlug: event.siteSlug,
    pageId: event.pageId ?? "",
    feedbackId: event.feedbackId,
    kind: "status_changed",
    title: "Workflow activity",
    detail: event.summary,
    createdAt: event.createdAt,
    actor: event.actorUserId ?? "Workspace member",
  };
}

function mapNotification(notification: Awaited<ReturnType<typeof fetchSnapshot>>["notifications"][number]): ReviewNotification {
  return {
    id: notification.id,
    siteSlug: notification.siteSlug,
    pageId: "",
    feedbackId: notification.feedbackId,
    kind: "published",
    title: notification.title,
    detail: notification.body,
    createdAt: notification.createdAt,
    readAt: notification.readAt,
  };
}

function mapVersion(version: Awaited<ReturnType<typeof fetchSnapshot>>["versions"][number]): ReviewVersion {
  return {
    id: version.id,
    siteSlug: version.siteSlug,
    pageId: version.pageId ?? "",
    versionNumber: version.version,
    publisher: version.publisherName,
    publishedAt: version.createdAt,
    feedbackCount: version.feedbackCount,
    feedbackIds: version.feedbackIds,
    summary: `Version ${version.version}`,
  };
}

function mapRelease(release: Awaited<ReturnType<typeof fetchSnapshot>>["releases"][number]): ReviewDeployment {
  return {
    id: release.id,
    siteSlug: release.siteSlug,
    pageId: release.pageId ?? "",
    versionNumber: release.version,
    publisher: release.recordedByName,
    publishedAt: release.recordedAt,
    feedbackIds: release.feedbackIds,
    summary: `Version ${release.version}`,
  };
}

export async function listReviewFeedback(siteSlug: string) {
  void siteSlug;
  const snapshot = await fetchSnapshot();
  return snapshot.workflows.map(mapWorkflowToReviewFeedback);
}

export async function listReviewTimeline(siteSlug: string, pageId?: string) {
  void siteSlug;
  const snapshot = await fetchSnapshot(pageId);
  return snapshot.events.map(mapEvent);
}

export async function listReviewNotifications(siteSlug: string, pageId?: string) {
  void siteSlug;
  const snapshot = await fetchSnapshot(pageId);
  return snapshot.notifications.map(mapNotification);
}

export async function listReviewVersions(siteSlug: string, pageId?: string) {
  void siteSlug;
  const snapshot = await fetchSnapshot(pageId);
  return snapshot.versions.map(mapVersion);
}

export async function listReviewDeployments(siteSlug: string, pageId?: string) {
  void siteSlug;
  const snapshot = await fetchSnapshot(pageId);
  return snapshot.releases.map(mapRelease);
}

export async function getReviewDashboardSummary(siteSlug: string): Promise<ReviewDashboardSummary> {
  void siteSlug;
  const snapshot = await fetchSnapshot();
  const lastDeployment = snapshot.releases[0] ? mapRelease(snapshot.releases[0]) : null;
  return {
    openFeedback: snapshot.summary.openFeedback,
    readyForReview: snapshot.summary.readyForReview,
    pendingApproval: snapshot.summary.pendingApproval,
    publishedToday: snapshot.summary.publishedToday,
    lastDeployment,
  };
}

export async function markNotificationsRead(siteSlug: string, ids: string[]) {
  void siteSlug;
  await fetchMainPlatformJson<{ ok: true }>(
    "/api/review/notifications",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        siteSlug: SITE_SLUG,
        ids,
      }),
    },
    "Unable to update notifications.",
  );
}

export function getReviewPageSections(pageFeedback: ReviewFeedback[]) {
  return pageFeedback.map((item) => ({
    id: item.sectionId ?? item.id,
    label: item.sectionLabel ?? item.title,
    type: item.sectionType ?? "rich_text",
    status: item.status,
  }));
}