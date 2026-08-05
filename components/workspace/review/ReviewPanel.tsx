type ReviewPanelProps = {
  open: boolean;
  title: string;
  description: string;
  priority: string;
  busy?: boolean;
  successMessage?: string | null;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  sectionLabel: string;
  pageLabel: string;
};

export function ReviewPanel({
  open,
  title,
  description,
  priority,
  busy = false,
  successMessage,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onSubmit,
  onClose,
  sectionLabel,
  pageLabel,
}: ReviewPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <aside className="review-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Feedback drawer</p>
          <h2>{sectionLabel}</h2>
          <p className="review-item-copy">{pageLabel}</p>
        </div>
        <button type="button" onClick={onClose} className="button button-secondary">
          Close
        </button>
      </div>

      <div className="review-form-grid">
        <label className="review-field">
          Title
          <input value={title} onChange={(event) => onTitleChange(event.target.value)} className="review-input" placeholder="Short summary" />
        </label>
        <label className="review-field">
          Feedback
          <textarea value={description} onChange={(event) => onDescriptionChange(event.target.value)} rows={5} className="review-textarea" placeholder="Describe the issue or request" />
        </label>
        <label className="review-field">
          Priority
          <select value={priority} onChange={(event) => onPriorityChange(event.target.value)} className="review-select">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>

      {successMessage ? <p className="review-success">{successMessage}</p> : null}

      <div className="actions">
        <button type="button" onClick={onClose} className="button button-secondary">
          Cancel
        </button>
        <button type="button" onClick={onSubmit} disabled={busy || description.trim().length < 10} className="button button-primary">
          {busy ? "Submitting..." : "Submit feedback"}
        </button>
      </div>
    </aside>
  );
}
