// Shared media inspection helpers for Ramzy Studio authoring.
// These are browser-side, storage-agnostic algorithms adapted from the
// pre-Docmost media system. They enrich Docmost attachments rather than
// reintroducing the old Project Builder data model.

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "m4v",
  "mov",
  "webm",
  "ogv",
  "ogg",
  "avi",
  "mkv",
  "mpeg",
  "mpg",
  "mpe",
  "3gp",
  "3g2",
  "wmv",
  "flv",
  "ts",
  "mts",
  "m2ts",
]);

const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "mp2",
  "m4a",
  "aac",
  "wav",
  "wave",
  "flac",
  "ogg",
  "oga",
  "opus",
  "webm",
  "aif",
  "aiff",
  "aifc",
  "wma",
  "ape",
  "wv",
  "mka",
  "dsf",
  "dff",
  "amr",
  "ac3",
  "m4b",
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
  return (
    file.type.startsWith("video/") || VIDEO_EXTENSIONS.has(extension(file))
  );
}

export function isAudioFile(file?: File | null): file is File {
  if (!file) return false;
  return (
    file.type.startsWith("audio/") || AUDIO_EXTENSIONS.has(extension(file))
  );
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

export async function readMediaDuration(
  file: File,
): Promise<number | undefined> {
  if (typeof document === "undefined" || typeof URL === "undefined")
    return undefined;
  const objectUrl = URL.createObjectURL(file);
  const media = document.createElement(isVideoFile(file) ? "video" : "audio");
  try {
    media.preload = "metadata";
    media.src = objectUrl;
    await waitForEvent(media, "loadedmetadata", "error");
    return Number.isFinite(media.duration) && media.duration > 0
      ? media.duration
      : undefined;
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
  if (
    !isVideoFile(file) ||
    typeof document === "undefined" ||
    typeof URL === "undefined"
  ) {
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
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : undefined,
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
    if (video.readyState < 2) await waitForEvent(video, "loadeddata", "error");

    // Score a few small frames instead of blindly using one timestamp. The
    // small analysis canvas keeps 4K uploads from monopolising the UI thread,
    // and brightness + variance rejects black/fade frames without adding a
    // multi-megabyte browser video-processing runtime.
    const analysis = document.createElement("canvas");
    analysis.width = 240;
    analysis.height = 135;
    const analysisContext = analysis.getContext("2d", {
      willReadFrequently: true,
    });
    if (!analysisContext) return undefined;

    const candidates =
      duration > 1
        ? [0.08, 0.22, 0.38, 0.58, 0.76].map((ratio) =>
            Math.min(
              Math.max(duration * ratio, 0.3),
              Math.max(duration - 0.15, 0),
            ),
          )
        : [0];
    let bestTime = candidates[0] || 0;
    let bestScore = -1;

    for (const time of candidates) {
      if (Math.abs(video.currentTime - time) > 0.02) {
        video.currentTime = time;
        await waitForEvent(video, "seeked", "error");
      }
      analysisContext.drawImage(video, 0, 0, analysis.width, analysis.height);
      const pixels = analysisContext.getImageData(
        0,
        0,
        analysis.width,
        analysis.height,
      ).data;
      let sum = 0;
      let sumSquares = 0;
      for (let index = 0; index < pixels.length; index += 16) {
        const luminance =
          pixels[index] * 0.2126 +
          pixels[index + 1] * 0.7152 +
          pixels[index + 2] * 0.0722;
        sum += luminance;
        sumSquares += luminance * luminance;
      }
      const count = pixels.length / 16;
      const average = sum / count;
      const variance = Math.max(0, sumSquares / count - average * average);
      const exposure = 1 - Math.min(1, Math.abs(average - 116) / 116);
      const score = variance * 0.72 + exposure * 900;
      if (score > bestScore) {
        bestScore = score;
        bestTime = time;
      }
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
    }

    if (Math.abs(video.currentTime - bestTime) > 0.02) {
      video.currentTime = bestTime;
      await waitForEvent(video, "seeked", "error");
    }

    const sourceWidth = video.videoWidth || 1280;
    const sourceHeight = video.videoHeight || 720;
    const scale = Math.min(1, 1280 / sourceWidth, 720 / sourceHeight);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
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
export async function captureVideoThumbnailFile(
  file: File,
): Promise<File | undefined> {
  if (
    !isVideoFile(file) ||
    typeof document === "undefined" ||
    typeof URL === "undefined"
  ) {
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
