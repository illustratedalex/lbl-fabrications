import Image from "next/image";
import type { PublicContentAsset, PublicContentPage, PublicContentSection } from "../../lib/deadsignal-content";
import { normalizePublicContentPage } from "../../lib/deadsignal-content/normalization";
import { CapabilityCard } from "../site/CapabilityCard";
import { ContactBand } from "../site/ContactBand";
import { Hero } from "../site/Hero";
import { MaterialCard } from "../site/MaterialCard";
import { ProcessStep } from "../site/ProcessStep";
import { ProjectCard } from "../site/ProjectCard";
import { QuoteCTA } from "../site/QuoteCTA";
import { SectionHeading } from "../site/SectionHeading";

type SectionRendererProps = {
  section: PublicContentSection;
  assetsById: Record<string, PublicContentAsset>;
};

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asTextArray(value: unknown) {
  return asArray(value).map((item) => asText(item)).filter((item): item is string => Boolean(item));
}

function resolveAsset(assetId: string | null, assetsById: Record<string, PublicContentAsset>) {
  if (!assetId) {
    return null;
  }
  return assetsById[assetId] ?? null;
}

function HeroSection({ section, assetsById }: SectionRendererProps) {
  const content = asRecord(section.content);
  const background = resolveAsset(asText(content.backgroundAssetId), assetsById);

  return (
    <Hero
      eyebrow={asText(content.eyebrow)}
      title={asText(content.heading) ?? "LBL Fabrications"}
      body={asText(content.body)}
      primaryLabel={asText(content.primaryButtonLabel)}
      primaryHref={asText(content.primaryButtonHref)}
      secondaryLabel={asText(content.secondaryButtonLabel)}
      secondaryHref={asText(content.secondaryButtonHref)}
      backgroundUrl={background?.url ?? null}
      backgroundAlt={background?.altText ?? background?.name ?? null}
      trustItems={asTextArray(content.trustItems)}
    />
  );
}

function RichTextSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  const heading = asText(content.heading);
  const body = asText(content.body);
  const bullets = asTextArray(content.bullets);

  if (!heading && !body && bullets.length === 0) {
    return null;
  }

  const paragraphs = (body ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="site-section site-section--rich-text">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={heading ?? section.label} body={paragraphs[0] ?? null} />
      <div className="site-rich-text">
        {(paragraphs.length > 1 ? paragraphs.slice(1) : []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {bullets.length > 0 ? (
          <ul>
            {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StatsSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  const items = asArray(content.items)
    .map((item) => asRecord(item))
    .map((item) => ({
      value: asText(item.value),
      label: asText(item.label),
      description: asText(item.description),
    }))
    .filter((item) => item.value && item.label);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-section site-section--stats">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-stats-grid">
        {items.map((item) => (
          <div className="site-stat-card" key={`${item.value}-${item.label}`}>
            <ProcessStep step={item.value ?? ""} title={item.label ?? ""} body={item.description} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  const items = asArray(content.items)
    .map((item) => asRecord(item))
    .map((item) => ({
      eyebrow: asText(item.eyebrow),
      title: asText(item.title),
      description: asText(item.description),
      href: asText(item.href),
    }))
    .filter((item) => item.title);

  return (
    <section className="site-section">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-card-grid site-card-grid--capabilities">
        {items.map((item) => (
          <CapabilityCard
            key={item.title}
            eyebrow={item.eyebrow}
            title={item.title ?? ""}
            description={item.description}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}

function GallerySection({ section, assetsById }: SectionRendererProps) {
  const content = asRecord(section.content);
  const assetIds = asTextArray(content.assetIds ?? content.asset_ids);
  const captions = asTextArray(content.captions);
  const layout = asText(content.layout);
  const assets = assetIds.map((assetId, index) => ({
    asset: resolveAsset(assetId, assetsById),
    caption: captions[index] ?? null,
  })).filter((item) => item.asset?.url);

  if (assets.length === 0) {
    return null;
  }

  return (
    <section className="site-section">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      {layout === "split" ? (
        <div className="site-card-grid site-card-grid--materials">
          {assets.map(({ asset, caption }) => (
            <MaterialCard
              key={asset!.id}
              title={caption ?? asset!.name}
              description={asset!.altText}
              imageUrl={asset!.url}
              imageAlt={asset!.altText ?? asset!.name}
            />
          ))}
        </div>
      ) : (
        <div className="site-gallery-grid">
          {assets.map(({ asset, caption }) => (
            <figure className="site-gallery-item" key={asset!.id}>
              <div className="site-gallery-item__media">
                <Image src={asset!.url ?? ""} alt={asset!.altText ?? asset!.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="site-gallery-item__image" />
              </div>
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectsSection({ section, assetsById }: SectionRendererProps) {
  const content = asRecord(section.content);
  const items = asArray(content.items)
    .map((item) => asRecord(item))
    .map((item) => {
      const asset = resolveAsset(asText(item.imageAssetId), assetsById);
      return {
        category: asText(item.category),
        title: asText(item.title),
        description: asText(item.description),
        location: asText(item.location),
        href: asText(item.href),
        imageUrl: asset?.url ?? null,
        imageAlt: asset?.altText ?? asset?.name ?? null,
      };
    })
    .filter((item) => item.title);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-section">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-card-grid site-card-grid--projects">
        {items.map((item) => (
          <ProjectCard key={item.title} {...item} title={item.title ?? ""} />
        ))}
      </div>
    </section>
  );
}

function VideoSection({ section, assetsById }: SectionRendererProps) {
  const content = asRecord(section.content);
  const poster = resolveAsset(asText(content.posterAssetId ?? content.poster_asset_id), assetsById);
  const videoUrl = asText(content.videoUrl);

  return (
    <section className="site-section site-section--video">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-video-card">
        <div className="site-video-card__media">
          {poster?.url ? <Image src={poster.url} alt={poster.altText ?? poster.name} fill sizes="100vw" className="site-video-card__image" /> : null}
          <div className="site-video-card__overlay" />
          <div className="site-video-card__content">
            <p>{videoUrl ? "Video-ready content area" : "Video section placeholder"}</p>
            {videoUrl ? <a href={videoUrl} className="site-button site-button--secondary">Open video</a> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  const items = asArray(content.items)
    .map((item) => asRecord(item))
    .map((item) => ({
      quote: asText(item.quote),
      name: asText(item.name),
      role: asText(item.role),
      company: asText(item.company),
    }))
    .filter((item) => item.quote);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-section site-section--testimonials">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-testimonial-grid">
        {items.map((item) => (
          <blockquote className="site-testimonial" key={item.quote}>
            <p>“{item.quote}”</p>
            {(item.name || item.role || item.company) ? (
              <footer>
                <span>{item.name ?? "Published testimonial"}</span>
                {item.role || item.company ? <small>{[item.role, item.company].filter(Boolean).join(" • ")}</small> : null}
              </footer>
            ) : null}
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  const items = asArray(content.items)
    .map((item) => asRecord(item))
    .map((item) => ({ question: asText(item.question), answer: asText(item.answer) }))
    .filter((item) => item.question && item.answer);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="site-section site-section--faq">
      <SectionHeading eyebrow={asText(content.eyebrow)} title={asText(content.heading) ?? section.label} body={asText(content.body)} />
      <div className="site-faq-list">
        {items.map((item) => (
          <details key={item.question} className="site-faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  return (
    <QuoteCTA
      title={asText(content.heading) ?? section.label}
      body={asText(content.body)}
      primaryLabel={asText(content.buttonLabel)}
      primaryHref={asText(content.buttonHref)}
      secondaryLabel={asText(content.secondaryButtonLabel)}
      secondaryHref={asText(content.secondaryButtonHref)}
    />
  );
}

function ContactSection({ section }: SectionRendererProps) {
  const content = asRecord(section.content);
  return (
    <ContactBand
      title={asText(content.heading) ?? section.label}
      body={asText(content.body)}
      phone={asText(content.phone)}
      address={asText(content.address)}
      serviceArea={asText(content.serviceArea)}
    />
  );
}

function UnsupportedSection({ section }: SectionRendererProps) {
  return (
    <section className="site-section">
      <SectionHeading eyebrow="Content Builder" title={section.label || "Unsupported section"} body="This section type is configured in the builder and will render here once support is available." />
    </section>
  );
}

function SectionRenderer({ section, assetsById }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} assetsById={assetsById} />;
    case "rich_text":
      return <RichTextSection section={section} assetsById={assetsById} />;
    case "stats":
      return <StatsSection section={section} assetsById={assetsById} />;
    case "services":
      return <ServicesSection section={section} assetsById={assetsById} />;
    case "gallery":
      return <GallerySection section={section} assetsById={assetsById} />;
    case "projects":
      return <ProjectsSection section={section} assetsById={assetsById} />;
    case "video":
      return <VideoSection section={section} assetsById={assetsById} />;
    case "testimonials":
      return <TestimonialsSection section={section} assetsById={assetsById} />;
    case "faq":
      return <FaqSection section={section} assetsById={assetsById} />;
    case "cta":
      return <CtaSection section={section} assetsById={assetsById} />;
    case "contact":
      return <ContactSection section={section} assetsById={assetsById} />;
    default:
      return <UnsupportedSection section={section} assetsById={assetsById} />;
  }
}

export function PageRenderer({ page }: { page: PublicContentPage }) {
  const normalizedPage = normalizePublicContentPage(page);
  const ordered = [...normalizedPage.sections].sort((a, b) => a.position - b.position);

  return (
    <div data-review-page-id={normalizedPage.pageId} data-review-page-path={normalizedPage.path}>
      {ordered.map((section) => (
        <div
          key={section.id}
          data-review-section-id={section.id}
          data-review-section-type={section.type}
          data-review-section-label={section.label}
        >
          <SectionRenderer section={section} assetsById={normalizedPage.assetsById} />
        </div>
      ))}
    </div>
  );
}
