import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getReviewDashboardSummary,
  listReviewDeployments,
  listReviewFeedback,
  listReviewNotifications,
  listReviewTimeline,
  listReviewVersions,
  markNotificationsRead,
} from "../../lib/review/review-api-client";

describe("review workflow thin client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads workflow snapshot data from the main platform API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: {
          openFeedback: 1,
          readyForReview: 2,
          pendingApproval: 3,
          publishedToday: 1,
          lastDeployment: null,
        },
        workflows: [
          {
            feedbackId: "feedback-1",
            siteSlug: "lbl-fabrications",
            pageId: "home",
            sectionId: "hero",
            status: "ready_for_review",
            priority: "normal",
            assignedDeveloperId: "dev-1",
            assignedReviewerId: "rev-1",
            dueAt: null,
            releaseVersion: null,
            publishedAt: null,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        events: [
          {
            id: "event-1",
            siteSlug: "lbl-fabrications",
            pageId: "home",
            feedbackId: "feedback-1",
            type: "status_changed",
            summary: "Status changed",
            createdAt: "2026-01-01T00:00:00.000Z",
            actorUserId: "dev-1",
          },
        ],
        notifications: [
          {
            id: "notification-1",
            siteSlug: "lbl-fabrications",
            feedbackId: "feedback-1",
            type: "ready_for_review",
            title: "Ready for review",
            body: "A feedback item is ready.",
            createdAt: "2026-01-01T00:00:00.000Z",
            readAt: null,
          },
        ],
        versions: [
          {
            id: "version-1",
            siteSlug: "lbl-fabrications",
            pageId: "home",
            version: 1,
            publisherName: "Publisher",
            createdAt: "2026-01-01T00:00:00.000Z",
            feedbackCount: 1,
            feedbackIds: ["feedback-1"],
          },
        ],
        releases: [
          {
            id: "release-1",
            siteSlug: "lbl-fabrications",
            pageId: "home",
            version: 1,
            recordedByName: "Publisher",
            recordedAt: "2026-01-01T00:00:00.000Z",
            feedbackIds: ["feedback-1"],
          },
        ],
      }),
    } as Response);

    const [summary, feedback, timeline, notifications, versions, deployments] = await Promise.all([
      getReviewDashboardSummary("lbl-fabrications"),
      listReviewFeedback("lbl-fabrications"),
      listReviewTimeline("lbl-fabrications"),
      listReviewNotifications("lbl-fabrications"),
      listReviewVersions("lbl-fabrications"),
      listReviewDeployments("lbl-fabrications"),
    ]);

    expect(fetchMock).toHaveBeenCalled();
    expect(summary.openFeedback).toBe(1);
    expect(feedback[0]?.id).toBe("feedback-1");
    expect(timeline[0]?.id).toBe("event-1");
    expect(notifications[0]?.id).toBe("notification-1");
    expect(versions[0]?.versionNumber).toBe(1);
    expect(deployments[0]?.versionNumber).toBe(1);
  });

  it("forwards notification read updates to main platform API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    await markNotificationsRead("lbl-fabrications", ["notification-1"]);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe("http://localhost:3000/api/review/notifications");
    expect(init).toEqual(expect.objectContaining({ method: "POST" }));
  });
});
