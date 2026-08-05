import type { WorkspacePage, WorkspaceSection } from "./types";
import { getPresentationPageTitle, getPresentationSectionLabel, hasMeaningfulSectionContent } from "./normalization";

export function presentWorkspacePage(page: WorkspacePage) {
  return {
    ...page,
    title: getPresentationPageTitle(page),
    path: page.path || "/",
    sections: [...page.sections].sort((left, right) => left.position - right.position),
  };
}

export function presentWorkspaceSection(section: WorkspaceSection) {
  return {
    ...section,
    label: getPresentationSectionLabel(section),
    isComplete: hasMeaningfulSectionContent(section),
  };
}
