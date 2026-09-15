import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  CollectionFrame,
  CollectionTitle,
  CollectionEmpty,
  CollectionFeedback,
} from "../collection/collection-shell";
import collection from "../collection/collection-shell.module.css";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { PortfolioPhotoAlbum, PortfolioPhotoGrid } from "@docmost/editor-ext";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadFile } from "@/features/page/services/page-service.ts";
import { getFileUrl } from "@/lib/config.ts";
import { BlockDragHandle } from "@/features/editor/components/common/block-drag-handle";

interface PhotoItem {
  key: string;
  src: string;
  attachmentId?: string;
  title?: string;
  alt?: string;
  caption?: string;
}

function createKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `photo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function attachmentSrc(attachment: { id: string; fileName: string }) {
  return `/api/files/${attachment.id}/${attachment.fileName}`;
}

function autoRows<T>(items: T[]): T[][] {
  if (items.length <= 3) return [items];
  const rows: T[][] = [];
  let cursor = 0;
  while (items.length - cursor > 4) {
    rows.push(items.slice(cursor, cursor + 3));
    cursor += 3;
  }
  const remaining = items.length - cursor;
  if (remaining === 4) {
    rows.push(items.slice(cursor, cursor + 2), items.slice(cursor + 2));
  } else {
    rows.push(items.slice(cursor));
  }
  return rows;
}

function PhotoViewer({
  image,
  onClose,
}: {
  image: PhotoItem;
  onClose: () => void;
}) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || image.title || "Photo viewer"}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        display: "grid",
        placeItems: "center",
        padding: 28,
        background: "rgba(0,0,0,.88)",
      }}
    >
      <img
        src={getFileUrl(image.src)}
        alt={image.alt || ""}
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "calc(100vh - 56px)",
          objectFit: "contain",
          borderRadius: "var(--ramzy-radius-bordered, 8px)",
        }}
      />
      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 18,
          right: 18,
          width: 42,
          height: 42,
          border: "1px solid rgba(255,255,255,.35)",
          borderRadius: 999,
          background: "rgba(0,0,0,.55)",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>,
    document.body,
  );
}

export function PhotoCollectionView({
  editor,
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const editable = editor.isEditable;
  const kind = node.type.name === "photoAlbum" ? "album" : "grid";
  const images = (node.attrs.images || []) as PhotoItem[];
  const inputRef = useRef<HTMLInputElement>(null);
  const draggedKey = useRef<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState({
    description: "",
    location: "",
    date: "",
    credit: "",
  });
  function openDetails() {
    setDetails({
      description: node.attrs.description || "",
      location: node.attrs.location || "",
      date: node.attrs.date || "",
      credit: node.attrs.credit || "",
    });
    setDetailsOpen(true);
  }
  const [viewer, setViewer] = useState<PhotoItem | null>(null);
  const active =
    images.find((image) => image.key === node.attrs.activeKey) || images[0];
  const rows = useMemo(() => autoRows(images), [images]);
  const gap = Number(node.attrs.gap ?? 10);
  const aspectRatio =
    node.attrs.aspect === "square"
      ? "1 / 1"
      : node.attrs.aspect === "landscape"
        ? "4 / 3"
        : node.attrs.aspect === "portrait"
          ? "3 / 4"
          : undefined;

  useEffect(() => {
    if (
      kind !== "album" ||
      !node.attrs.autoplay ||
      images.length < 2 ||
      editable
    )
      return;
    const delay = Math.max(2, Number(node.attrs.interval || 5)) * 1000;
    const timer = window.setInterval(() => {
      const currentIndex = Math.max(
        0,
        images.findIndex((image) => image.key === active?.key),
      );
      updateAttributes({
        activeKey: images[(currentIndex + 1) % images.length].key,
      });
    }, delay);
    return () => window.clearInterval(timer);
  }, [
    active?.key,
    editable,
    images,
    kind,
    node.attrs.autoplay,
    node.attrs.interval,
    updateAttributes,
  ]);

  function setImages(next: PhotoItem[]) {
    const activeKey = next.some((image) => image.key === node.attrs.activeKey)
      ? node.attrs.activeKey
      : next[0]?.key || null;
    updateAttributes({ images: next, activeKey });
  }

  async function addFiles(files: File[]) {
    const accepted = files.filter((file) => file.type.startsWith("image/"));
    if (!accepted.length) return;
    // Portfolio runtime storage owns the linked Studio page id.
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) {
      setUploadError("The upload session is not ready. Try again shortly.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        accepted.map(async (file): Promise<PhotoItem> => {
          const attachment = await uploadFile(file, pageId);
          return {
            key: createKey(),
            src: attachmentSrc(attachment),
            attachmentId: attachment.id,
            title: file.name.replace(/\.[^.]+$/, ""),
            alt: file.name.replace(/\.[^.]+$/, ""),
          };
        }),
      );
      setImages([...images, ...uploaded]);
    } catch {
      setUploadError(
        "Photos could not be uploaded. Use Add photos to try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  function reorder(targetKey: string) {
    const sourceKey = draggedKey.current;
    draggedKey.current = null;
    if (!sourceKey || sourceKey === targetKey) return;
    const from = images.findIndex((image) => image.key === sourceKey);
    const to = images.findIndex((image) => image.key === targetKey);
    if (from < 0 || to < 0) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setImages(next);
  }

  const photoTile = (image: PhotoItem, index: number, compact = false) => (
    <div
      key={image.key}
      onDragOver={(event) => {
        if (editable) event.preventDefault();
      }}
      onDrop={() => reorder(image.key)}
      style={{ position: "relative", minWidth: 0 }}
    >
      <button
        type="button"
        onClick={() =>
          kind === "album"
            ? updateAttributes({ activeKey: image.key })
            : node.attrs.lightbox !== false && setViewer(image)
        }
        style={{
          width: "100%",
          height: "100%",
          minHeight: compact ? 76 : 160,
          padding: 0,
          border:
            active?.key === image.key && kind === "album"
              ? "2px solid var(--mantine-primary-color-filled)"
              : "1px solid var(--mantine-color-default-border)",
          borderRadius: "var(--ramzy-radius-bordered, 8px)",
          overflow: "hidden",
          background: "var(--mantine-color-default-hover)",
          cursor: "pointer",
          aspectRatio,
        }}
      >
        <img
          src={getFileUrl(image.src)}
          alt={image.alt || ""}
          style={{
            width: "100%",
            height: "100%",
            minHeight: compact ? 76 : 160,
            maxHeight: compact ? 96 : 420,
            display: "block",
            objectFit: node.attrs.fit === "contain" ? "contain" : "cover",
          }}
        />
      </button>
      {editable && (
        <>
          <div
            draggable
            onDragStart={() => {
              draggedKey.current = image.key;
            }}
            title="Reorder photo"
            aria-label="Reorder photo"
            style={{
              position: "absolute",
              top: 7,
              left: 7,
              width: 28,
              height: 28,
              display: "grid",
              placeItems: "center",
              borderRadius: 7,
              background: "rgba(15,15,15,.68)",
              color: "white",
              cursor: "grab",
              fontSize: 13,
            }}
          >
            ⠿
          </div>
          <button
            type="button"
            aria-label={`Remove photo ${index + 1}`}
            onClick={() =>
              setImages(images.filter((item) => item.key !== image.key))
            }
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 28,
              height: 28,
              border: 0,
              borderRadius: 999,
              background: "rgba(15,15,15,.68)",
              color: "white",
              cursor: "pointer",
              fontSize: 17,
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );

  return (
    <NodeViewWrapper
      className={selected ? "ProseMirror-selectednode" : undefined}
      style={{ position: "relative" }}
      onDragOver={(event) => {
        if (editable && event.dataTransfer?.types.includes("Files")) {
          event.preventDefault();
        }
      }}
      onDrop={(event) => {
        if (!editable || !event.dataTransfer?.files.length) return;
        event.preventDefault();
        event.stopPropagation();
        void addFiles(Array.from(event.dataTransfer.files));
      }}
    >
      {editable && <BlockDragHandle label={`Drag photo ${kind} block`} />}
      <CollectionFrame>
        <CollectionTitle
          value={node.attrs.title || ""}
          editable={editable}
          label={kind === "album" ? "Photo album title" : "Image grid title"}
          onChange={(title) => updateAttributes({ title })}
        />
        <CollectionFeedback message={uploadError} />

        {kind === "grid" &&
          images.length > 0 &&
          (node.attrs.columns > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(Number(node.attrs.columns), images.length)}, minmax(0, 1fr))`,
                gap,
                padding: 16,
              }}
            >
              {images.map((image) => photoTile(image, images.indexOf(image)))}
            </div>
          ) : (
            <div style={{ display: "grid", gap, padding: 16 }}>
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                    gap,
                  }}
                >
                  {row.map((image) => photoTile(image, images.indexOf(image)))}
                </div>
              ))}
            </div>
          ))}

        {kind === "album" && active && (
          <div
            className={collection.album}
            data-side-rail={
              (images.length > 1 &&
                node.attrs.thumbnailPosition !== "bottom") ||
              undefined
            }
            style={{ gap }}
          >
            <button
              type="button"
              className={collection.stage}
              aria-label={active.alt || active.title || "Open album photo"}
              onClick={() => node.attrs.lightbox !== false && setViewer(active)}
              style={{
                cursor: node.attrs.lightbox === false ? "default" : "zoom-in",
              }}
            >
              <img
                src={getFileUrl(active.src)}
                alt={active.alt || ""}
                style={{
                  objectFit: node.attrs.fit === "cover" ? "cover" : "contain",
                }}
              />
            </button>
            {images.length > 1 && (
              <div className={collection.rail}>
                {images.map((image) =>
                  photoTile(image, images.indexOf(image), true),
                )}
              </div>
            )}
          </div>
        )}

        {editable && images.length === 0 && (
          <CollectionEmpty
            label="Add photos"
            helper="Choose photos or drop them here."
            uploading={uploading}
            onAdd={() => inputRef.current?.click()}
          />
        )}

        {editable && (
          <>
            {kind === "album" && (
              <button
                type="button"
                hidden
                data-ramzy-element-action="edit-album-details"
                onClick={openDetails}
              />
            )}
            <button
              type="button"
              hidden
              data-ramzy-element-action="add-photos"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                if (event.currentTarget.files)
                  void addFiles(Array.from(event.currentTarget.files));
                event.currentTarget.value = "";
              }}
            />
          </>
        )}

        {kind === "album" &&
          (node.attrs.description ||
            node.attrs.location ||
            node.attrs.date ||
            node.attrs.credit) && (
            <div className={collection.metadata}>
              {node.attrs.description && (
                <div className={collection.description}>
                  {node.attrs.description}
                </div>
              )}
              <div className={collection.credits}>
                {node.attrs.location && <span>{node.attrs.location}</span>}
                {node.attrs.date && <span>{node.attrs.date}</span>}
                {node.attrs.credit && <span>Photo: {node.attrs.credit}</span>}
              </div>
            </div>
          )}
      </CollectionFrame>
      {editable && (
        <Modal
          opened={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          title="Edit album details"
          centered
        >
          <Stack>
            <Textarea
              label="Description"
              autosize
              minRows={3}
              value={details.description}
              onChange={(event) =>
                setDetails({
                  ...details,
                  description: event.currentTarget.value,
                })
              }
            />
            <TextInput
              label="Location"
              value={details.location}
              onChange={(event) =>
                setDetails({ ...details, location: event.currentTarget.value })
              }
            />
            <TextInput
              label="Date"
              value={details.date}
              onChange={(event) =>
                setDetails({ ...details, date: event.currentTarget.value })
              }
            />
            <TextInput
              label="Photographer / credit"
              value={details.credit}
              onChange={(event) =>
                setDetails({ ...details, credit: event.currentTarget.value })
              }
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setDetailsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateAttributes(details);
                  setDetailsOpen(false);
                }}
              >
                Save details
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
      {viewer && <PhotoViewer image={viewer} onClose={() => setViewer(null)} />}
    </NodeViewWrapper>
  );
}

export const PhotoGrid = PortfolioPhotoGrid.extend({
  addNodeView() {
    return ReactNodeViewRenderer(PhotoCollectionView);
  },
});
export const PhotoAlbum = PortfolioPhotoAlbum.extend({
  addNodeView() {
    return ReactNodeViewRenderer(PhotoCollectionView);
  },
});
