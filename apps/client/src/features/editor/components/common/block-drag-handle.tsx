import React from "react";

/**
 * Persistent, dedicated drag affordance for large portfolio blocks.
 * The hit area stays visible and the data attribute makes this the only
 * surface that initiates a ProseMirror node drag.
 */
export function BlockDragHandle({ label = "Drag block" }: { label?: string }) {
  return (
    <div
      className="ramzy-block-drag-handle"
      data-drag-handle
      data-ramzy-block-drag-handle
      contentEditable={false}
      role="button"
      tabIndex={-1}
      aria-label={label}
      title={label}
    >
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="3" cy="3" r="1" />
        <circle cx="7" cy="3" r="1" />
        <circle cx="3" cy="8" r="1" />
        <circle cx="7" cy="8" r="1" />
        <circle cx="3" cy="13" r="1" />
        <circle cx="7" cy="13" r="1" />
      </svg>
    </div>
  );
}
