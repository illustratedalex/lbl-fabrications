import Image from "next/image";

type MaterialCardProps = {
  title: string;
  description?: string | null;
  details?: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function MaterialCard({ title, description, details = [], imageUrl, imageAlt }: MaterialCardProps) {
  return (
    <article className="site-card material-card">
      <div className="material-card__media">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 33vw" className="material-card__image" />
        ) : (
          <div className="material-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="material-card__body">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        {details.length > 0 ? (
          <ul>
            {details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
