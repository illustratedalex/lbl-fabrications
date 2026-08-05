import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { WorkspaceContentRepositoryOptions, WorkspaceContentStore, WorkspacePage } from "./types";
import { normalizeWorkspacePage } from "./normalization";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function mergeDefined<T extends Record<string, unknown>>(base: T, patch: Partial<T>): T {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }

    if (isRecord(value) && isRecord(base[key])) {
      merged[key] = mergeDefined(base[key], value as Record<string, unknown>);
      continue;
    }

    merged[key] = value;
  }

  return merged as T;
}

function defaultStore(): WorkspaceContentStore {
  return { pages: [] };
}

function getStorePath(options: WorkspaceContentRepositoryOptions) {
  return path.resolve(options.storePath ?? ".data/workspace-content-dev.json");
}

async function readStoreFile(storePath: string): Promise<WorkspaceContentStore> {
  try {
    const text = await readFile(storePath, "utf8");
    const parsed = JSON.parse(text) as unknown;
    const candidate = isRecord(parsed) && Array.isArray(parsed.pages) ? parsed.pages : [];
    return {
      pages: candidate.map((page) => normalizeWorkspacePage(page)),
    };
  } catch {
    return defaultStore();
  }
}

async function writeStoreFile(storePath: string, store: WorkspaceContentStore): Promise<void> {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function upsertPage(store: WorkspaceContentStore, page: WorkspacePage): WorkspaceContentStore {
  const pages = [...store.pages];
  const index = pages.findIndex((entry) => entry.id === page.id);

  if (index >= 0) {
    pages[index] = page;
    return { pages };
  }

  return { pages: [...pages, page] };
}

export function createWorkspaceContentRepository(options: WorkspaceContentRepositoryOptions = {}) {
  const storePath = getStorePath(options);

  return {
    async listPages() {
      const store = await readStoreFile(storePath);
      return [...store.pages].sort((left, right) => left.path.localeCompare(right.path));
    },

    async getPageById(id: string) {
      const store = await readStoreFile(storePath);
      return store.pages.find((page) => page.id === id) ?? null;
    },

    async getPageByPath(pagePath: string) {
      const store = await readStoreFile(storePath);
      return store.pages.find((page) => page.path === pagePath) ?? null;
    },

    async listSections(pageId?: string) {
      const store = await readStoreFile(storePath);
      const pages = pageId ? store.pages.filter((page) => page.id === pageId) : store.pages;
      return pages.flatMap((page) => page.sections);
    },

    async getSectionById(id: string) {
      const sections = await this.listSections();
      return sections.find((section) => section.id === id) ?? null;
    },

    async savePage(page: WorkspacePage) {
      const normalized = normalizeWorkspacePage(page);
      const store = await readStoreFile(storePath);
      const nextStore = upsertPage(store, normalized);
      await writeStoreFile(storePath, nextStore);
      return normalized;
    },

    async updatePage(pageId: string, patch: Partial<WorkspacePage>) {
      const store = await readStoreFile(storePath);
      const existing = store.pages.find((page) => page.id === pageId);
      if (!existing) {
        return null;
      }

      const merged = mergeDefined(existing, patch);
      const normalized = normalizeWorkspacePage(merged);
      const nextStore = upsertPage(store, normalized);
      await writeStoreFile(storePath, nextStore);
      return normalized;
    },
  };
}
