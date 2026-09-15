# Ramzy Portfolio Builder — Product Contract

## Product goal

Build the most capable portfolio case-study authoring experience we can reasonably make while avoiding reinvention of mature editor foundations.

Ramzy Studio uses Docmost as the authoring engine. We preserve the existing ahmedramzy.com project workflow and replace the old Ramzy Writer / block-building tools with the customised Docmost editor.

## Non-negotiable architecture

One case-study document powers both views:

- **Build** = editable Docmost renderer.
- **Preview** = read-only Docmost renderer using the same document.
- Preview must never use a lossy translation of Build content.
- Sanity continues to own project metadata: title, company, roles, cover, year, classification, status, SEO, visibility, etc.
- Ramzy Studio owns the case-study body.

## Migration rule

No existing Ramzy Builder capability is removed merely because vanilla Docmost lacks it.

Every legacy capability is classified as one of:

1. **Use Docmost** — native feature is already strong enough.
2. **Extend Docmost** — use the native node/interaction as foundation and add portfolio controls.
3. **Custom portfolio node** — retain the capability as a Ramzy Studio node.
4. **Retire** — only when it is genuinely redundant or low-value.

## Capability matrix

| Existing / desired capability | Decision | Notes |
| --- | --- | --- |
| Rich text, headings, lists, links, formatting | Use Docmost | Native editor foundation |
| Tables | Use + extend Docmost | Keep our table UX/design-system work |
| Code | Use Docmost | Preserve syntax highlighting |
| Callouts | Use Docmost | Style as Ramzy UI |
| Toggles | Use Docmost | Useful for optional detail |
| Footnotes | Use Docmost | Strong research/documentation feature |
| Columns | Use + extend Docmost | Add portfolio layout presets where needed |
| Images | Extend Docmost | Preserve captions, width, alignment, full-bleed needs |
| Video | Extend Docmost | Preserve portfolio presentation controls |
| Audio | Extend Docmost | Preserve richer metadata/artwork/transcript needs |
| Figma / Framer / YouTube / Vimeo / Loom / Miro | Use Docmost | Curated embed presets |
| Generic iframe embed | Use Docmost | Keep available but not prominent |
| Photo Grid | Custom portfolio node | Legacy advantage to preserve |
| Photo Gallery | Custom portfolio node | Legacy advantage to preserve |
| Video Playlist | Custom portfolio node | Legacy advantage to preserve |
| Audio Playlist | Custom portfolio node | Legacy advantage to preserve |
| 3D / Spline / Sketchfab presentation | Custom portfolio embed/node | Portfolio-specific |
| Prototype presentation | Extend Docmost embed | Figma/Framer first-class UX |
| Section navigation | Portfolio feature | Build from document headings/sections |
| Project metadata / cover / SEO | Sanity | Do not duplicate inside Docmost |
| Build / Preview / Publish workflow | ahmedramzy.com | Preserve existing experience |

## Portfolio Mode slash menu

The portfolio authoring surface is intentionally curated. Normal Docmost keeps its complete feature set.

Initial Portfolio Mode includes:

### Writing
- Text
- Heading 1 / 2 / 3
- Bullet / numbered list
- Quote
- Callout
- Toggle
- Divider
- Footnote

### Media
- Image
- Video
- Audio
- PDF

### Layout
- Table
- 2 / 3 / 4 columns

### Interactive
- Figma
- Framer
- YouTube
- Vimeo
- Loom
- Miro
- Generic iframe

### Technical
- Code
- Mermaid
- Draw.io
- Excalidraw
- Inline / block math

Docmost wiki/database commands such as Bases, Kanban, Subpages, current date/time and synced wiki blocks are not part of the primary portfolio authoring menu unless a portfolio use-case is proven.

## Selected-element action model

Portfolio Mode follows a Confluence-style selection model:

- Selecting any top-level element shows one floating toolbar below that element.
- The toolbar begins with the element's useful, type-specific actions and ends with one shared `…` menu.
- The shared `…` menu owns universal block actions: duplicate, copy, cut, move up/down, move to section, copy link to element, and delete.
- Legacy right-edge `…` controls must not remain as a second block menu in Portfolio Mode.
- Destructive actions require clear wording and confirmation where accidental loss is plausible.

Nested collections have two action scopes that must not be mixed:

- The collection toolbar controls the collection itself: add items, playback behaviour, layout, visibility, and the shared block menu.
- Each video or audio row inside a playlist owns an item-level `…` menu for its metadata, media replacement, thumbnail or artwork, captions, download, duplication, reordering, and removal.
- Thumbnail, artwork, captions, and any other single-item property must never appear as a playlist-wide toolbar action.

This ownership rule also applies to future nested elements such as gallery items, tabs, database records, and column children: collection actions stay outside; item actions stay attached to the item.

## Missing world-class portfolio primitives

These are candidates for Ramzy-specific nodes after core parity is stable:

- Before / After comparison
- Annotated image
- Metric / outcome cards
- Research insight / quote cards
- Process timeline
- Device / browser frame presentation
- Full-bleed media
- Responsive image compositions
- Lightbox
- Sticky / scrollytelling section
- Prototype presentation frame
- Motion / sequence presentation

## Quality benchmark: Rachel Chen OpenAI case study

Reference: https://www.rachelchen.tech/projects/openai

The benchmark is not to copy content or styling. It is a capability and storytelling test.

The builder must make it easy to reproduce the same kinds of narrative patterns:

- Clear project intro and metadata
- Strong section-based story structure
- Persistent/useful section navigation
- Large editorial imagery
- Alternation between narrative text and visual evidence
- Research → exploration → testing → decisions → constraints → reflection
- Deliberate pacing and whitespace

### Acceptance rule

Anything achievable in that case study should be straightforward in Ramzy Portfolio Builder. Ramzy should then exceed it with richer interactive/media/technical primitives without making basic storytelling harder.

## Torture tests before launch

### Benchmark rebuild test
Recreate the structural/presentation patterns of the Rachel Chen OpenAI case study using placeholder content.

### Ramzy capability test
Create one deliberately dense project containing:

- headings and long-form narrative
- images and captions
- photo grid/gallery
- columns
- table
- Figma prototype
- video
- audio
- 3D/embed
- code
- Mermaid diagram
- callout
- comparison/metric primitives once available

Both Build and Preview must render the same document without feature loss.

## Delivery sequence

1. Architecture contract and Portfolio Mode.
2. Build/Preview parity on one AURA document.
3. Core capability migration.
4. Restore portfolio-specific legacy advantages.
5. Add missing world-class primitives.
6. Rachel benchmark torture test.
7. Ramzy capability torture test.
8. Production hardening and migration away from old caseStudy blocks.
