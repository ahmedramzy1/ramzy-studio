import type { MediaPlaylistItem } from "@docmost/editor-ext";
import { uploadFile } from "@/features/page/services/page-service.ts";
import api from "@/lib/api-client";
import { extractAudioMetadata } from "./audio-metadata";
import {
  captureVideoThumbnailFile,
  captureVideoThumbnailUrl,
  fileStem,
  inspectVideoFile,
  readMediaDuration,
} from "./media-file-utils";

export interface MediaEnrichment {
  title?: string;
  artist?: string;
  album?: string;
  description?: string;
  artwork?: string;
  artworkAttachmentId?: string;
  artworkSource?: "embedded" | "custom";
  poster?: string;
  posterAttachmentId?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
}

function attachmentSrc(attachment: { id: string; fileName: string }) {
  return `/api/files/${attachment.id}/${attachment.fileName}`;
}

export function createMediaKey(prefix = "media") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function generateVideoCaptions(
  attachmentId: string,
  pageId: string,
  language?: string,
) {
  const response = await api.post<{
    vtt: string;
    language: string;
    label: string;
  }>("/files/captions", {
    attachmentId,
    language: language?.trim() || undefined,
  });
  const result = response.data;
  const captionFile = new File(
    [result.vtt],
    `captions-${Date.now().toString(36)}.vtt`,
    { type: "text/vtt" },
  );
  const attachment = await uploadFile(captionFile, pageId);
  return {
    key: createMediaKey("captions"),
    src: attachmentSrc(attachment),
    attachmentId: attachment.id,
    label: result.label || "Auto captions",
    language: result.language || language || "und",
  };
}

export async function enrichVideoFile(
  file: File,
  pageId: string,
): Promise<MediaEnrichment> {
  const [inspection, thumbnailFile] = await Promise.all([
    inspectVideoFile(file),
    captureVideoThumbnailFile(file),
  ]);

  let poster: string | undefined;
  let posterAttachmentId: string | undefined;
  if (thumbnailFile) {
    try {
      const uploadedPoster = await uploadFile(thumbnailFile, pageId);
      poster = attachmentSrc(uploadedPoster);
      posterAttachmentId = uploadedPoster.id;
    } catch {
      // Poster extraction/upload is enrichment only; video upload stays valid.
    }
  }

  return {
    title: fileStem(file),
    poster,
    posterAttachmentId,
    durationSeconds: inspection.durationSeconds,
    width: inspection.width,
    height: inspection.height,
    aspectRatio: inspection.aspectRatio,
  };
}

export async function enrichExistingVideo(
  src: string,
  pageId: string,
  baseName = "video",
): Promise<MediaEnrichment> {
  const thumbnailFile = await captureVideoThumbnailUrl(src, baseName);
  if (!thumbnailFile) return {};
  try {
    const uploadedPoster = await uploadFile(thumbnailFile, pageId);
    return {
      poster: attachmentSrc(uploadedPoster),
      posterAttachmentId: uploadedPoster.id,
    };
  } catch {
    return {};
  }
}

export async function enrichAudioFile(
  file: File,
  pageId: string,
): Promise<MediaEnrichment> {
  const [metadata, durationSeconds] = await Promise.all([
    extractAudioMetadata(file),
    readMediaDuration(file),
  ]);

  let artwork: string | undefined;
  let artworkAttachmentId: string | undefined;
  if (metadata.artworkFile) {
    try {
      const uploadedArtwork = await uploadFile(metadata.artworkFile, pageId);
      artwork = attachmentSrc(uploadedArtwork);
      artworkAttachmentId = uploadedArtwork.id;
    } catch {
      // Embedded artwork failure must never block the audio upload.
    }
  }

  return {
    title: metadata.title || fileStem(file),
    artist: metadata.artist,
    album: metadata.album,
    description: metadata.album,
    artwork,
    artworkAttachmentId,
    artworkSource: artwork ? "embedded" : undefined,
    durationSeconds,
  };
}

export async function enrichExistingAudio(
  src: string,
  pageId: string,
  fileName = "audio",
): Promise<MediaEnrichment> {
  try {
    const response = await fetch(src, { credentials: "include" });
    if (!response.ok) return {};
    const blob = await response.blob();
    const file = new File([blob], fileName, {
      type: blob.type || "audio/mpeg",
    });
    return await enrichAudioFile(file, pageId);
  } catch {
    return {};
  }
}

export async function ingestVideoFile(
  file: File,
  pageId: string,
): Promise<MediaPlaylistItem> {
  const [attachment, enrichment] = await Promise.all([
    uploadFile(file, pageId),
    enrichVideoFile(file, pageId),
  ]);

  return {
    key: createMediaKey("video"),
    src: attachmentSrc(attachment),
    attachmentId: attachment.id,
    title: enrichment.title || fileStem(file),
    subtitle: "Uploaded video",
    poster: enrichment.poster,
    posterAttachmentId: enrichment.posterAttachmentId,
    durationSeconds: enrichment.durationSeconds,
    width: enrichment.width,
    height: enrichment.height,
    aspectRatio: enrichment.aspectRatio,
    dateAdded: new Date().toISOString(),
  };
}

export async function ingestAudioFile(
  file: File,
  pageId: string,
): Promise<MediaPlaylistItem> {
  const [attachment, enrichment] = await Promise.all([
    uploadFile(file, pageId),
    enrichAudioFile(file, pageId),
  ]);

  return {
    key: createMediaKey("audio"),
    src: attachmentSrc(attachment),
    attachmentId: attachment.id,
    title: enrichment.title || fileStem(file),
    subtitle: enrichment.artist || enrichment.album || "Uploaded audio",
    artist: enrichment.artist,
    album: enrichment.album,
    description: enrichment.description,
    artwork: enrichment.artwork,
    artworkAttachmentId: enrichment.artworkAttachmentId,
    artworkSource: enrichment.artworkSource,
    durationSeconds: enrichment.durationSeconds,
    dateAdded: new Date().toISOString(),
  };
}

export async function ingestMediaBatch(
  files: File[],
  kind: "video" | "audio",
  pageId: string,
  concurrency = kind === "video" ? 2 : 3,
): Promise<{ successful: MediaPlaylistItem[]; failed: File[] }> {
  const successful = new Map<number, MediaPlaylistItem>();
  const failed: File[] = [];
  let cursor = 0;
  const workerCount = Math.max(1, Math.min(concurrency, files.length));

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (true) {
        const index = cursor;
        cursor += 1;
        if (index >= files.length) return;
        const file = files[index];
        try {
          const item =
            kind === "video"
              ? await ingestVideoFile(file, pageId)
              : await ingestAudioFile(file, pageId);
          successful.set(index, item);
        } catch {
          failed.push(file);
        }
      }
    }),
  );

  return {
    successful: files
      .map((_, index) => successful.get(index))
      .filter((item): item is MediaPlaylistItem => !!item),
    failed,
  };
}
