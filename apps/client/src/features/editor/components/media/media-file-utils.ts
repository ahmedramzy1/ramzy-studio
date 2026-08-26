// Shared media inspection helpers for Ramzy Studio authoring.
// These are browser-side, storage-agnostic algorithms adapted from the
// pre-Docmost media system. They enrich Docmost attachments rather than
// reintroducing the old Project Builder data model.

const VIDEO_EXTENSIONS = new Set([
  "mp4", "m4v", "mov", "webm", "ogv", "ogg", "avi", "mkv", "mpeg", "mpg",
  "mpe", "3gp", "3g2", "wmv", "flv", "ts", "mts", "m2ts",
]);

const AUDIO_EXTENSIONS = new Set([
  "mp3", "mp2", "m4a", "aac", "wav", "wave", "flac", "ogg", "oga", "opus",
  "webm", "aif", "aiff", "aifc", "wma", "ape", "wv", "mka", "dsf", "dff",
  "amr", "ac3", "m4b",
]);

function extension(file: File): string {
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1) : "";
}

export function fileStem(file: File): string {
  return file.name.replace(/\.[^.]+$/, "");
}

export function isVideoFile(file?: File | null): file is File {
  if (!file) return false;
  return file.type.startsWith("video/") || VIDEO_EXTENSIONS.has(extension(file));
}

export function isAudioFile(file?: File | null): file is File {
  if (!file) return false;
  return file.type.startsWith("audio/") || AUDIO_EXTENSIONS.has(extension(file));
}

export const VIDEO_ACCEPT =
  "video/*,.mp4,.m4v,.mov,.webm,.ogv,.ogg,.avi,.mkv,.mpeg,.mpg,.3gp,.wmv,.flv,.ts,.mts,.m2ts";
export const AUDIO_ACCEPT =
  "audio/*,.mp3,.m4a,.aac,.wav,.flac,.ogg,.oga,.opus,.webm,.aiff,.wma,.ape,.wv,.mka,.dsf,.dff,.amr,.ac3,.m4b";

function waitForEvent(
  target: EventTarget,
  success: string,
  error: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      target.removeEventListener(success, onSuccess);
      target.removeEventListener(error, onError);
    };
    const onSuccess = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Unable to read media metadata."));
    };
    target.addEventListener(success, onSuccess, { once: true });
    target.addEventListener(error, onError, { once: true });
  });
}

export async function readMediaDuration(file: File): Promise<number | undefined> {
  if (typeof document === "undefined" || typeof URL === "undefined") return undefined;
  const objectUrl = URL.createObjectURL(file);
  const media = document.createElement(isVideoFile(file) ? "video" : "audio");
  try {
    media.preload = "metadata";
    media.src = objectUrl;
    await waitForEvent(media, "loadedmetadata", "error");
    return Number.isFinite(media.duration) && media.duration > 0 ? media.duration : undefined;
  } catch {
    return undefined;
  } finally {
    media.removeAttribute("src");
    media.load();
    URL.revokeObjectURL(objectUrl);
  }
}

export interface VideoInspection {
  width?: number;
  height?: number;
  aspectRatio?: number;
  durationSeconds?: number;
}

export async function inspectVideoFile(file: File): Promise<VideoInspection> {
  if (!isVideoFile(file) || typeof document === "undefined" || typeof URL === "undefined") {
    return {};
  }
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  try {
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;
    await waitForEvent(video, "loadedmetadata", "error");
    const width = video.videoWidth || undefined;
    const height = video.videoHeight || undefined;
    return {
      width,
      height,
      aspectRatio: width && height ? width / height : undefined,
      durationSeconds:
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : undefined,
    };
  } catch {
    return {};
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

async function captureVideoThumbnailFromSource(
  source: string,
  baseName: string,
): Promise<File | undefined> {
  if (typeof document === "undefined") return undefined;

  const video = document.createElement("video");
  try {
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.src = source;
    await waitForEvent(video, "loadedmetadata", "error");

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const targetTime =
      duration > 0.8
        ? Math.min(Math.max(duration * 0.1, 0.35), Math.max(duration - 0.1, 0))
        : 0;

    if (targetTime > 0) {
      video.currentTime = targetTime;
      await waitForEvent(video, "seeked", "error");
    } else if (video.readyState < 2) {
      await waitForEvent(video, "loadeddata", "error");
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.88),
    );
    if (!blob) return undefined;

    const base =
      baseName
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-+|-+$/g, "") || "video";
    return new File([blob], `${base}-thumbnail.jpg`, { type: "image/jpeg" });
  } catch {
    return undefined;
  } finally {
    video.removeAttribute("src");
    video.load();
  }
}

/** Capture a deterministic still slightly into a local video so black first
 * frames do not become the default poster. Failure is enrichment-only and
 * never blocks the video upload itself. */
export async function captureVideoThumbnailFile(file: File): Promise<File | undefined> {
  if (!isVideoFile(file) || typeof document === "undefined" || typeof URL === "undefined") {
    return undefined;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    return await captureVideoThumbnailFromSource(objectUrl, file.name);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Backfill helper for videos already persisted before poster enrichment.
 * Using the media URL lets the browser range-load enough of the existing
 * attachment to capture a frame instead of downloading the whole video into
 * JS memory. */
export async function captureVideoThumbnailUrl(
  src: string,
  baseName = "video",
): Promise<File | undefined> {
  if (!src) return undefined;
  return captureVideoThumbnailFromSource(src, baseName);
}
