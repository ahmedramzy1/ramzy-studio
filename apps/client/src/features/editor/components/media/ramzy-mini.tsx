// ─── RAMZY MINI ──────────────────────────────────────────────────────────────
// Floating companion for the active Ramzy Wave session when its full player
// leaves the viewport. Ported from ahmedramzy.com v8.0.0.

import React, { useId, useMemo, useState } from "react";
import { dsTheme, FONT, SIGNAL, type DsMode } from "./v8-media-tokens";
import RamzyVolumeControl from "./ramzy-volume-control";

export interface RamzyMiniProps {
  title: string;
  artist?: string;
  artwork?: string;
  mode?: DsMode;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted?: boolean;
  peaks?: number[];
  hasPrevious?: boolean;
  hasNext?: boolean;
  playlistTitle?: string;
  playlistTrackCount?: number;
  playlistIndex?: number;
  floating?: boolean;
  onTogglePlayback: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek: (ratio: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  onReturn?: () => void;
  onClose?: () => void;
  style?: React.CSSProperties;
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function TransportIcon({ name, size = 20 }: { name: "play" | "pause" | "previous" | "next" | "close" | "return"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  if (name === "play") return <svg {...common}><path d="M8 5.2 19 12 8 18.8V5.2Z" fill="currentColor" /></svg>;
  if (name === "pause") return <svg {...common}><path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" fill="currentColor" /></svg>;
  if (name === "previous") return <svg {...common}><path d="M7 5v14M18 6.5 9.5 12 18 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "next") return <svg {...common}><path d="M17 5v14M6 6.5 14.5 12 6 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "return") return <svg {...common}><path d="M8 7H4v4M4.6 10.2A8 8 0 1 0 7 5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return <svg {...common}><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

export default function RamzyMini({
  title,
  artist,
  artwork,
  mode = "light",
  playing,
  currentTime,
  duration,
  volume,
  muted = false,
  peaks = [],
  hasPrevious = false,
  hasNext = false,
  playlistTitle,
  playlistTrackCount,
  playlistIndex,
  floating = true,
  onTogglePlayback,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onReturn,
  onClose,
  style,
}: RamzyMiniProps) {
  const c = dsTheme(mode);
  const clipId = useId().replace(/:/g, "");
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const progress = duration > 0 ? clamp(currentTime / duration) : 0;
  const bars = useMemo(() => {
    const source = peaks.length
      ? peaks.slice(0, 84)
      : Array.from({ length: 84 }, (_, index) => 0.22 + ((index * 31) % 9) / 15);
    return source.map((peak, index) => ({
      x: index * (840 / source.length),
      height: Math.max(7, Math.min(34, peak * 34)),
      width: Math.max(2.2, 840 / source.length - 2.6),
    }));
  }, [peaks]);

  const iconButton: React.CSSProperties = {
    width: 38,
    height: 38,
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: c.textPrimary,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    padding: 0,
    flex: "0 0 auto",
  };

  function pointerRatio(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.width ? clamp((event.clientX - rect.left) / rect.width) : 0;
  }

  return (
    <div
      data-ramzy-mini="true"
      role="region"
      aria-label={`Ramzy Mini — ${title}`}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      style={{
        position: floating ? "fixed" : "relative",
        right: floating ? 20 : undefined,
        bottom: floating ? 20 : undefined,
        zIndex: floating ? 2147482500 : undefined,
        width: floating ? "min(420px, calc(100vw - 32px))" : "100%",
        boxSizing: "border-box",
        padding: 12,
        border: `1px solid ${c.borderDefault}`,
        borderRadius: 14,
        background: mode === "light" ? "rgba(255,255,255,.96)" : "rgba(28,28,27,.96)",
        backdropFilter: "blur(20px)",
        boxShadow: floating ? "0 18px 55px rgba(0,0,0,.22)" : "none",
        color: c.textPrimary,
        ...style,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "58px minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
        <button type="button" aria-label="Return to full audio player" onClick={onReturn} style={{ width: 58, height: 58, padding: 0, border: 0, borderRadius: 9, overflow: "hidden", background: c.bgSubtle, cursor: onReturn ? "pointer" : "default", display: "grid", placeItems: "center", color: c.textTertiary }}>
          {artwork ? <img src={artwork} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18V6l9-2v12M9 10l9-2M6.5 20A2.5 2.5 0 1 0 6.5 15a2.5 2.5 0 0 0 0 5Zm9-2A2.5 2.5 0 1 0 15.5 13a2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </button>
        <button type="button" onClick={onReturn} style={{ minWidth: 0, textAlign: "left", padding: 0, border: 0, background: "transparent", cursor: onReturn ? "pointer" : "default" }}>
          <div style={{ fontFamily: FONT.body, fontSize: 14, fontWeight: 720, color: c.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          {artist && <div style={{ marginTop: 3, fontFamily: FONT.body, fontSize: 12, color: c.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{artist}</div>}
          {playlistTrackCount !== undefined && <div style={{ marginTop: 3, fontFamily: FONT.mono, fontSize: 10, color: c.textTertiary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{playlistTitle ? `${playlistTitle} · ` : "Playlist · "}{playlistIndex !== undefined ? `${playlistIndex + 1} / ${playlistTrackCount}` : `${playlistTrackCount} ${playlistTrackCount === 1 ? "track" : "tracks"}`}</div>}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {onReturn && <button type="button" aria-label="Return to full player" title="Return to full player" onClick={onReturn} style={iconButton}><TransportIcon name="return" size={18} /></button>}
          {onClose && <button type="button" aria-label="Close Ramzy Mini" title="Close" onClick={onClose} style={iconButton}><TransportIcon name="close" size={18} /></button>}
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div
          role="slider"
          aria-label="Audio progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onPointerEnter={(event) => setHoverRatio(pointerRatio(event))}
          onPointerMove={(event) => setHoverRatio(pointerRatio(event))}
          onPointerLeave={() => setHoverRatio(null)}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            onSeek(pointerRatio(event));
          }}
          onPointerUp={(event) => {
            onSeek(pointerRatio(event));
            try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
          }}
          style={{ height: 40, position: "relative", cursor: duration ? "pointer" : "default", touchAction: "none" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 840 40" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}>
            <defs><clipPath id={`${clipId}-mini-played`}><rect x="0" y="0" width={progress * 840} height="40" /></clipPath></defs>
            <g opacity=".65">{bars.map((bar, index) => <rect key={`b-${index}`} x={bar.x} y={20 - bar.height / 2} width={bar.width} height={bar.height} rx="1" fill={c.borderDefault} />)}</g>
            <g clipPath={`url(#${clipId}-mini-played)`}>{bars.map((bar, index) => <rect key={`p-${index}`} x={bar.x} y={20 - bar.height / 2} width={bar.width} height={bar.height} rx="1" fill={SIGNAL} />)}</g>
            <line x1={progress * 840} y1="3" x2={progress * 840} y2="37" stroke={c.textPrimary} strokeWidth="1.5" opacity=".72" />
            {hoverRatio !== null && <line x1={hoverRatio * 840} y1="5" x2={hoverRatio * 840} y2="35" stroke={c.textSecondary} strokeWidth="1" opacity=".48" />}
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 1, fontFamily: FONT.mono, fontSize: 10, color: c.textTertiary, fontVariantNumeric: "tabular-nums" }}><span>{formatTime(currentTime)}</span><span>−{formatTime(Math.max(0, duration - currentTime))}</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", alignItems: "center", gap: 8, marginTop: 6 }}>
        <RamzyVolumeControl value={volume} muted={muted} mode={mode} alwaysVisible sliderWidth={78} onChange={onVolumeChange} onToggleMute={onToggleMute} style={{ maxWidth: 126 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button type="button" aria-label="Previous track" disabled={!hasPrevious} onClick={() => hasPrevious && onPrevious?.()} style={{ ...iconButton, opacity: hasPrevious ? 1 : 0.28, cursor: hasPrevious ? "pointer" : "default" }}><TransportIcon name="previous" size={18} /></button>
          <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={onTogglePlayback} style={{ ...iconButton, width: 46, height: 46, background: SIGNAL, color: "#fff", boxShadow: "0 6px 18px rgba(59,91,255,.24)" }}><TransportIcon name={playing ? "pause" : "play"} size={22} /></button>
          <button type="button" aria-label="Next track" disabled={!hasNext} onClick={() => hasNext && onNext?.()} style={{ ...iconButton, opacity: hasNext ? 1 : 0.28, cursor: hasNext ? "pointer" : "default" }}><TransportIcon name="next" size={18} /></button>
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: c.textTertiary, textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>

      <style>{`
        [data-ramzy-mini="true"] button:hover:not(:disabled) { background: ${mode === "light" ? "rgba(29,29,27,.06)" : "rgba(255,255,255,.08)"}; }
        [data-ramzy-mini="true"] button:focus-visible,
        [data-ramzy-mini="true"] [role="slider"]:focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
