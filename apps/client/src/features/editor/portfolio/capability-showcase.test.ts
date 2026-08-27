import { getSchema, type JSONContent } from "@tiptap/core";
import { describe, expect, it } from "vitest";
import { mainExtensions } from "@/features/editor/extensions/extensions";
import {
  buildCapabilityShowcaseDocument,
  type CapabilityShowcaseAssets,
} from "./capability-showcase";
import { isCapabilityDocumentEmpty } from "./capability-mega";

const internal = (id: string, name: string) => `/api/files/${id}/${name}`;

const assets: CapabilityShowcaseAssets = {
  image: { src: internal("img", "aura-capability-map.svg"), attachmentId: "img", name: "aura-capability-map.svg" },
  pdf: { src: internal("pdf", "aura-capability-appendix.pdf"), attachmentId: "pdf", name: "aura-capability-appendix.pdf", size: 1200 },
  attachment: { src: internal("txt", "aura-observation-log.txt"), attachmentId: "txt", name: "aura-observation-log.txt", size: 500 },
  drawio: { src: internal("drawio", "aura-system-map.svg"), attachmentId: "drawio", name: "aura-system-map.svg" },
  excalidraw: { src: internal("excalidraw", "aura-interaction-sketch.svg"), attachmentId: "excalidraw", name: "aura-interaction-sketch.svg" },
};

const existing: JSONContent = {
  type: "doc",
  content: [
    ...[1, 2, 3].map((index) => ({
      type: "video",
      attrs: {
        src: internal(`video-${index}`, `clip-${index}.mp4`),
        attachmentId: `video-${index}`,
        alt: `AURA clip ${index}`,
        poster: internal(`poster-${index}`, `poster-${index}.jpg`),
        posterAttachmentId: `poster-${index}`,
        durationSeconds: 20 + index,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
      },
    })),
    ...[1, 2, 3].map((index) => ({
      type: "audio",
      attrs: {
        src: internal(`audio-${index}`, `track-${index}.mp3`),
        attachmentId: `audio-${index}`,
        title: `AURA recording ${index}`,
        artist: "AURA Research",
        artwork: internal(`art-${index}`, `art-${index}.jpg`),
        artworkAttachmentId: `art-${index}`,
        artworkSource: "embedded",
        durationSeconds: 90 + index,
      },
    })),
  ],
};

function nodeTypes(node: JSONContent, result = new Set<string>()) {
  if (node.type) result.add(node.type);
  for (const child of node.content || []) nodeTypes(child, result);
  return result;
}

describe("AURA capability showcase", () => {
  it("seeds only documents that are truly empty after hydration", () => {
    expect(isCapabilityDocumentEmpty(null)).toBe(true);
    expect(isCapabilityDocumentEmpty({ type: "doc", content: [] })).toBe(true);
    expect(
      isCapabilityDocumentEmpty({
        type: "doc",
        content: [{ type: "paragraph" }, { type: "paragraph", content: [] }],
      }),
    ).toBe(true);

    expect(
      isCapabilityDocumentEmpty({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Existing Studio content" }],
          },
        ],
      }),
    ).toBe(false);
    expect(
      isCapabilityDocumentEmpty({
        type: "doc",
        content: [{ type: "image", attrs: { src: internal("x", "x.png") } }],
      }),
    ).toBe(false);
  });

  it("is valid against the exact current Studio document schema", () => {
    const document = buildCapabilityShowcaseDocument(existing, assets);
    const schema = getSchema(mainExtensions);

    expect(() => schema.nodeFromJSON(document as any)).not.toThrow();
  });

  it("covers the self-contained portfolio block system in one document", () => {
    const document = buildCapabilityShowcaseDocument(existing, assets);
    const types = nodeTypes(document);

    for (const type of [
      "heading",
      "paragraph",
      "callout",
      "image",
      "horizontalRule",
      "bulletList",
      "orderedList",
      "taskList",
      "taskItem",
      "blockquote",
      "table",
      "tableRow",
      "tableHeader",
      "tableCell",
      "details",
      "detailsSummary",
      "detailsContent",
      "tabs",
      "tabPanel",
      "columns",
      "column",
      "drawio",
      "excalidraw",
      "codeBlock",
      "mathInline",
      "mathBlock",
      "pdf",
      "attachment",
      "video",
      "audio",
      "mediaPlaylist",
      "embed",
      "footnoteReference",
      "footnotes",
      "footnote",
      "pageBreak",
    ]) {
      expect(types.has(type), `missing ${type}`).toBe(true);
    }
  });

  it("covers 2/3/4/5-column counts and every vertical alignment mode", () => {
    const document = buildCapabilityShowcaseDocument(existing, assets);
    const columnBlocks: JSONContent[] = [];
    const visit = (node: JSONContent) => {
      if (node.type === "columns") columnBlocks.push(node);
      for (const child of node.content || []) visit(child);
    };
    visit(document);

    expect(columnBlocks.map((node) => node.content?.length)).toEqual([2, 3, 4, 5]);
    expect(columnBlocks.map((node) => node.attrs?.verticalAlign)).toEqual([
      "top",
      "center",
      "bottom",
      "stretch",
    ]);
    expect(columnBlocks[1].content?.map((node) => node.attrs?.width)).toEqual([1, 2, 1]);
  });

  it("reuses existing media for both standalone players and playlists", () => {
    const document = buildCapabilityShowcaseDocument(existing, assets);
    const types = nodeTypes(document);
    expect(types.has("video")).toBe(true);
    expect(types.has("audio")).toBe(true);

    const playlists: JSONContent[] = [];
    const visit = (node: JSONContent) => {
      if (node.type === "mediaPlaylist") playlists.push(node);
      for (const child of node.content || []) visit(child);
    };
    visit(document);

    expect(playlists).toHaveLength(2);
    expect(playlists.find((node) => node.attrs?.kind === "video")?.attrs?.items).toHaveLength(3);
    expect(playlists.find((node) => node.attrs?.kind === "audio")?.attrs?.items).toHaveLength(3);
  });
});
