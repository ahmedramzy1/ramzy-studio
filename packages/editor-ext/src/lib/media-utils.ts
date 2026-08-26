import { Editor } from "@tiptap/core";

export function normalizeFileUrl(src: string): string {
  if (src && src.startsWith("/files/")) {
    return "/api" + src;
  }
  return src || "";
}

export type UploadFn = (
  file: File,
  editor: Editor,
  pos: number,
  pageId: string,
  // only applicable to file attachments
  allowMedia?: boolean,
) => void;

export interface MediaUploadOptions {
  validateFn?: (file: File, allowMedia?: boolean) => void;
  onUpload: (file: File, pageId: string) => Promise<any>;
  /**
   * Optional best-effort enrichment that is persisted onto the same media node
   * after the canonical attachment upload succeeds. This lets the host provide
   * poster/artwork/metadata logic without coupling editor-ext to host storage.
   */
  enrichFn?: (file: File, pageId: string) => Promise<Record<string, any>>;
}
