import Link from "next/link";
import { ReviewModeButton } from "../../components/workspace/ReviewModeButton";

export default async function WorkspacePage() {
  const siteSlug = "lbl-fabrications";
  const compassBase = process.env.DEADSIGNAL_MAIN_PLATFORM_URL?.trim() || "http://localhost:3000";
  const compassFeedbackUrl = `${compassBase}/compass/feedback?site=${encodeURIComponent(siteSlug)}`;

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Client Workspace</p>
        <h1>LBL x DeadSignal Review Staging</h1>
        <p className="lede">
          This staging app captures review notes only. Workflow ownership, approvals, notifications, and publishing are managed in Compass.
        </p>
        <div className="actions">
          <ReviewModeButton siteSlug={siteSlug} pageId="home" label="Open staging review" />
          <Link href={compassFeedbackUrl} className="button" target="_blank" rel="noreferrer noopener">
            Open Compass workflow
          </Link>
        </div>
      </section>

      <section className="content-section">
        <h2>Workflow Ownership</h2>
        <p>
          Use Compass as the source of truth for assignment, status transitions, timeline activity, notifications, and publish history.
        </p>
        <p>
          This standalone app remains a thin client for page-level review submission and staging content previews.
        </p>
      </section>
    </main>
  );
}
