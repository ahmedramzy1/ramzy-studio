import type { JSONContent } from "@tiptap/core";

export const PORTFOLIO_TEST_PROJECT_KEYS = [
  "orbit-mobility-command",
  "luma-adaptive-care",
  "atlas-operations-platform",
  "echo-field-intelligence",
  "tide-climate-planning",
] as const;

export type PortfolioTestProjectKey =
  (typeof PORTFOLIO_TEST_PROJECT_KEYS)[number];

/**
 * The five documents are deliberately split by capability family. Keeping the
 * matrix beside the builders makes omissions visible during review without
 * turning any individual TipTap document into another unbounded mega-document.
 */
export const PORTFOLIO_TEST_PROJECT_COVERAGE: Record<
  PortfolioTestProjectKey,
  readonly string[]
> = {
  "orbit-mobility-command": [
    "headings",
    "text marks",
    "links",
    "bullet list",
    "ordered list",
    "task list",
    "blockquote",
    "table",
    "details",
    "tabs",
    "horizontal rule",
  ],
  "luma-adaptive-care": [
    "image",
    "callout",
    "two columns",
    "three columns",
    "four columns",
    "five columns",
    "column alignment",
    "column gaps",
    "custom widths",
    "draw.io",
    "Excalidraw",
  ],
  "atlas-operations-platform": [
    "code block",
    "Mermaid",
    "inline math",
    "math block",
    "PDF",
    "attachment",
    "footnotes",
    "page break",
  ],
  "echo-field-intelligence": [
    "uploaded video",
    "YouTube video",
    "Vimeo video",
    "video playlist",
    "audio",
    "audio playlist",
    "PiP follow",
    "Ramzy Mini",
    "global media handoff",
  ],
  "tide-climate-planning": [
    "YouTube embed",
    "Vimeo embed",
    "Figma embed",
    "Framer embed",
    "Loom embed",
    "Miro embed",
    "generic iframe",
  ],
};

type Profile = {
  title: string;
  company: string;
  premise: string;
  outcome: string;
};

const PROFILES: Record<PortfolioTestProjectKey, Profile> = {
  "orbit-mobility-command": {
    title: "ORBIT — Mobility Command",
    company: "Northline Transit",
    premise:
      "A multimodal operations product that helps city teams understand disruption, coordinate response, and keep riders informed.",
    outcome:
      "The pilot reduced incident handoff time and gave operations, service, and communications teams one shared operational picture.",
  },
  "luma-adaptive-care": {
    title: "LUMA — Adaptive Care",
    company: "Luma Health Network",
    premise:
      "A coordinated-care workspace that turns fragmented patient context into calm, legible decisions for clinical teams.",
    outcome:
      "The prototype improved confidence during shift handover and made escalation paths visible without adding dashboard noise.",
  },
  "atlas-operations-platform": {
    title: "ATLAS — Operations Platform",
    company: "Atlas Industrial",
    premise:
      "A reliability platform that connects field signals, operating procedures, and explainable risk models for distributed teams.",
    outcome:
      "Operators could trace each recommendation back to evidence, inspect uncertainty, and export a complete decision record.",
  },
  "echo-field-intelligence": {
    title: "ECHO — Field Intelligence",
    company: "Echo Research Collective",
    premise:
      "A research evidence system that keeps field films, interviews, audio notes, and synthesis in one navigable case-study record.",
    outcome:
      "Researchers moved through mixed media without losing playback context, duplicating players, or breaking the narrative flow.",
  },
  "tide-climate-planning": {
    title: "TIDE — Climate Planning",
    company: "Tide Civic Lab",
    premise:
      "A collaborative planning environment that brings maps, prototypes, workshops, and policy evidence into one public decision trail.",
    outcome:
      "Teams could compare scenarios, review external artefacts in context, and preserve the reasoning behind a chosen climate plan.",
  },
};

const text = (value: string, marks?: JSONContent["marks"]): JSONContent => ({
  type: "text",
  text: value,
  marks,
});

const paragraph = (
  value: string,
  marks?: JSONContent["marks"],
): JSONContent => ({
  type: "paragraph",
  content: value ? [text(value, marks)] : undefined,
});

const heading = (level: 1 | 2 | 3, value: string): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [text(value)],
});

const callout = (
  type: "info" | "warning" | "success",
  value: string,
): JSONContent => ({
  type: "callout",
  attrs: { type },
  content: [paragraph(value)],
});

