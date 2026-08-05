import type { Metadata } from "next";
import { ContentModeBadge } from "../content/content-mode-badge";
import { PageRenderer } from "../content/page-renderer";
import { ReviewModeOverlay } from "../review/review-mode-overlay";
import { verifyReviewSessionToken } from "../../lib/review/session";
import { fetchContentPage, shouldNoIndex } from "../../lib/deadsignal-content/client";
import { normalizePublicContentPage } from "../../lib/deadsignal-content/normalization";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export async function generateSiteMetadata(path: string): Promise<Metadata> {
  const result = await fetchContentPage(path);
  const page = normalizePublicContentPage(result.page);
  const socialImage = page.seo.socialImageAssetId ? page.assetsById[page.seo.socialImageAssetId]?.url : null;

  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description ?? "LBL Fabrications website.",
    robots: shouldNoIndex()
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: page.seo.title ?? page.title,
      description: page.seo.description ?? "LBL Fabrications website.",
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
  };
}

type SitePageProps = {
  path: string;
  searchParams?: Promise<{ review?: string }>;
};

export async function SitePage({ path, searchParams }: SitePageProps) {
  const result = await fetchContentPage(path);
  const query = searchParams ? await searchParams : undefined;
  const reviewToken = query?.review ?? null;
  const reviewSession = reviewToken ? verifyReviewSessionToken(reviewToken) : null;
  const showContentModeBadge = process.env.NODE_ENV !== "production" || Boolean(reviewSession);
  const reviewApiUrl = process.env.DEADSIGNAL_REVIEW_API_URL?.trim() || "http://localhost:3000";

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">
        <div className="site-frame">
          <ContentModeBadge source={result.source} reason={result.reason} visible={showContentModeBadge} />
          {reviewToken && !reviewSession ? <p className="review-mode-invalid">Review session expired or is invalid.</p> : null}
          {reviewSession ? <ReviewModeOverlay reviewSession={reviewSession} apiBaseUrl={reviewApiUrl} /> : null}
          <PageRenderer page={result.page} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
