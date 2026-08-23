import type { JSONContent } from '@tiptap/core';

export interface RamzyPortfolioUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
}

/**
 * Host-facing session used by the portfolio editor runtime.
 *
 * ahmedramzy.com authenticates the admin with its own identity provider. Ramzy
 * Studio verifies that identity and returns these short-lived credentials; the
 * browser never needs a second Docmost login screen or an integration secret.
 */
export interface RamzyPortfolioSession {
  accessToken: string;
  collaborationToken: string;
  user: RamzyPortfolioUser;
  apiUrl: string;
  collaborationUrl: string;
  expiresAt: string;
}

export interface RamzyPortfolioDocument {
  id: string;
  title: string;
  content: JSONContent | null;
  updatedAt?: string | Date;
}

export interface RamzyPortfolioSessionRequest {
  pageId: string;
}

export interface RamzyPortfolioSessionResponse {
  session: RamzyPortfolioSession;
  document: RamzyPortfolioDocument;
}
