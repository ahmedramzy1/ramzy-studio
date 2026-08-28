import type { Editor, JSONContent } from "@tiptap/core";
import { uploadFile } from "@/features/page/services/page-service.ts";

export interface CapabilityShowcaseAsset {
  src: string;
  attachmentId?: string;
  name?: string;
  size?: number;
}

export interface CapabilityShowcaseAssets {
  image: CapabilityShowcaseAsset;
  pdf: CapabilityShowcaseAsset;
  attachment: CapabilityShowcaseAsset;
  drawio: CapabilityShowcaseAsset;
  excalidraw: CapabilityShowcaseAsset;
}

type MediaKind = "video" | "audio";

type MediaItem = {
  key: string;
  src: string;
  attachmentId?: string;
  title: string;
  subtitle?: string;
  poster?: string;
  posterAttachmentId?: string;
  artwork?: string;
  artworkAttachmentId?: string;
  artworkSource?: string;
  artist?: string;
  album?: string;
  description?: string;
  durationSeconds?: number;
  dateAdded?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
};

const P = (text: string, marks?: JSONContent["marks"]): JSONContent => ({
  type: "paragraph",
  content: text ? [{ type: "text", text, marks }] : undefined,
});

const H = (level: 1 | 2 | 3, text: string): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [{ type: "text", text }],
});

const T = (text: string, marks?: JSONContent["marks"]): JSONContent => ({
  type: "text",
  text,
  marks,
});

function walk(node: JSONContent | undefined | null, visit: (node: JSONContent) => void) {
  if (!node) return;
  visit(node);
  for (const child of node.content || []) walk(child, visit);
}

function stableMediaKey(kind: MediaKind, item: Partial<MediaItem>, index: number) {
  return (
    item.key ||
    `${kind}-${item.attachmentId || item.src || "asset"}-${index}`
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .slice(0, 120)
  );
}

function collectMedia(existing: JSONContent, kind: MediaKind): MediaItem[] {
  const found: MediaItem[] = [];
  const seen = new Set<string>();
  let index = 0;

  const add = (candidate: Partial<MediaItem>) => {
    if (!candidate.src) return;
    const identity = candidate.attachmentId || candidate.src;
    if (seen.has(identity)) return;
    seen.add(identity);
    found.push({
      key: stableMediaKey(kind, candidate, index++),
      src: candidate.src,
      attachmentId: candidate.attachmentId,
      title: candidate.title || (kind === "video" ? "AURA field film" : "AURA field recording"),
      subtitle: candidate.subtitle,
      poster: candidate.poster,
      posterAttachmentId: candidate.posterAttachmentId,
      artwork: candidate.artwork,
      artworkAttachmentId: candidate.artworkAttachmentId,
      artworkSource: candidate.artworkSource,
      artist: candidate.artist,
      album: candidate.album,
      description: candidate.description,
      durationSeconds: candidate.durationSeconds,
      dateAdded: candidate.dateAdded,
      width: candidate.width,
      height: candidate.height,
      aspectRatio: candidate.aspectRatio,
    });
  };

  walk(existing, (node) => {
    if (node.type === kind && node.attrs?.src) {
      add({
        ...node.attrs,
        title:
          node.attrs.title ||
          node.attrs.alt ||
          (kind === "video" ? "AURA field film" : "AURA field recording"),
      });
    }

    if (node.type === "mediaPlaylist" && node.attrs?.kind === kind) {
      for (const item of Array.isArray(node.attrs.items) ? node.attrs.items : []) add(item);
    }
  });

  return found;
}

function findReusableAsset(
  existing: JSONContent,
  nodeType: string,
  identity: (attrs: Record<string, any>) => boolean,
): CapabilityShowcaseAsset | undefined {
  let result: CapabilityShowcaseAsset | undefined;
  walk(existing, (node) => {
    if (result || node.type !== nodeType || !node.attrs || !identity(node.attrs)) return;
    const src = node.attrs.src || node.attrs.url;
    if (!src) return;
    result = {
      src,
      attachmentId: node.attrs.attachmentId,
      name: node.attrs.name || node.attrs.title || node.attrs.alt,
      size: node.attrs.size,
    };
  });
  return result;
}

