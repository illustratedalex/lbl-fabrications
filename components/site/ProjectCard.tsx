import Image from "next/image";

type ProjectCardProps = {
  category?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  href?: string | null;
};

export function ProjectCard({ category, title, description, location, imageUrl, imageAlt, href }: ProjectCardProps) {
  const card = (
    <>
      <div className="project-card__media">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 33vw" className="project-card__image" />
        ) : (
          <div className="project-card__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="project-card__body">
        {category ? <p className="site-card-eyebrow">{category}</p> : null}
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        {location ? <p className="project-card__location">{location}</p> : null}
      </div>
    </>
  );

  if (href) {
    return <a href={href} className="site-card project-card">{card}</a>;
  }

  return <article className="site-card project-card">{card}</article>;
}