function foundation(profile: Profile): JSONContent[] {
  return [
    heading(1, "Overview"),
    heading(2, profile.title),
    paragraph(profile.premise),
    callout(
      "info",
      "This is a complete case study and a focused Ramzy Studio capability specimen. It stays intentionally bounded so editing remains responsive.",
    ),
    heading(1, "Challenge"),
    paragraph(
      "The existing workflow fragmented evidence across tools, obscured ownership, and made it difficult to understand why a decision had been made.",
    ),
    heading(1, "Process"),
    paragraph(
      "The work moved from contextual research and system modelling through prototyping, validation, and a measured implementation plan.",
    ),
  ];
}

function ending(profile: Profile): JSONContent[] {
  return [
    heading(1, "Outcome"),
    paragraph(profile.outcome),
    heading(1, "Reflection"),
    paragraph(
      "The strongest result was not another surface. It was a clearer relationship between evidence, decisions, system behaviour, and human control.",
    ),
    callout(
      "success",
      `End of ${profile.title}. The document remains a private Studio draft until Publish is explicitly selected.`,
    ),
  ];
}

function list(
  type: "bulletList" | "orderedList",
  values: string[],
): JSONContent {
  return {
    type,
    content: values.map((value) => ({
      type: "listItem",
      content: [paragraph(value)],
    })),
  };
}

function table(): JSONContent {
  const cell = (value: string, header = false): JSONContent => ({
    type: header ? "tableHeader" : "tableCell",
    content: [paragraph(value)],
  });
  return {
    type: "table",
    content: [
      {
        type: "tableRow",
        content: [cell("Evidence", true), cell("Decision", true), cell("Measure", true)],
      },
      {
        type: "tableRow",
        content: [cell("Control-room shadowing"), cell("Shared incident timeline"), cell("Handoff time")],
      },
      {
        type: "tableRow",
        content: [cell("Rider interviews"), cell("Plain-language updates"), cell("Confidence")],
      },
    ],
  };
}

