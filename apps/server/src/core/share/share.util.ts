import { validate as isValidUUID } from 'uuid';

function updateAttachmentUrl(src: string, jwtToken: string) {
  const updatedSrc = src.includes('/files/public/')
    ? src
    : src.replace('/files/', '/files/public/');
  if (/[?&]jwt=/.test(updatedSrc)) {
    return updatedSrc.replace(
      /([?&])jwt=[^&]*/,
      `$1jwt=${encodeURIComponent(jwtToken)}`,
    );
  }
  const separator = updatedSrc.includes('?') ? '&' : '?';
  return `${updatedSrc}${separator}jwt=${encodeURIComponent(jwtToken)}`;
}

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function attachmentUrlFields(attachmentIdField: string): string[] {
  const suffix = 'AttachmentId';
  if (attachmentIdField === 'attachmentId') return ['src', 'url'];
  const prefix = attachmentIdField.slice(0, -suffix.length);
  return [prefix];
}

function isAttachmentIdField(key: string): boolean {
  return key === 'attachmentId' || key.endsWith('AttachmentId');
}

/**
 * Finds every attachment reference in portfolio content, including attachment
 * metadata nested inside structured block attributes (playlist items, artwork,
 * posters, caption tracks, photo grids, and similar future blocks).
 */
export function getShareAttachmentIds(content: unknown): string[] {
  const attachmentIds = new Set<string>();

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!isJsonRecord(value)) return;

    for (const [key, child] of Object.entries(value)) {
      if (
        isAttachmentIdField(key) &&
        typeof child === 'string' &&
        isValidUUID(child)
      ) {
        attachmentIds.add(child);
      }
      visit(child);
    }
  };

  visit(content);
  return [...attachmentIds];
}

/**
 * Clones portfolio content and signs all internal URLs that have a sibling
 * `*AttachmentId`. This covers both ordinary attachment nodes and nested media
 * records that ProseMirror exposes as a single structured node attribute.
 */
export function rewriteShareAttachmentUrls(
  content: unknown,
  tokenMap: ReadonlyMap<string, string>,
): unknown {
  const rewrite = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(rewrite);
    if (!isJsonRecord(value)) return value;

    const result: JsonRecord = Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, rewrite(child)]),
    );

    for (const [key, attachmentId] of Object.entries(result)) {
      if (!isAttachmentIdField(key) || typeof attachmentId !== 'string') {
        continue;
      }
      const token = tokenMap.get(attachmentId);
      if (!token) continue;

      for (const urlField of attachmentUrlFields(key)) {
        const url = result[urlField];
        if (
          typeof url === 'string' &&
          (url.startsWith('/files') || url.startsWith('/api/files'))
        ) {
          result[urlField] = updateAttachmentUrl(url, token);
        }
      }
    }

    return result;
  };

  return rewrite(content);
}
