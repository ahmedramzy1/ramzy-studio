import type { JSONContent } from "@tiptap/core";

export class PortfolioDraftSaveError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PortfolioDraftSaveError";
  }

  get sessionExpired() {
    return this.status === 401;
  }
}

interface SavePortfolioDraftInput {
  apiUrl: string;
  accessToken: string;
  pageId: string;
  content: JSONContent;
  fetchImpl?: typeof fetch;
}

/** Persist one canonical portfolio draft through the Ramzy Studio API. */
export async function savePortfolioDraft({
  apiUrl,
  accessToken,
  pageId,
  content,
  fetchImpl = fetch,
}: SavePortfolioDraftInput): Promise<void> {
  const apiBase = apiUrl.replace(/\/+$/, "");
  const response = await fetchImpl(`${apiBase}/portfolio/draft/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ pageId, content }),
  });

  if (response.ok) return;

  const body = await response.json().catch(() => null);
  const message =
    body && typeof body === "object" && "message" in body
      ? String(body.message)
      : `Ramzy Studio autosave failed (${response.status})`;

  throw new PortfolioDraftSaveError(message, response.status);
}
