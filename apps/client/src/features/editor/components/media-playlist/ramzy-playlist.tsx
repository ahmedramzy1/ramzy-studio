// ─── RAMZY PLAYLIST ──────────────────────────────────────────────────────────
// Canonical queue/library list shared by Video Playlist and Audio Playlist.
// Ported from ahmedramzy.com v8.0.0 and adapted to Studio's persisted items.

import React, { useState } from "react";
import { dsTheme, FONT, R, SIGNAL, type DsMode } from "../media/v8-media-tokens";

export interface RamzyPlaylistItemView {
  key: string;
  title: string;
  subtitle?: string;
  artwork?: string;
  durationLabel?: string;
  durationSeconds?: number;
  dateAdded?: string;
  sourceLabel?: string;
  uploadStatus?: "queued" | "uploading" | "processing" | "ready" | "failed";
  uploadProgress?: number;
  uploadStatusLabel?: string;
  uploadError?: string;
}

export interface RamzyPlaylistProps {
  items: RamzyPlaylistItemView[];
  activeKey?: string;
  playingKey?: string;
  mode?: DsMode;
  maxHeight?: number;
  emptyLabel?: string;
  editable?: boolean;
  onSelect?: (key: string) => void;
  onPlay?: (key: string) => void;
  onMove?: (key: string, direction: -1 | 1) => void;
  onReorder?: (fromKey: string, toKey: string) => void;
  onRemove?: (key: string) => void;
  onRetry?: (key: string) => void;
  style?: React.CSSProperties;
}

