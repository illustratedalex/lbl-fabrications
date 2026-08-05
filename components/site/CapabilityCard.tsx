type CapabilityCardProps = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  href?: string | null;
};

export function CapabilityCard({ eyebrow, title, description, href }: CapabilityCardProps) {
  const content = (
    <>
      {eyebrow ? <p className="site-card-eyebrow">{eyebrow}</p> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {href ? <span className="site-inline-link">Explore</span> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className="site-card capability-card">
        {content}
      </a>
    );
  }

  return <article className="site-card capability-card">{content}</article>;
}
