type QuoteCTAProps = {
  title: string;
  body?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
};

export function QuoteCTA({ title, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: QuoteCTAProps) {
  return (
    <section className="quote-cta">
      <div>
        <p className="site-eyebrow">Start a project</p>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      <div className="site-actions">
        {primaryLabel && primaryHref ? <a href={primaryHref} className="site-button site-button--primary">{primaryLabel}</a> : null}
        {secondaryLabel && secondaryHref ? <a href={secondaryHref} className="site-button site-button--secondary">{secondaryLabel}</a> : null}
      </div>
    </section>
  );
}