function attachmentUrl(attachment: any, fallbackName: string) {
  const fileName = attachment?.fileName || fallbackName;
  return `/api/files/${attachment.id}/${encodeURIComponent(fileName)}`;
}

function svgFile(name: string, title: string, subtitle: string, variant: number) {
  const x = 72 + variant * 18;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="#071B2D"/>
  <circle cx="${1280 - variant * 38}" cy="170" r="118" fill="none" stroke="#5E8FFF" stroke-width="3" opacity=".75"/>
  <circle cx="${1280 - variant * 38}" cy="170" r="62" fill="none" stroke="#A8C4FF" stroke-width="3" opacity=".75"/>
  <path d="M${x} 610 C 330 420, 510 730, 720 500 S 1120 360, 1450 540" fill="none" stroke="#2E78B7" stroke-width="5" opacity=".7"/>
  <g fill="#0F3151" stroke="#2E78B7" stroke-width="2">
    <rect x="92" y="170" width="390" height="220" rx="26"/><rect x="605" y="170" width="390" height="220" rx="26"/><rect x="1118" y="430" width="390" height="220" rx="26"/>
  </g>
  <g fill="#77B5E8"><rect x="126" y="210" width="84" height="84" rx="18"/><rect x="639" y="210" width="84" height="84" rx="18"/><rect x="1152" y="470" width="84" height="84" rx="18"/></g>
  <text x="92" y="94" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#F5F8FC">${title}</text>
  <text x="92" y="132" font-family="Arial, sans-serif" font-size="20" fill="#A8C4FF">${subtitle}</text>
</svg>`;
  return new File([svg], name, { type: "image/svg+xml" });
}

function minimalPdfFile() {
  const stream = "BT\n/F1 28 Tf\n72 720 Td\n(AURA capability appendix) Tj\n/F1 14 Tf\n0 -42 Td\n(Spatial OS - research, system model, and validation notes.) Tj\nET\n";
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new File([pdf], "aura-capability-appendix.pdf", { type: "application/pdf" });
}

async function uploadGenerated(file: File, pageId: string): Promise<CapabilityShowcaseAsset> {
  const attachment = await uploadFile(file, pageId);
  return {
    src: attachmentUrl(attachment, file.name),
    attachmentId: attachment.id,
    name: attachment.fileName || file.name,
    size: attachment.fileSize || file.size,
  };
}

export async function prepareCapabilityShowcaseAssets(
  existing: JSONContent,
  pageId: string,
): Promise<CapabilityShowcaseAssets> {
  const imageExisting = findReusableAsset(
    existing,
    "image",
    (attrs) => attrs.alt === "AURA capability map",
  );
  const pdfExisting = findReusableAsset(
    existing,
    "pdf",
    (attrs) => attrs.name === "aura-capability-appendix.pdf",
  );
  const attachmentExisting = findReusableAsset(
    existing,
    "attachment",
    (attrs) => attrs.name === "aura-observation-log.txt",
  );
  const drawioExisting = findReusableAsset(
    existing,
    "drawio",
    (attrs) => attrs.title === "AURA system map",
  );
  const excalidrawExisting = findReusableAsset(
    existing,
    "excalidraw",
    (attrs) => attrs.title === "AURA interaction sketch",
  );

  const [image, pdf, attachment, drawio, excalidraw] = await Promise.all([
    imageExisting || uploadGenerated(svgFile("aura-capability-map.svg", "AURA / SPATIAL OS", "Environment sensing and adaptive response", 1), pageId),
    pdfExisting || uploadGenerated(minimalPdfFile(), pageId),
    attachmentExisting ||
      uploadGenerated(
        new File(
          [
            "AURA observation log\n\n- Observe before interrupting.\n- Explain every adaptation.\n- Keep manual control available.\n- Prefer calm, reversible interventions.\n",
          ],
          "aura-observation-log.txt",
          { type: "text/plain" },
        ),
        pageId,
      ),
    drawioExisting || uploadGenerated(svgFile("aura-system-map.svg", "AURA SYSTEM MAP", "Signals -> interpretation -> adaptation", 2), pageId),
    excalidrawExisting || uploadGenerated(svgFile("aura-interaction-sketch.svg", "AURA INTERACTION SKETCH", "A rough spatial conversation between person, room, and system", 3), pageId),
  ]);

  return { image, pdf, attachment, drawio, excalidraw };
}

function mediaPlaylist(kind: MediaKind, title: string, items: MediaItem[]): JSONContent {
  return {
    type: "mediaPlaylist",
    attrs: {
      kind,
      title,
      items,
      activeKey: items[0]?.key || "",
      autoplay: false,
      loop: false,
    },
  };
}

function columns(
  layout: string,
  labels: string[],
  options: {
    widths?: Array<number | null>;
    verticalAlign?: "top" | "center" | "bottom" | "stretch";
    gap?: "compact" | "standard" | "wide";
    widthMode?: "normal" | "wide";
  } = {},
): JSONContent {
  return {
    type: "columns",
    attrs: {
      layout,
      widthMode: options.widthMode || "normal",
      verticalAlign: options.verticalAlign || "top",
      gap: options.gap || "standard",
    },
    content: labels.map((label, index) => ({
      type: "column",
      attrs: { width: options.widths?.[index] ?? null },
      content: [
        H(3, label),
        P(
          index % 2 === 0
            ? "A spatial response should make the reason for adaptation visible without asking the person to learn a hidden rule."
            : "The room can be proactive without becoming noisy: sense context, suggest softly, preserve agency, and remain reversible.",
        ),
        ...(index === 1
          ? [P("This intentionally taller cell makes alignment and responsive stacking easy to inspect in the real case study.")]
          : []),
      ],
    })),
  };
}

function tableNode(): JSONContent {
  const cell = (text: string, header = false): JSONContent => ({
    type: header ? "tableHeader" : "tableCell",
    content: [P(text)],
  });
  return {
    type: "table",
    content: [
      {
        type: "tableRow",
        content: [cell("Signal", true), cell("Interpretation", true), cell("Response", true)],
      },
      {
        type: "tableRow",
        content: [cell("Occupancy"), cell("Room is active"), cell("Prepare shared lighting")],
      },
      {
        type: "tableRow",
        content: [cell("Low speech energy"), cell("Conversation is settling"), cell("Reduce environmental noise")],
      },
      {
        type: "tableRow",
        content: [cell("Manual override"), cell("Person disagrees"), cell("Stop adaptation immediately")],
      },
    ],
  };
}

function marksParagraph(): JSONContent {
  return {
    type: "paragraph",
    content: [
      T("The writing system supports "),
      T("bold", [{ type: "bold" }]),
      T(", "),
      T("italic", [{ type: "italic" }]),
      T(", "),
      T("underline", [{ type: "underline" }]),
      T(", "),
      T("strike", [{ type: "strike" }]),
      T(", "),
      T("inline code", [{ type: "code" }]),
      T(", "),
      T("highlight", [{ type: "highlight" }]),
      T(", and "),
      T("links", [{ type: "link", attrs: { href: "https://example.com", target: "_blank", rel: "noopener noreferrer" } }]),
      T(". A note can carry x"),
      T("2", [{ type: "superscript" }]),
      T(" or H"),
      T("2", [{ type: "subscript" }]),
      T("O without leaving the narrative flow."),
    ],
  };
}

function embeds(): JSONContent[] {
  const make = (provider: string, src: string, height = 420): JSONContent => ({
    type: "embed",
    attrs: { provider, src, align: "center", width: 800, height },
  });
  return [
    H(3, "YouTube"),
    make("youtube", "https://www.youtube-nocookie.com/embed/jNQXAC9IVRw", 450),
    H(3, "Vimeo"),
    make("vimeo", "https://player.vimeo.com/video/76979871", 450),
    H(3, "Figma"),
    make("figma", "https://www.figma.com/embed?embed_host=docmost&url=https://www.figma.com/community", 480),
    H(3, "Framer"),
    make("framer", "https://www.framer.com/", 420),
    H(3, "Loom"),
    make("loom", "https://www.loom.com/", 420),
    H(3, "Miro"),
    make("miro", "https://miro.com/", 420),
    H(3, "Generic iframe"),
    make("iframe", "https://example.com", 360),
  ];
}

export function buildCapabilityShowcaseDocument(
  existing: JSONContent,
  assets: CapabilityShowcaseAssets,
): JSONContent {
  const videos = collectMedia(existing, "video");
  const audios = collectMedia(existing, "audio");
  const standaloneVideo = videos[0];
  const standaloneAudio = audios[0];

  const content: JSONContent[] = [
    H(1, "Overview"),
    H(2, "What if a spatial operating system could understand the room before you asked it to?"),
    P("AURA is a concept for calm spatial intelligence: a system that interprets environmental signals, understands what people are trying to do, and adapts hardware around them without stealing control."),
    marksParagraph(),
    {
      type: "callout",
      attrs: { type: "info" },
      content: [P("This canonical AURA document is also the living Ramzy Studio capability case study. Every self-contained portfolio document element currently supported by the integrated editor is exercised inside a coherent project narrative rather than a disconnected QA page.")],
    },
    {
      type: "image",
      attrs: {
        src: assets.image.src,
        attachmentId: assets.image.attachmentId,
        alt: "AURA capability map",
        align: "center",
        width: "100%",
      },
    },
    { type: "horizontalRule" },

    H(1, "Opportunity"),
    P("Smart environments usually expose more controls as they become more capable. AURA explores the opposite direction: more intelligence should reduce operational noise while making every important intervention understandable and reversible."),
    H(2, "The design principles"),
    {
      type: "bulletList",
      content: [
        { type: "listItem", content: [P("Observe before interrupting.")] },
        { type: "listItem", content: [P("Explain why the system adapted.")] },
        { type: "listItem", content: [P("Keep manual control immediately available.")] },
        { type: "listItem", content: [P("Prefer reversible changes over irreversible automation.")] },
      ],
    },
    {
      type: "orderedList",
      content: [
        { type: "listItem", content: [P("Sense the environment.")] },
        { type: "listItem", content: [P("Interpret intent and confidence.")] },
        { type: "listItem", content: [P("Propose or perform the smallest useful adaptation.")] },
        { type: "listItem", content: [P("Learn from correction without hiding the rule.")] },
      ],
    },
    {
      type: "taskList",
      content: [
        { type: "taskItem", attrs: { checked: true }, content: [P("Preserve agency in every adaptive flow")] },
        { type: "taskItem", attrs: { checked: true }, content: [P("Make system state legible")] },
        { type: "taskItem", attrs: { checked: false }, content: [P("Validate long-term trust in a lived environment")] },
      ],
    },
    {
      type: "blockquote",
      content: [P("The strongest spatial interaction is often the one that becomes quieter after the system understands you better.")],
    },

    H(1, "Research"),
    P("The research model combines contextual observation, scenario walkthroughs, behavioural signals, and explicit correction. The goal is not to automate everything; it is to understand when automation earns the right to act."),
    H(2, "Research evidence matrix"),
    tableNode(),
    H(2, "Progressive disclosure"),
    {
      type: "details",
      attrs: { open: true },
      content: [
        { type: "detailsSummary", content: [T("Why confidence thresholds matter")] },
        {
          type: "detailsContent",
          content: [
            P("AURA separates observation from intervention. Low-confidence signals remain contextual hints; high-confidence patterns can trigger reversible environmental changes. The threshold itself is part of the interaction model, not a hidden backend rule."),
          ],
        },
      ],
    },
    H(2, "Research lenses"),
    {
      type: "tabs",
      content: [
        { type: "tabPanel", attrs: { label: "Behaviour" }, content: [P("What people repeatedly do, undo, or ignore is often a stronger signal than what they say a smart room should do.")] },
        { type: "tabPanel", attrs: { label: "Environment" }, content: [P("Light, sound, occupancy, device state, time, and room transitions create the contextual layer around explicit interaction.")] },
        { type: "tabPanel", attrs: { label: "Trust" }, content: [P("Trust is measured through correction cost: how easy it is to understand, override, and recover from an adaptation.")] },
      ],
    },

    H(1, "Spatial Model"),
    P("AURA models the room as overlapping zones of activity rather than a flat collection of devices. Layout becomes part of the reasoning model, so this section deliberately exercises the full editorial column system."),
    H(2, "Two-column relationship"),
    columns("two_left_sidebar", ["Context", "Primary narrative"], { verticalAlign: "top", gap: "compact" }),
    H(2, "Custom 1× / 2× / 1× reasoning grid"),
    columns("three_equal", ["Signal", "Interpretation", "Response"], { widths: [1, 2, 1], verticalAlign: "center", gap: "standard", widthMode: "wide" }),
    H(2, "Four-column comparison"),
    columns("four_equal", ["Observe", "Infer", "Adapt", "Explain"], { verticalAlign: "bottom", gap: "wide" }),
    H(2, "Five-column system chain"),
    columns("five_equal", ["Sense", "Fuse", "Model", "Act", "Learn"], { verticalAlign: "stretch", gap: "compact", widthMode: "wide" }),

    H(1, "Interaction System"),
    P("The interaction layer makes intelligence legible. AURA can adapt proactively, but every automated action has an explanation, a visible state, and a path back to direct control."),
    {
      type: "callout",
      attrs: { type: "warning" },
      content: [P("Automation should never turn uncertainty into false confidence. When the system is unsure, the UI should show that uncertainty instead of silently guessing.")],
    },
    H(2, "System architecture diagram"),
    {
      type: "drawio",
      attrs: {
        src: assets.drawio.src,
        attachmentId: assets.drawio.attachmentId,
        title: "AURA system map",
        alt: "AURA system map",
        align: "center",
        width: "100%",
        aspectRatio: 16 / 9,
      },
    },
    H(2, "Interaction sketch"),
    {
      type: "excalidraw",
      attrs: {
        src: assets.excalidraw.src,
        attachmentId: assets.excalidraw.attachmentId,
        title: "AURA interaction sketch",
        alt: "AURA interaction sketch",
        align: "center",
        width: "100%",
        aspectRatio: 16 / 9,
      },
    },
    H(2, "Logic as code"),
    {
      type: "codeBlock",
      attrs: { language: "typescript" },
      content: [T("const response = confidence > 0.82\n  ? adaptEnvironment(context)\n  : explainAndAsk(context);\n\nreturn preserveManualControl(response);")],
    },
    H(2, "State transition"),
    {
      type: "codeBlock",
      attrs: { language: "mermaid" },
      content: [T("flowchart LR\n  Observe --> Interpret\n  Interpret -->|high confidence| Adapt\n  Interpret -->|low confidence| Ask\n  Adapt --> Explain\n  Ask --> Learn\n  Explain --> Learn")],
    },
    H(2, "A simple confidence model"),
    {
      type: "paragraph",
      content: [T("AURA can explain an inline confidence score such as "), { type: "mathInline", attrs: { text: "P(intent|context)" } }, T(" without removing the reader from the narrative.")],
    },
    { type: "mathBlock", attrs: { text: "score = w_s S + w_c C + w_h H - w_r R" } },

    H(1, "Prototype"),
    P("The prototype deliberately mixes authored narrative, structured diagrams, embedded references, documents, and real media. The point is to make the case study itself behave like a credible product artefact."),
    H(2, "Reference appendix"),
    {
      type: "pdf",
      attrs: {
        src: assets.pdf.src,
        name: "aura-capability-appendix.pdf",
        attachmentId: assets.pdf.attachmentId,
        size: assets.pdf.size,
        width: 800,
        height: 600,
      },
    },
    H(2, "Downloadable observation log"),
    {
      type: "attachment",
      attrs: {
        url: assets.attachment.src,
        name: "aura-observation-log.txt",
        mime: "text/plain",
        size: assets.attachment.size,
        attachmentId: assets.attachment.attachmentId,
      },
    },

    H(1, "Media System"),
    P("AURA uses media as evidence, not decoration. A single clip can stand alone; related clips become one Ramzy playlist with one playback surface and one library. Audio uses the same session arbitration so starting another medium stops the current one."),
  ];

  if (standaloneVideo) {
    content.push(
      H(2, "Standalone field film"),
      { type: "video", attrs: { ...standaloneVideo, alt: standaloneVideo.title, width: "100%", placeholder: null } },
    );
  } else {
    content.push({ type: "callout", attrs: { type: "warning" }, content: [P("No existing video attachment was available in this draft. Upload one video to activate the standalone Ramzy Player example.")] });
  }

  content.push(H(2, "Video playlist"), mediaPlaylist("video", "AURA field films", videos));

  if (standaloneAudio) {
    content.push(
      H(2, "Standalone field recording"),
      { type: "audio", attrs: { ...standaloneAudio, placeholder: null } },
    );
  } else {
    content.push({ type: "callout", attrs: { type: "warning" }, content: [P("No existing audio attachment was available in this draft. Upload one audio file to activate the standalone Ramzy Wave example.")] });
  }

  content.push(
    H(2, "Audio playlist"),
    mediaPlaylist("audio", "AURA field recordings", audios),

    H(1, "External References"),
    P("The embed layer keeps third-party product and research references inside the narrative. Provider availability still depends on the external source allowing embedding, so a blocked third-party frame is a provider-policy issue rather than a lost Studio node."),
    ...embeds(),

    H(1, "Validation"),
    P("The final validation combines content comprehension, authoring reliability, responsive behaviour, media persistence, and the ability to recover the draft without inventing a second content system."),
    H(2, "Footnoted reasoning"),
    {
      type: "paragraph",
      content: [
        T("A calm system should be judged not only by task completion, but by the amount of cognitive residue it leaves behind"),
        { type: "footnoteReference", attrs: { "data-id": "aura-footnote-1", referenceNumber: "1", href: "#fn:1", class: "footnote-ref" }, content: [T("1")] },
        T("."),
      ],
    },
    {
      type: "footnotes",
      attrs: { class: "footnotes" },
      content: [
        {
          type: "footnote",
          attrs: { id: "fn:1", "data-id": "aura-footnote-1" },
          content: [P("In AURA, cognitive residue means the attention spent understanding, correcting, or remembering what an automated environment just did.")],
        },
      ],
    },
    { type: "horizontalRule" },
    H(2, "Print appendix boundary"),
    P("The following page-break node verifies print/export behaviour without changing the public reading hierarchy."),
    { type: "pageBreak" },

    H(1, "Reflection"),
    P("A portfolio system should make design reasoning easier to follow. AURA remains the canonical living project because it can exercise typography, navigation, advanced layouts, structured content, diagrams, embeds, documents, media, playlists, and responsive behaviour in one coherent story."),
    {
      type: "callout",
      attrs: { type: "success" },
      content: [P("The capability document is rebuilt through the real Ramzy Studio editor and saved by the normal draft lifecycle. It is not a fixture, HTML export, or parallel content model.")],
    },
    P("End of AURA capability case study."),
  );

  return { type: "doc", content };
}

export async function rebuildCapabilityShowcase(
  editor: Editor,
  pageId: string,
): Promise<JSONContent> {
  const existing = editor.getJSON();
  const assets = await prepareCapabilityShowcaseAssets(existing, pageId);
  const document = buildCapabilityShowcaseDocument(existing, assets);

  // Validate against the exact live Studio schema before replacing the draft.
  // If a future Docmost upgrade removes/renames a capability, the rebuild fails
  // safely without destroying the existing AURA document.
  editor.schema.nodeFromJSON(document as any);

  editor.commands.setContent(document, { emitUpdate: true });
  editor.commands.focus("start");
  return document;
}
