import React, { useState } from "react";

const SIGNAL = "#3B5BFF";
const BODY = '"DM Sans", system-ui, sans-serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const PLAYLIST_DRAG_TYPE = "application/x-ramzy-playlist-key";

export interface RamzyPlaylistItemView {
  key: string;
  title: string;
  subtitle?: string;
  artwork?: string;
}

export interface RamzyPlaylistProps {
  items: RamzyPlaylistItemView[];
  activeKey?: string;
  editable?: boolean;
  onSelect?: (key: string) => void;
  onMove?: (key: string, direction: -1 | 1) => void;
  onReorder?: (sourceKey: string, targetKey: string) => void;
  onRemove?: (key: string) => void;
  maxHeight?: number;
}

function PlayGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5L19 12L8 19V5Z" fill="currentColor" />
    </svg>
  );
}

export default function RamzyPlaylist({
  items,
  activeKey,
  editable = false,
  onSelect,
  onMove,
  onReorder,
  onRemove,
  maxHeight = 360,
}: RamzyPlaylistProps) {
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  if (!items.length) return null;

  return (
    <div
      style={{
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: 8,
        background: "var(--mantine-color-body)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxHeight, overflowY: "auto", overscrollBehavior: "contain" }}>
        {items.map((item, index) => {
          const active = item.key === activeKey;
          const dragOver = dragOverKey === item.key;
          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              aria-current={active ? "true" : undefined}
              draggable={editable && !!onReorder}
              onDragStart={(event) => {
                if (!editable || !onReorder) return;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(PLAYLIST_DRAG_TYPE, item.key);
              }}
              onDragOver={(event) => {
                if (!editable || !onReorder) return;
                if (!event.dataTransfer.types.includes(PLAYLIST_DRAG_TYPE)) return;
                event.preventDefault();
                event.stopPropagation();
                event.dataTransfer.dropEffect = "move";
                setDragOverKey(item.key);
              }}
              onDragLeave={() => {
                if (dragOverKey === item.key) setDragOverKey(null);
              }}
              onDrop={(event) => {
                if (!editable || !onReorder) return;
                const sourceKey = event.dataTransfer.getData(PLAYLIST_DRAG_TYPE);
                if (!sourceKey) return;
                event.preventDefault();
                event.stopPropagation();
                setDragOverKey(null);
                if (sourceKey !== item.key) onReorder(sourceKey, item.key);
              }}
              onDragEnd={() => setDragOverKey(null)}
              onClick={() => onSelect?.(item.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect?.(item.key);
                }
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "48px minmax(0,1fr) auto",
                gap: 12,
                alignItems: "center",
                padding: "11px 12px",
                borderBottom:
                  index === items.length - 1
                    ? 0
                    : "1px solid var(--mantine-color-default-border)",
                boxShadow: dragOver ? `inset 0 2px 0 ${SIGNAL}` : undefined,
                background: active ? "rgba(59,91,255,.08)" : "transparent",
                cursor: editable && onReorder ? "grab" : onSelect ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  overflow: "hidden",
                  background: "var(--mantine-color-default-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? SIGNAL : "var(--mantine-color-dimmed)",
                  position: "relative",
                }}
              >
                {item.artwork ? (
                  <img
                    src={item.artwork}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <PlayGlyph />
                )}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 4,
                      bottom: 4,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: SIGNAL,
                      boxShadow: "0 0 0 2px var(--mantine-color-body)",
                    }}
                  />
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: BODY,
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "var(--mantine-color-text)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
                {item.subtitle && (
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: BODY,
                      fontSize: 12,
                      lineHeight: 1.35,
                      color: "var(--mantine-color-dimmed)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.subtitle}
                  </div>
                )}
              </div>

              {editable && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onMove?.(item.key, -1);
                    }}
                    style={actionStyle(index === 0)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={index === items.length - 1}
                    onClick={(event) => {
                      event.stopPropagation();
                      onMove?.(item.key, 1);
                    }}
                    style={actionStyle(index === items.length - 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemove?.(item.key);
                    }}
                    style={{ ...actionStyle(false), fontFamily: MONO, fontSize: 9 }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function actionStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 28,
    height: 28,
    border: 0,
    borderRadius: 5,
    background: "transparent",
    color: disabled ? "var(--mantine-color-dimmed)" : "var(--mantine-color-text)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.35 : 0.8,
    padding: 0,
  };
}