function orbitDocument(profile: Profile): JSONContent {
  return {
    type: "doc",
    content: [
      ...foundation(profile),
      heading(2, "Research priorities"),
      {
        type: "paragraph",
        content: [
          text("The system needed "),
          text("clear ownership", [{ type: "bold" }]),
          text(", "),
          text("calm escalation", [{ type: "italic" }]),
          text(", "),
          text("visible status", [{ type: "underline" }]),
          text(", no "),
          text("false certainty", [{ type: "strike" }]),
          text(", stable "),
          text("incident_id", [{ type: "code" }]),
          text(", and "),
          text("evidence worth noticing", [{ type: "highlight" }]),
          text(". Read the "),
          text("service standard", [
            {
              type: "link",
              attrs: {
                href: "https://example.com/orbit-service-standard",
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
          ]),
          text("; priority x"),
          text("2", [{ type: "superscript" }]),
          text(" and CO"),
          text("2", [{ type: "subscript" }]),
          text(" remain readable inside the narrative."),
        ],
      },
      list("bulletList", [
        "Observe the real incident handoff before designing the dashboard.",
        "Separate operational truth from public communication.",
        "Preserve a visible owner for every intervention.",
      ]),
      list("orderedList", [
        "Detect the disruption.",
        "Confirm impact and confidence.",
        "Coordinate the response.",
        "Explain the result to riders.",
      ]),
      {
        type: "taskList",
        content: [
          { type: "taskItem", attrs: { checked: true }, content: [paragraph("Map the control-room workflow")] },
          { type: "taskItem", attrs: { checked: true }, content: [paragraph("Prototype the incident timeline")] },
          { type: "taskItem", attrs: { checked: false }, content: [paragraph("Validate across a full seasonal service cycle")] },
        ],
      },
      {
        type: "blockquote",
        content: [paragraph("A useful operations product makes the next responsible action obvious without hiding uncertainty.")],
      },
      heading(2, "Evidence matrix"),
      table(),
      {
        type: "details",
        attrs: { open: true },
        content: [
          { type: "detailsSummary", content: [text("Why confidence is shown")] },
          {
            type: "detailsContent",
            content: [paragraph("Operators can distinguish confirmed disruption from an inferred risk and choose an appropriately reversible response.")],
          },
        ],
      },
      {
        type: "tabs",
        content: [
          { type: "tabPanel", attrs: { label: "Operations" }, content: [paragraph("Live incident state, owner, dependencies, and recovery path.")] },
          { type: "tabPanel", attrs: { label: "Riders" }, content: [paragraph("Plain-language impact, alternatives, and confidence.")] },
          { type: "tabPanel", attrs: { label: "Learning" }, content: [paragraph("A traceable record of what changed and why.")] },
        ],
      },
      { type: "horizontalRule" },
      ...ending(profile),
    ],
  };
}

function svgAsset(title: string, subtitle: string, square = false) {
  const width = square ? 600 : 1600;
  const height = square ? 600 : 900;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#071B2D"/><circle cx="${square ? 300 : 1250}" cy="${square ? 300 : 250}" r="${square ? 180 : 170}" fill="#0F3151" stroke="#77B5E8" stroke-width="8"/><path d="M100 ${height - 180} C 420 300 720 ${height - 80} ${width - 100} 360" fill="none" stroke="#5E8FFF" stroke-width="8"/><text x="${square ? 300 : 100}" y="${square ? 315 : 120}" text-anchor="${square ? "middle" : "start"}" font-family="Arial" font-size="${square ? 56 : 64}" font-weight="700" fill="#F5F8FC">${title}</text><text x="100" y="190" font-family="Arial" font-size="28" fill="#A8C4FF">${subtitle}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function columns(
  layout: string,
  labels: string[],
  verticalAlign: "top" | "center" | "bottom" | "stretch",
  gap: "compact" | "standard" | "wide",
  widths?: number[],
): JSONContent {
  return {
    type: "columns",
    attrs: { layout, verticalAlign, gap, widthMode: labels.length > 2 ? "wide" : "normal" },
    content: labels.map((label, index) => ({
      type: "column",
      attrs: { width: widths?.[index] ?? null },
      content: [
        heading(3, label),
        paragraph(index % 2 ? "Context stays visible while the primary workflow receives appropriate emphasis." : "Each region has a clear role, responsive order, and deliberate visual weight."),
      ],
    })),
  };
}

function lumaDocument(profile: Profile): JSONContent {
  const systemMap = svgAsset("LUMA SYSTEM MAP", "Care context → decision → follow-up");
  const sketch = svgAsset("LUMA SKETCH", "A calm handover conversation");
  return {
    type: "doc",
    content: [
      ...foundation(profile),
      heading(2, "Care-context map"),
      {
        type: "image",
        attrs: { src: systemMap, alt: "LUMA care-context map", align: "center", width: "100%" },
      },
      callout("warning", "Clinical urgency and data confidence are different signals. The interface never collapses them into one unexplained score."),
      heading(2, "Two-column handover"),
      columns("two_left_sidebar", ["Patient context", "Primary care narrative"], "top", "compact"),
      heading(2, "Three-column decision model"),
      columns("three_equal", ["Signal", "Clinical interpretation", "Next action"], "center", "standard", [1, 2, 1]),
      heading(2, "Four-stage coordination"),
      columns("four_equal", ["Review", "Discuss", "Decide", "Follow up"], "bottom", "wide"),
      heading(2, "Five-part continuity chain"),
      columns("five_equal", ["History", "Now", "Risk", "Plan", "Learning"], "stretch", "compact"),
      heading(2, "System architecture"),
      {
        type: "drawio",
        attrs: { src: systemMap, title: "LUMA system architecture", alt: "LUMA system architecture", align: "center", width: "100%", aspectRatio: 16 / 9 },
      },
      heading(2, "Interaction sketch"),
      {
        type: "excalidraw",
        attrs: { src: sketch, title: "LUMA handover sketch", alt: "LUMA handover sketch", align: "center", width: "100%", aspectRatio: 16 / 9 },
      },
      ...ending(profile),
    ],
  };
}

function minimalPdf() {
  const stream = "BT\n/F1 24 Tf\n72 720 Td\n(ATLAS reliability appendix) Tj\nET\n";
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) { offsets.push(pdf.length); pdf += object; }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return `data:application/pdf;charset=utf-8,${encodeURIComponent(pdf)}`;
}

function atlasDocument(profile: Profile): JSONContent {
  const appendix = minimalPdf();
  const log = "ATLAS decision log\n\n- Expose evidence.\n- Explain uncertainty.\n- Preserve operator control.\n";
  return {
    type: "doc",
    content: [
      ...foundation(profile),
      heading(2, "Decision logic"),
      {
        type: "codeBlock",
        attrs: { language: "typescript" },
        content: [text("const recommendation = confidence > 0.82\n  ? proposeSafeAction(context)\n  : requestOperatorReview(context);\n\nreturn explain(recommendation);")],
      },
      heading(2, "Operational state"),
      {
        type: "codeBlock",
        attrs: { language: "mermaid" },
        content: [text("flowchart LR\n  Observe --> Interpret\n  Interpret --> Review\n  Review --> Act\n  Act --> Explain\n  Explain --> Learn")],
      },
      {
        type: "paragraph",
        content: [text("The inline risk model is "), { type: "mathInline", attrs: { text: "P(failure|context)" } }, text(" and remains subordinate to operator judgement.")],
      },
      { type: "mathBlock", attrs: { text: "risk = w_s S + w_h H - w_c C" } },
      heading(2, "Reliability appendix"),
      { type: "pdf", attrs: { src: appendix, name: "atlas-reliability-appendix.pdf", size: appendix.length, width: 800, height: 600 } },
      heading(2, "Downloadable decision log"),
      { type: "attachment", attrs: { url: `data:text/plain;charset=utf-8,${encodeURIComponent(log)}`, name: "atlas-decision-log.txt", mime: "text/plain", size: log.length } },
      heading(2, "Footnoted validation"),
      {
        type: "paragraph",
        content: [
          text("A recommendation is useful only when the operator can inspect and contest its evidence"),
          { type: "footnoteReference", attrs: { "data-id": "atlas-note-1", referenceNumber: "1", href: "#fn:atlas-1", class: "footnote-ref" }, content: [text("1")] },
          text("."),
        ],
      },
      {
        type: "footnotes",
        attrs: { class: "footnotes" },
        content: [
          { type: "footnote", attrs: { id: "fn:atlas-1", "data-id": "atlas-note-1" }, content: [paragraph("ATLAS records source signals, model confidence, operator action, and the final outcome.")] },
        ],
      },
      { type: "horizontalRule" },
      paragraph("The following page break keeps the printable appendix separate from the main narrative."),
      { type: "pageBreak" },
      ...ending(profile),
    ],
  };
}

function arrayBufferDataUrl(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

function wave(frequency: number) {
  const sampleRate = 16_000;
  const sampleCount = sampleRate;
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  const ascii = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
  };
  ascii(0, "RIFF"); view.setUint32(4, 36 + sampleCount * 2, true); ascii(8, "WAVE"); ascii(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); ascii(36, "data"); view.setUint32(40, sampleCount * 2, true);
  for (let index = 0; index < sampleCount; index += 1) {
    const envelope = Math.min(1, index / 500) * Math.min(1, (sampleCount - index) / 500);
    const sample = Math.sin(2 * Math.PI * frequency * (index / sampleRate)) * 0.22 * envelope;
    view.setInt16(44 + index * 2, Math.round(sample * 32767), true);
  }
  return arrayBufferDataUrl(buffer, "audio/wav");
}

function blobDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not encode generated test media."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

async function video(label: string) {
  if (typeof document === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }
  const canvas = document.createElement("canvas");
  canvas.width = 320; canvas.height = 180;
  const context = canvas.getContext("2d");
  if (!context || typeof canvas.captureStream !== "function") return "";
  const stream = canvas.captureStream(8);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? "video/webm;codecs=vp8" : "video/webm";
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 100_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  const stopped = new Promise<void>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Could not generate the ECHO field film."));
    recorder.onstop = () => resolve();
  });
  recorder.start(80);
  const started = performance.now();
  while (performance.now() - started < 750) {
    const progress = Math.min(1, (performance.now() - started) / 750);
    context.fillStyle = "#071B2D"; context.fillRect(0, 0, 320, 180);
    context.strokeStyle = "#77B5E8"; context.lineWidth = 4; context.beginPath(); context.moveTo(24, 130); context.bezierCurveTo(90, 60, 190, 160, 295, 92 - progress * 18); context.stroke();
    context.fillStyle = "#F5F8FC"; context.font = "700 27px Arial"; context.fillText(label, 22, 42);
    await new Promise((resolve) => setTimeout(resolve, 70));
  }
  recorder.stop(); await stopped; stream.getTracks().forEach((track) => track.stop());
  return blobDataUrl(new Blob(chunks, { type: "video/webm" }));
}

