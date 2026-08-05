"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReviewSession } from "../../lib/review/session";
import { ReviewPanel } from "../workspace/review/ReviewPanel";
import { ReviewToolbar } from "../workspace/review/ReviewToolbar";

type ReviewModeOverlayProps = {
  reviewSession: ReviewSession;
  apiBaseUrl: string;
};

function getViewport() {
  if (typeof window === "undefined") {
    return null;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

export function ReviewModeOverlay({ reviewSession, apiBaseUrl }: ReviewModeOverlayProps) {
  const [title, setTitle] = useState("Review note");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high" | "urgent">("normal");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState({
    id: reviewSession.payload.sectionId ?? "page",
    label: reviewSession.payload.sectionLabel ?? reviewSession.payload.pageLabel,
    type: reviewSession.payload.sectionType ?? "page",
  });

  const targetLabel = useMemo(() => {
    if (selectedSection.label) {
      return `${reviewSession.payload.pageLabel} / ${selectedSection.label}`;
    }

    return reviewSession.payload.pageLabel;
  }, [reviewSession.payload.pageLabel, selectedSection.label]);

  const handleExit = useCallback(() => {
    window.location.assign(reviewSession.payload.pagePath);
  }, [reviewSession.payload.pagePath]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const sectionElements = Array.from(document.querySelectorAll<HTMLElement>("[data-review-section-id]"));

    const applySelectedSection = (element: HTMLElement) => {
      const sectionLabel = element.dataset.reviewSectionLabel ?? element.dataset.reviewSectionId ?? "Section";
      const sectionType = element.dataset.reviewSectionType ?? "section";
      setSelectedSection({
        id: element.dataset.reviewSectionId ?? "page",
        label: sectionLabel,
        type: sectionType,
      });
      setPanelOpen(true);
      element.scrollIntoView({ block: "center", behavior: "smooth" });
      element.classList.add("review-target-highlight");
      window.setTimeout(() => element.classList.remove("review-target-highlight"), 1200);
    };

    sectionElements.forEach((element) => {
      element.classList.add("review-editable-section");
      element.tabIndex = 0;
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", `Review ${element.dataset.reviewSectionLabel ?? element.dataset.reviewSectionId ?? "section"}`);

      const handleClick = () => applySelectedSection(element);
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          applySelectedSection(element);
        }
      };

      element.addEventListener("click", handleClick);
      element.addEventListener("keydown", handleKeyDown);
      element.dataset.reviewActive = "true";
    });

    const initialTarget = reviewSession.payload.sectionId ? document.querySelector<HTMLElement>(`[data-review-section-id="${reviewSession.payload.sectionId}"]`) : null;
    if (initialTarget) {
      initialTarget.scrollIntoView({ block: "center", behavior: "smooth" });
      initialTarget.classList.add("review-target-highlight");
      window.setTimeout(() => initialTarget.classList.remove("review-target-highlight"), 1200);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleExit();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      sectionElements.forEach((element) => {
        element.classList.remove("review-editable-section");
        element.removeAttribute("role");
        element.removeAttribute("aria-label");
        element.removeAttribute("data-review-active");
      });
    };
  }, [handleExit, reviewSession.payload.sectionId]);

  async function submitFeedback() {
    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/api/review/feedback`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token: reviewSession.token,
          title,
          description,
          priority,
          reviewUrl: window.location.href,
          stagingUrl: window.location.origin + reviewSession.payload.pagePath,
          viewport: getViewport(),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Unable to submit review feedback.");
      }

      setDescription("");
      setMessage("Feedback submitted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit review feedback.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="review-mode-overlay" aria-label="Review mode">
      <ReviewToolbar
        pageLabel={targetLabel}
        selectedSectionLabel={selectedSection.label}
        selectedSectionType={selectedSection.type}
        onSubmit={() => setPanelOpen(true)}
        onExit={handleExit}
        onTogglePanel={() => setPanelOpen((value) => !value)}
        busy={busy}
        submitLabel="Submit"
      />

      <div className="review-mode-overlay__meta-row">
        <p className="review-mode-overlay__meta">
          Session expires {new Date(reviewSession.payload.expiresAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </p>
        <p className="review-mode-overlay__meta">Section clicks attach the drawer to the selected block.</p>
      </div>

      <ReviewPanel
        open={panelOpen}
        title={title}
        description={description}
        priority={priority}
        busy={busy}
        successMessage={message}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onPriorityChange={(value) => setPriority(value as typeof priority)}
        onSubmit={submitFeedback}
        onClose={() => setPanelOpen(false)}
        sectionLabel={selectedSection.label}
        pageLabel={reviewSession.payload.pageLabel}
      />
    </aside>
  );
}
