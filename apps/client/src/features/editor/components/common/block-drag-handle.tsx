import React from "react";

/**
 * Persistent, dedicated drag affordance for large portfolio blocks.
 * The hit area stays visible and the data attribute makes this the only
 * surface that initiates a ProseMirror node drag.
 */
export function BlockDragHandle({ label = "Drag block" }: { label?: string }) {
  return (
    <div
      data-drag-handle
      contentEditable={false}
      role="button"
      tabIndex={-1}
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.stopPropagation()}
      style={{
        position: "absolute",
        left: -42,
        top: 10,
        zIndex: 8,
        width: 34,
        height: 48,
        display: "grid",
        placeItems: "center",
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: 8,
        background: "var(--mantine-color-body)",
        color: "var(--mantine-color-dimmed)",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <svg width="14" height="22" viewBox="0 0 14 22" fill="currentColor" aria-hidden="true">
        <circle cx="4" cy="5" r="1.5" />
        <circle cx="10" cy="5" r="1.5" />
        <circle cx="4" cy="11" r="1.5" />
        <circle cx="10" cy="11" r="1.5" />
        <circle cx="4" cy="17" r="1.5" />
        <circle cx="10" cy="17" r="1.5" />
      </svg>
    </div>
  );
}
