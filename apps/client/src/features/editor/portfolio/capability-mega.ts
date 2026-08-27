import type { Editor, JSONContent } from "@tiptap/core";
import { uploadFile } from "@/features/page/services/page-service.ts";
import { rebuildCapabilityShowcase } from "./capability-showcase";

export type CapabilitySeedResult = {
  seeded: boolean;
  document: JSONContent;
};

function isTextEmpty(node: JSONContent): boolean {
  if (node.type === "text") return !String(node.text || "").trim();
  return (node.content || []).every(isTextEmpty);
}

export function isCapabilityDocumentEmpty(document: JSONContent | null | undefined) {
  if (!document || document.type !== "doc") return true;
  const content = document.content || [];
  if (content.length === 0) return true;
  return content.every((node) => {
    if (node.type !== "paragraph") return false;
    return isTextEmpty(node);
  });
}

function attachmentSrc(attachment: { id: string; fileName?: string }, fallbackName: string) {
  const fileName = attachment.fileName || fallbackName;
  return `/api/files/${attachment.id}/${encodeURIComponent(fileName)}`;
}

function svgFile(name: string, label: string, square = false) {
  const width = square ? 600 : 1600;
  const height = square ? 600 : 900;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#071B2D"/>
  <circle cx="${square ? 300 : 1240}" cy="${square ? 300 : 260}" r="${square ? 180 : 190}" fill="#0F3151" stroke="#77B5E8" stroke-width="8"/>
  <circle cx="${square ? 300 : 1240}" cy="${square ? 300 : 260}" r="${square ? 105 : 105}" fill="none" stroke="#A8C4FF" stroke-width="5"/>
  <text x="${square ? 300 : 100}" y="${square ? 315 : 690}" text-anchor="${square ? "middle" : "start"}" font-family="Arial, sans-serif" font-size="${square ? 54 : 72}" font-weight="700" fill="#F5F8FC">${label}</text>
  ${square ? "" : '<text x="100" y="755" font-family="Arial, sans-serif" font-size="30" fill="#A8C4FF">Ramzy Studio capability media</text>'}
</svg>`;
  return new File([svg], name, { type: "image/svg+xml" });
}

function makeWaveFile(name: string, frequency: number, durationSeconds = 1) {
  const sampleRate = 16_000;
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const bytesPerSample = 2;
  const dataSize = sampleCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeAscii = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.min(1, i / 500) * Math.min(1, (sampleCount - i) / 500);
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.24 * envelope;
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }

  return new File([buffer], name, { type: "audio/wav" });
}

async function makeVideoFile(name: string, label: string, seconds = 0.7): Promise<File> {
  if (typeof document === "undefined" || typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot generate the AURA capability video fixture.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  const context = canvas.getContext("2d");
  if (!context || typeof canvas.captureStream !== "function") {
    throw new Error("Canvas capture is unavailable for the AURA capability video fixture.");
  }

  const stream = canvas.captureStream(8);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
    ? "video/webm;codecs=vp8"
    : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 100_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const stopped = new Promise<void>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Could not generate AURA capability video."));
    recorder.onstop = () => resolve();
  });

  recorder.start(80);
  const startedAt = performance.now();
  while ((performance.now() - startedAt) / 1000 < seconds) {
    const progress = Math.min(1, (performance.now() - startedAt) / (seconds * 1000));
    context.fillStyle = "#071B2D";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0F3151";
    context.beginPath();
    context.arc(250, 55, 35 + progress * 8, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#77B5E8";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(30, 130);
    context.bezierCurveTo(95, 65, 165, 160, 290, 100 - progress * 20);
    context.stroke();
    context.fillStyle = "#F5F8FC";
    context.font = "700 28px Arial";
    context.fillText(label, 24, 44);
    await new Promise((resolve) => setTimeout(resolve, 70));
  }
  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());

  return new File([new Blob(chunks, { type: "video/webm" })], name, { type: "video/webm" });
}

async function ensureSelfContainedMedia(editor: Editor, pageId: string) {
  const existing = editor.getJSON();
  const nodes = existing.content || [];
  const alreadyHasVideo = nodes.some((node) => node.type === "video" || (node.type === "mediaPlaylist" && node.attrs?.kind === "video"));
  const alreadyHasAudio = nodes.some((node) => node.type === "audio" || (node.type === "mediaPlaylist" && node.attrs?.kind === "audio"));
  if (alreadyHasVideo && alreadyHasAudio) return;

  const [posterAttachment, artworkAttachment] = await Promise.all([
    uploadFile(svgFile("aura-video-poster.svg", "AURA FIELD FILM"), pageId),
    uploadFile(svgFile("aura-audio-artwork.svg", "AURA", true), pageId),
  ]);
  const poster = attachmentSrc(posterAttachment, "aura-video-poster.svg");
  const artwork = attachmentSrc(artworkAttachment, "aura-audio-artwork.svg");

  const mediaNodes: JSONContent[] = [];

  if (!alreadyHasVideo) {
    const videoFiles = await Promise.all([
      makeVideoFile("aura-field-film-01.webm", "AURA / 01"),
      makeVideoFile("aura-field-film-02.webm", "AURA / 02"),
    ]);
    const uploaded = await Promise.all(videoFiles.map((file) => uploadFile(file, pageId)));
    uploaded.forEach((attachment, index) => {
      mediaNodes.push({
        type: "video",
        attrs: {
          src: attachmentSrc(attachment, videoFiles[index].name),
          attachmentId: attachment.id,
          alt: `AURA field film ${String(index + 1).padStart(2, "0")}`,
          poster,
          posterAttachmentId: posterAttachment.id,
          durationSeconds: 0.7,
          width: "100%",
          height: 180,
          aspectRatio: 16 / 9,
          placeholder: null,
        },
      });
    });
  }

  if (!alreadyHasAudio) {
    const audioFiles = [
      makeWaveFile("aura-field-recording-01.wav", 440),
      makeWaveFile("aura-field-recording-02.wav", 554),
    ];
    const uploaded = await Promise.all(audioFiles.map((file) => uploadFile(file, pageId)));
    uploaded.forEach((attachment, index) => {
      mediaNodes.push({
        type: "audio",
        attrs: {
          src: attachmentSrc(attachment, audioFiles[index].name),
          attachmentId: attachment.id,
          title: `AURA field recording ${String(index + 1).padStart(2, "0")}`,
          artist: "AURA Labs",
          album: "Spatial observation",
          description: "Generated canonical capability-test recording",
          artwork,
          artworkAttachmentId: artworkAttachment.id,
          artworkSource: "custom",
          durationSeconds: 1,
          placeholder: null,
        },
      });
    });
  }

  if (mediaNodes.length > 0) {
    editor.commands.setContent(
      { type: "doc", content: [...(existing.content || []), ...mediaNodes] },
      { emitUpdate: false },
    );
  }
}

/**
 * Build the canonical self-contained capability document only after the real
 * Tiptap/Yjs editor has hydrated and proved itself empty. This deliberately
 * avoids the pre-hydration database snapshot mistake that previously treated a
 * valid collaborative document as empty.
 */
export async function seedCapabilityShowcaseIfEmpty(
  editor: Editor,
  pageId: string,
): Promise<CapabilitySeedResult> {
  const hydrated = editor.getJSON();
  if (!isCapabilityDocumentEmpty(hydrated)) {
    return { seeded: false, document: hydrated };
  }

  await ensureSelfContainedMedia(editor, pageId);
  const document = await rebuildCapabilityShowcase(editor, pageId);
  return { seeded: true, document };
}
