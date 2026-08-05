import type { WorkspacePage, WorkspaceSection } from "./types";

export type WorkspaceContentRepository = {
  listPages(): Promise<WorkspacePage[]>;
  getPageById(id: string): Promise<WorkspacePage | null>;
  getPageByPath(path: string): Promise<WorkspacePage | null>;
  listSections(pageId?: string): Promise<WorkspaceSection[]>;
  getSectionById(id: string): Promise<WorkspaceSection | null>;
  savePage(page: WorkspacePage): Promise<WorkspacePage>;
  updatePage(pageId: string, patch: Partial<WorkspacePage>): Promise<WorkspacePage | null>;
};
