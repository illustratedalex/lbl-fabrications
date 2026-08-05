import type { WorkspacePage, WorkspaceSection, WorkspaceValidationIssue } from "./types";
import { getPageCompletionRequirements, validateWorkspacePage, validateWorkspaceSection } from "./normalization";

export function validatePageCompletion(page: WorkspacePage): WorkspaceValidationIssue[] {
  const issues = validateWorkspacePage(page);
  const missing = getPageCompletionRequirements(page);

  for (const requirement of missing) {
    issues.push({
      path: requirement,
      message: `Missing required content: ${requirement}.`,
      severity: "warning",
    });
  }

  return issues;
}

export function validateSectionCompletion(section: WorkspaceSection): WorkspaceValidationIssue[] {
  return validateWorkspaceSection(section);
}

export function hasValidPagePresentation(page: WorkspacePage): boolean {
  return validatePageCompletion(page).every((issue) => issue.severity !== "error");
}
