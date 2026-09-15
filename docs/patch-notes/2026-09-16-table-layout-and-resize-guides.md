# Table layout and resize guide correction

## Roadmap scope

- Phase: 13 — Authoring & media.
- Roadmap item: Govern all portfolio elements with the existing design system (`11178824-439d-4552-b760-cbc2b80c3f0b`); Experience Lab acceptance.
- Impact: Fix table hover geometry, compact pinned headers and row resize snapping.

## Changes

- Ignore ProseMirror widgets when finding the last content child of a table cell. Hovering the column divider must not reinstate paragraph margins or increase row heights.
- Choose header pinning from horizontal fit and actual computed wrapper overflow, including after responsive resizing. A scroll wrapper must not use native sticky with a document header offset; use the existing transform fallback instead.
- Remove the obsolete three-column narrow-table scrolling exception. Compact one/two/three-column tables fit their lane even with saved desktop col widths; wider tables retain internal scrolling. Stored widths/content are preserved.
- Anchor the 8px edge / 16px centred-width rhythm to the actual Normal measure. Exact Normal/Wide/Full anchors and regular steps share one snap/guide target set. Nearby redundant rhythm points yield to exact anchors, and the active snapped guide remains highlighted even when the pointer lands exactly on it. The gesture retains its original centre.

## Verification

- Client: 36 files / 345 tests passed; TypeScript passed; editor extensions compiled.
- Full Experience Lab: 3 scenarios passed. Packaged runtime built.
- Chromium with compiled production CSS and actual header controller: old divider-hover fixture grew 48px, fixed fixture grows 0px. Old compact header displaced 45px and covered the Desktop row; fixed header begins at the table's 1px border and does not overlap the first row.
- Real-browser 320/390/420/570px lanes: one/two/three-column tables fit, five-column tables scroll within the wrapper. Reusable check: `scripts/check-portfolio-table-layout.mjs` with Playwright available; optional `RAMZY_LAYOUT_BASELINE` for before/after.
- Windows/iPad live draft acceptance remains pending. No content import, publication, merge or deployment is part of this change.
