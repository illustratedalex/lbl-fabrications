import type { ReviewStatus } from "../../../lib/review/review-api-client";

type ReviewStatusBadgeProps = {
  status: ReviewStatus;
  className?: string;
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  ready_for_review: "Ready for Review",
  approved: "Approved",
  published: "Published",
  rejected: "Rejected",
};

export function ReviewStatusBadge({ status, className = "" }: ReviewStatusBadgeProps) {
  return <span className={`review-status-badge review-status-${status} ${className}`.trim()}>{STATUS_LABELS[status]}</span>;
}