async function echoDocument(profile: Profile): Promise<JSONContent> {
  const [filmA, filmB] = await Promise.all([video("ECHO / 01"), video("ECHO / 02")]);
  const poster = svgAsset("ECHO FIELD FILM", "Mixed-media research evidence");
  const artwork = svgAsset("ECHO", "Field recording", true);
  const audioA = wave(440);
  const audioB = wave(554);
  const videos = [
    ...(filmA ? [{ key: "echo-film-1", source: "upload", src: filmA, title: "Context walk 01", subtitle: "Uploaded field film", poster, durationSeconds: 0.75, dateAdded: "2026-08-27" }] : []),
    { key: "echo-youtube", source: "youtube", externalUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE", title: "YouTube provider test", subtitle: "Provider-native playback", dateAdded: "2026-08-27" },
    { key: "echo-vimeo", source: "vimeo", externalUrl: "https://vimeo.com/76979871", title: "Vimeo provider test", subtitle: "Provider-native playback", dateAdded: "2026-08-27" },
    ...(filmB ? [{ key: "echo-film-2", source: "upload", src: filmB, title: "Context walk 02", subtitle: "Uploaded field film", poster, durationSeconds: 0.75, dateAdded: "2026-08-27" }] : []),
  ];
  const audios = [
    { key: "echo-audio-1", src: audioA, title: "Interview synthesis 01", artist: "Echo Research Collective", description: "Generated test recording", artwork, durationSeconds: 1, dateAdded: "2026-08-27" },
    { key: "echo-audio-2", src: audioB, title: "Interview synthesis 02", artist: "Echo Research Collective", description: "Generated test recording", artwork, durationSeconds: 1, dateAdded: "2026-08-27" },
  ];
  return {
    type: "doc",
    content: [
      ...foundation(profile),
      heading(2, "Standalone field film"),
      filmA
        ? { type: "video", attrs: { source: "upload", src: filmA, alt: "ECHO context walk", poster, width: "100%", durationSeconds: 0.75, placeholder: null } }
        : callout("warning", "This browser could not generate the native test clip; the external provider playlist remains available."),
      heading(2, "Mixed video playlist"),
      { type: "mediaPlaylist", attrs: { kind: "video", title: "ECHO field films", items: videos, activeKey: videos[0]?.key || "", autoplay: false, loop: false } },
      heading(2, "Standalone field recording"),
      { type: "audio", attrs: { src: audioA, title: "Interview synthesis 01", artist: "Echo Research Collective", album: "Field evidence", description: "Generated test recording", artwork, artworkSource: "custom", durationSeconds: 1, placeholder: null } },
      heading(2, "Audio playlist"),
      { type: "mediaPlaylist", attrs: { kind: "audio", title: "ECHO field recordings", items: audios, activeKey: audios[0].key, autoplay: false, loop: false } },
      paragraph("Scroll away while media is playing to verify V184 follow behaviour: video becomes floating PiP, audio becomes Ramzy Mini, and starting a new medium pauses the previous session."),
      ...ending(profile),
    ],
  };
}

function embed(provider: string, src: string, height = 420): JSONContent {
  return { type: "embed", attrs: { provider, src, align: "center", width: 800, height } };
}

function tideDocument(profile: Profile): JSONContent {
  return {
    type: "doc",
    content: [
      ...foundation(profile),
      callout("warning", "External artefacts remain references. The case-study narrative and decision record stay canonical in Ramzy Studio."),
      heading(2, "YouTube workshop film"),
      embed("youtube", "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE", 450),
      heading(2, "Vimeo scenario film"),
      embed("vimeo", "https://player.vimeo.com/video/76979871", 450),
      heading(2, "Figma prototype"),
      embed("figma", "https://www.figma.com/embed?embed_host=docmost&url=https://www.figma.com/community", 480),
      heading(2, "Framer interaction"),
      embed("framer", "https://www.framer.com/"),
      heading(2, "Loom walkthrough"),
      embed("loom", "https://www.loom.com/"),
      heading(2, "Miro workshop board"),
      embed("miro", "https://miro.com/"),
      heading(2, "Generic evidence frame"),
      embed("iframe", "https://example.com", 360),
      ...ending(profile),
    ],
  };
}

export async function buildPortfolioTestProjectDocument(
  key: PortfolioTestProjectKey,
): Promise<JSONContent> {
  const profile = PROFILES[key];
  if (!profile) throw new Error(`Unknown portfolio test project: ${key}`);
  if (key === "orbit-mobility-command") return orbitDocument(profile);
  if (key === "luma-adaptive-care") return lumaDocument(profile);
  if (key === "atlas-operations-platform") return atlasDocument(profile);
  if (key === "echo-field-intelligence") return echoDocument(profile);
  return tideDocument(profile);
}
