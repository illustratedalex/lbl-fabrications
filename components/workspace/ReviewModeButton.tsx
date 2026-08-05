"use client";

import { useState } from "react";

type ReviewModeButtonProps = {
  siteSlug: string;
  pageId: string;
  sectionId?: string | null;
  label?: string;
};

export function ReviewModeButton({ siteSlug, pageId, sectionId, label = "Open review mode" }: ReviewModeButtonProps) {
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/review/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          siteSlug,
          pageId,
          sectionId,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Unable to open review mode.");
      }

      const payload = (await response.json()) as { reviewUrl?: string };
      if (!payload.reviewUrl) {
        throw new Error("Review session response missing a URL.");
      }

      window.open(payload.reviewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to open review mode.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="button button-primary review-button"
      >
        {busy ? "Preparing review mode..." : label}
      </button>
      {errorMessage ? <p className="text-sm text-[#8f2f2f]">{errorMessage}</p> : null}
    </div>
  );
}
