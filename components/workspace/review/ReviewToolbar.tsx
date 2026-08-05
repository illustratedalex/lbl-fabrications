import { ReviewStatusBadge } from "./ReviewStatusBadge";

type ReviewToolbarProps = {
  pageLabel: string;
  selectedSectionLabel: string;
  selectedSectionType: string;
  onSubmit: () => void;
  onExit: () => void;
  onTogglePanel: () => void;
  busy?: boolean;
  submitLabel?: string;
};

export function ReviewToolbar({ pageLabel, selectedSectionLabel, selectedSectionType, onSubmit, onExit, onTogglePanel, busy = false, submitLabel = "Submit" }: ReviewToolbarProps) {
  return (
    <header className="review-toolbar">
      <div className="review-toolbar__inner">
        <div>
          <p className="eyebrow">Review mode</p>
          <h2>{pageLabel}</h2>
          <p className="review-item-copy">
            Selected section: <span className="font-semibold text-[#1a130d]">{selectedSectionLabel}</span> {selectedSectionType ? `(${selectedSectionType})` : ""}
          </p>
        </div>
        <div className="actions">
          <ReviewStatusBadge status="ready_for_review" />
          <button type="button" onClick={onTogglePanel} className="button button-secondary">
            Review panel
          </button>
          <button type="button" onClick={onExit} className="button button-secondary">
            Exit review
          </button>
          <button type="button" onClick={onSubmit} disabled={busy} className="button button-primary">
            {busy ? "Sending..." : submitLabel}
          </button>
        </div>
      </div>
      <p className="review-meta">Esc closes review mode • Click a section to attach feedback</p>
    </header>
  );
}
