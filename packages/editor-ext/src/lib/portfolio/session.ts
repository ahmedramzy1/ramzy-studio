export interface RamzyPortfolioUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
}

/**
 * Host-facing session used by the portfolio editor runtime.
 *
 * ahmedramzy.com authenticates the admin with its own identity provider. A
 * server-side exchange then returns this short-lived Ramzy Studio session; the
 * browser never needs a second Docmost login screen or an integration secret.
 */
export interface RamzyPortfolioSession {
  token: string;
  user: RamzyPortfolioUser;
  collaborationUrl: string;
  expiresAt: string;
}

export interface RamzyPortfolioSessionRequest {
  pageId: string;
}
