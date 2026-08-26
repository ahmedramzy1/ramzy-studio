// ─── RAMZY VOLUME CONTROL ────────────────────────────────────────────────────
// Canonical v8.0.0 shared volume control used by Ramzy Player and Ramzy Wave.

import React, { useState } from "react";
import { dsTheme, R, SIGNAL, type DsMode } from "./v8-media-tokens";

export interface RamzyVolumeControlProps {
  value: number;
  muted?: boolean;
  mode?: DsMode;
  tone?: "default" | "inverse";
  alwaysVisible?: boolean;
  sliderWidth?: number;
  onChange: (value: number) => void;
  onToggleMute: () => void;
  style?: React.CSSProperties;
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function VolumeIcon({
  value,
  muted,
  size = 24,
}: {
  value: number;
  muted: boolean;
  size?: number;
}) {
  const effective = muted ? 0 : value;
  const waves = effective <= 0 ? 0 : effective <= 0.34 ? 1 : effective <= 0.67 ? 2 : 3;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.25v5.5h4.15L13.2 19V5L8.15 9.25H4Z" fill="currentColor" />
      {waves === 0 ? (
        <path d="m16.1 9.3 4 5.4m0-5.4-4 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          {waves >= 1 && <path d="M15.7 9.25c1.25 1.35 1.25 4.15 0 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
          {waves >= 2 && <path d="M18.05 7.25c2.25 2.35 2.25 7.15 0 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
          {waves >= 3 && <path d="M20.3 5.25c3.2 3.25 3.2 10.25 0 13.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity=".82" />}
        </>
      )}
    </svg>
  );
}

export default function RamzyVolumeControl({
  value,
  muted = false,
  mode = "light",
  tone = "default",
  alwaysVisible = false,
  sliderWidth,
  onChange,
  onToggleMute,
  style,
}: RamzyVolumeControlProps) {
  const c = dsTheme(mode);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const visible = alwaysVisible || hovered || focused || dragging;
  const effective = muted ? 0 : clamp(value);
  const inverse = tone === "inverse";
  const fg = inverse ? "#FFFFFF" : c.textPrimary;
  const track = inverse ? "rgba(255,255,255,.28)" : c.borderDefault;
  const fill = inverse ? "#FFFFFF" : c.textPrimary;

  function setFromPointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    onChange(clamp((event.clientX - rect.left) / rect.width));
  }

  return (
    <div
      data-ramzy-volume-control="true"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        if (!dragging) setHovered(false);
      }}
      style={{ display: "inline-flex", alignItems: "center", minHeight: 44, color: fg, ...style }}
    >
      <button
        type="button"
        aria-label={muted || effective === 0 ? "Unmute" : "Mute"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMute();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: 44,
          height: 44,
          border: 0,
          borderRadius: R.full,
          background: "transparent",
          color: fg,
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          padding: 0,
          flex: "0 0 auto",
        }}
      >
        <VolumeIcon value={value} muted={muted} size={24} />
      </button>

      <div
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(effective * 100)}
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            onChange(clamp(effective + 0.05));
          } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            onChange(clamp(effective - 0.05));
          } else if (event.key === "Home") {
            event.preventDefault();
            onChange(0);
          } else if (event.key === "End") {
            event.preventDefault();
            onChange(1);
          }
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
          setFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!dragging) return;
          setFromPointer(event);
        }}
        onPointerUp={(event) => {
          setFromPointer(event);
          setDragging(false);
          try {
            event.currentTarget.releasePointerCapture(event.pointerId);
          } catch {}
        }}
        style={{
          width: visible ? (sliderWidth ?? (alwaysVisible ? 124 : 92)) : 0,
          height: 32,
          opacity: visible ? 1 : 0,
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          transition: "width 150ms ease, opacity 120ms ease",
          flex: "0 0 auto",
          outline: "none",
        }}
      >
        <div style={{ position: "absolute", left: 6, right: 6, top: 14, height: 4, borderRadius: 99, background: track }} />
        <div style={{ position: "absolute", left: 6, top: 14, width: `calc(${effective * 100}% - ${effective * 12}px)`, maxWidth: "calc(100% - 12px)", height: 4, borderRadius: 99, background: fill }} />
        <div style={{ position: "absolute", left: `${effective * 100}%`, transform: "translateX(-50%)", top: 10, width: 12, height: 12, borderRadius: 99, background: fill, boxShadow: inverse ? "0 1px 5px rgba(0,0,0,.35)" : "0 1px 4px rgba(29,29,27,.18)" }} />
      </div>

      <style>{`
        [data-ramzy-volume-control="true"] button:hover { background: ${inverse ? "rgba(255,255,255,.12)" : c.actionSecondary}; }
        [data-ramzy-volume-control="true"] [role="slider"]:focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: 2px; border-radius: ${R.sm}px; }
      `}</style>
    </div>
  );
}