function formatDuration(value?: number, fallback?: string) {
  if (fallback) return fallback;
  if (!Number.isFinite(value) || value === undefined) return "—";
  const total = Math.max(0, Math.floor(value));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function Icon({ name, size = 18 }: { name: "play" | "grip" | "remove"; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    style: { pointerEvents: "none" },
  } as const;
  if (name === "play") return <svg {...common}><path d="M8 5.2 19 12 8 18.8V5.2Z" fill="currentColor" /></svg>;
  if (name === "grip") return <svg {...common}><circle cx="9" cy="7" r="1.2" fill="currentColor" /><circle cx="15" cy="7" r="1.2" fill="currentColor" /><circle cx="9" cy="12" r="1.2" fill="currentColor" /><circle cx="15" cy="12" r="1.2" fill="currentColor" /><circle cx="9" cy="17" r="1.2" fill="currentColor" /><circle cx="15" cy="17" r="1.2" fill="currentColor" /></svg>;
  return <svg {...common}><path d="M5 7h14M9 7V5h6v2m-8 0 .8 12h8.4L17 7M10 10v6m4-6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function RamzyPlaylist({
  items,
  activeKey,
  playingKey,
  mode = "light",
  maxHeight = 390,
  emptyLabel = "No items yet.",
  editable = false,
  onSelect,
  onPlay,
  onMove,
  onReorder,
  onRemove,
  onRetry,
  style,
}: RamzyPlaylistProps) {
  const c = dsTheme(mode);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  if (!items.length) {
    return (
      <div style={{ padding: "24px 18px", fontFamily: FONT.body, fontSize: 14, color: c.textTertiary, borderTop: `1px solid ${c.borderSubtle}`, textAlign: "center", ...style }}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <div data-ramzy-playlist="true" style={{ borderTop: `1px solid ${c.borderDefault}`, background: c.bgSurface, overflow: "hidden", ...style }}>
      <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: editable ? "32px 54px minmax(0,1fr) 118px 78px 38px" : "54px minmax(0,1fr) 118px 78px", gap: 12, alignItems: "center", padding: editable ? "10px 14px 8px 8px" : "10px 14px 8px", fontFamily: FONT.mono, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", color: c.textTertiary, borderBottom: `1px solid ${c.borderSubtle}` }}>
        {editable && <span />}
        <span />
        <span>Title</span>
        <span>Date added</span>
        <span style={{ textAlign: "right" }}>Duration</span>
        {editable && <span />}
      </div>

      <div style={{ maxHeight, overflowY: "auto", overscrollBehavior: "contain" }}>
        {items.map((item, index) => {
          const active = item.key === activeKey;
          const playing = item.key === playingKey;
          const dropTarget = overKey === item.key && draggedKey && draggedKey !== item.key;
          const pending = !!item.uploadStatus && item.uploadStatus !== "ready";
          const failed = item.uploadStatus === "failed";
          const progress = Math.max(0, Math.min(100, Math.round(item.uploadProgress ?? 0)));

          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              aria-current={active ? "true" : undefined}
              onClick={() => { if (!pending) onSelect?.(item.key); }}
              onDoubleClick={() => { if (!pending) onPlay?.(item.key); }}
              onKeyDown={(event) => {
                if (pending) return;
                if (event.key === "Enter") {
                  event.preventDefault();
                  onPlay?.(item.key);
                } else if (event.key === " ") {
                  event.preventDefault();
                  onSelect?.(item.key);
                }
              }}
              onDragOver={(event) => {
                if (!editable || pending || !draggedKey || draggedKey === item.key) return;
                event.preventDefault();
                event.stopPropagation();
                setOverKey(item.key);
              }}
              onDrop={(event) => {
                if (!editable || pending || !draggedKey || draggedKey === item.key) return;
                event.preventDefault();
                event.stopPropagation();
                onReorder?.(draggedKey, item.key);
                setDraggedKey(null);
                setOverKey(null);
              }}
              style={{
                display: "grid",
                gridTemplateColumns: editable ? "32px 54px minmax(0,1fr) 118px 78px 38px" : "54px minmax(0,1fr) 118px 78px",
                gap: 12,
                alignItems: "center",
                minHeight: 72,
                padding: editable ? "8px 14px 8px 8px" : "8px 14px",
                borderBottom: index === items.length - 1 ? 0 : `1px solid ${c.borderSubtle}`,
                borderTop: dropTarget ? `2px solid ${SIGNAL}` : "2px solid transparent",
                background: active ? c.signalBg : "transparent",
                cursor: pending ? "default" : "pointer",
                opacity: failed ? 0.82 : 1,
                position: "relative",
                transition: "background 100ms ease, border-color 100ms ease",
                outline: "none",
              }}
            >
              {editable && (
                <button
                  type="button"
                  draggable={!pending}
                  aria-label={`Reorder ${item.title}`}
                  title="Drag to reorder"
                  onPointerDown={(event) => event.stopPropagation()}
                  onDragStart={(event) => {
                    event.stopPropagation();
                    setDraggedKey(item.key);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", item.key);
                  }}
                  onDragEnd={() => {
                    setDraggedKey(null);
                    setOverKey(null);
                  }}
                  style={{ width: 28, height: 40, border: 0, borderRadius: 6, background: "transparent", color: c.textTertiary, display: "flex", alignItems: "center", justifyContent: "center", cursor: pending ? "default" : "grab", opacity: pending ? 0.35 : 1, padding: 0 }}
                >
                  <Icon name="grip" />
                </button>
              )}

              <div style={{ width: 54, height: 54, borderRadius: R.sm, overflow: "hidden", background: c.bgSubtle, display: "flex", alignItems: "center", justifyContent: "center", color: active ? SIGNAL : c.textTertiary, position: "relative", flex: "0 0 auto" }}>
                {item.artwork ? <img src={item.artwork} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: pending ? 0.58 : 1, filter: pending ? "blur(1px)" : "none" }} /> : <Icon name="play" size={20} />}
                {pending && <div style={{ position: "absolute", inset: 0, background: mode === "light" ? "rgba(255,255,255,.28)" : "rgba(0,0,0,.24)" }} />}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.35)", color: "#fff", opacity: playing ? 1 : 0 }}><Icon name="play" size={20} /></div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT.body, fontSize: 14, fontWeight: active ? 680 : 600, lineHeight: 1.3, color: active ? c.signalText : c.textPrimary, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</span>
                  {playing && <span style={{ width: 7, height: 7, borderRadius: 99, background: SIGNAL, flex: "0 0 auto" }} />}
                </div>
                <div style={{ marginTop: 4, display: "flex", gap: 7, alignItems: "center", fontFamily: FONT.body, fontSize: 12, color: c.textTertiary, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {item.sourceLabel && <span>{item.sourceLabel}</span>}
                  {item.sourceLabel && item.subtitle && <span style={{ opacity: 0.5 }}>•</span>}
                  {item.subtitle && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</span>}
                </div>
                {item.uploadStatus && item.uploadStatus !== "ready" && (
                  <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ height: 4, flex: 1, maxWidth: 250, borderRadius: 99, overflow: "hidden", background: c.borderSubtle }}><div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, background: failed ? c.errorText : SIGNAL, transition: "width 120ms linear" }} /></div>
                    <span style={{ fontFamily: FONT.mono, fontSize: 10, color: failed ? c.errorText : c.textTertiary, whiteSpace: "nowrap" }}>{failed ? item.uploadError || "Failed" : item.uploadStatusLabel || (item.uploadStatus === "processing" ? "Processing…" : item.uploadStatus === "queued" ? "Queued" : `Uploading ${progress}%`)}</span>
                    {failed && onRetry && <button type="button" onClick={(event) => { event.stopPropagation(); onRetry(item.key); }} style={{ height: 24, padding: "0 7px", border: `1px solid ${c.borderDefault}`, borderRadius: 5, background: c.bgElevated, color: c.textSecondary, fontFamily: FONT.body, fontSize: 10, cursor: "pointer" }}>Retry</button>}
                  </div>
                )}
              </div>

              <div style={{ fontFamily: FONT.body, fontSize: 12, color: c.textTertiary, whiteSpace: "nowrap" }}>{formatDate(item.dateAdded)}</div>
              <div style={{ textAlign: "right", fontFamily: FONT.mono, fontSize: 11, color: c.textTertiary, fontVariantNumeric: "tabular-nums" }}>{formatDuration(item.durationSeconds, item.durationLabel)}</div>

              {editable && (!pending || failed) && (
                <button
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  title="Remove"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (window.confirm(`Remove ${item.title} from this playlist?`)) onRemove?.(item.key);
                  }}
                  style={{ width: 34, height: 34, border: 0, borderRadius: 6, background: "transparent", color: c.textTertiary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
                >
                  <Icon name="remove" size={17} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        [data-ramzy-playlist="true"] [role="button"]:hover { background: ${mode === "light" ? "rgba(29,29,27,.035)" : "rgba(255,255,255,.035)"}; }
        [data-ramzy-playlist="true"] [role="button"]:focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: -2px; }
        [data-ramzy-playlist="true"] button:hover { background: ${mode === "light" ? "rgba(29,29,27,.06)" : "rgba(255,255,255,.06)"} !important; }
      `}</style>
    </div>
  );
}
