import Image from "next/image";

type HeroProps = {
  eyebrow?: string | null;
  title: string;
  body?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  backgroundUrl?: string | null;
  backgroundAlt?: string | null;
  trustItems?: string[];
};

export function Hero({
  eyebrow,
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  backgroundUrl,
  backgroundAlt,
  trustItems = [],
}: HeroProps) {
  return (
    <section className="site-hero">
      <div className="site-hero__media" aria-hidden={backgroundUrl ? undefined : true}>
        {backgroundUrl ? <Image src={backgroundUrl} alt={backgroundAlt || title} fill priority sizes="100vw" className="site-hero__image" /> : null}
        <div className="site-hero__scrim" />
      </div>
      <div className="site-hero__content">
        {eyebrow ? <p className="site-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {body ? <p className="site-hero__lede">{body}</p> : null}
        <div className="site-actions">
          {primaryLabel && primaryHref ? <a href={primaryHref} className="site-button site-button--primary">{primaryLabel}</a> : null}
          {secondaryLabel && secondaryHref ? <a href={secondaryHref} className="site-button site-button--secondary">{secondaryLabel}</a> : null}
        </div>
        {trustItems.length > 0 ? (
          <ul className="site-hero__trust">
            {trustItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
