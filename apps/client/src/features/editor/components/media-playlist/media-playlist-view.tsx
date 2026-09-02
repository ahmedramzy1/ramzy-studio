import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { BlockDragHandle } from "@/features/editor/components/common/block-drag-handle";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaPlaylistItem } from "@docmost/editor-ext";
import { getFileUrl } from "@/lib/config.ts";
import RamzyAudioPlayer from "@/features/editor/components/audio/ramzy-audio-player.tsx";
import RamzyVideoPlayer from "@/features/editor/components/video/ramzy-video-player.tsx";
import RamzyPlaylist from "./ramzy-playlist";
import {
  createMediaKey,
  ingestMediaBatch,
} from "@/features/editor/components/media/media-ingest.ts";
import { generateVideoCaptions } from "@/features/editor/components/media/media-ingest.ts";
import { uploadFile } from "@/features/page/services/page-service.ts";
import {
  filterMediaFiles,
  mediaAccept,
} from "@/features/editor/components/media/media-authoring-actions.ts";
import {
  movePlaylistItem,
  removePlaylistItem,
  reorderPlaylistItems,
  stepPlaylistKey,
} from "./playlist-state";

const BODY = '"DM Sans", system-ui, sans-serif';

export default function MediaPlaylistView({
  editor,
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const editable = editor.isEditable;
  const kind = node.attrs.kind === "video" ? "video" : "audio";
  const items = useMemo<MediaPlaylistItem[]>(
    () => (Array.isArray(node.attrs.items) ? node.attrs.items : []),
    [node.attrs.items],
  );

  const [localActiveKey, setLocalActiveKey] = useState(
    node.attrs.activeKey || items[0]?.key || "",
  );
  const [playKey, setPlayKey] = useState("");
  const [playNonce, setPlayNonce] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [removeCandidateKey, setRemoveCandidateKey] = useState<string | null>(
    null,
  );
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [captionsGenerating, setCaptionsGenerating] = useState(false);
  const [artworkCandidateKey, setArtworkCandidateKey] = useState<string | null>(
    null,
  );
  const [replaceCandidateKey, setReplaceCandidateKey] = useState<string | null>(
    null,
  );
  const [detailsCandidateKey, setDetailsCandidateKey] = useState<string | null>(
    null,
  );
  const [captionsCandidateKey, setCaptionsCandidateKey] = useState<
    string | null
  >(null);
  const [details, setDetails] = useState({
    title: "",
    subtitle: "",
    artist: "",
    album: "",
    description: "",
  });

  useEffect(() => {
    if (items.some((item) => item.key === localActiveKey)) return;
    const next = node.attrs.activeKey || items[0]?.key || "";
    setLocalActiveKey(next);
    if (playKey && !items.some((item) => item.key === playKey)) setPlayKey("");
  }, [items, node.attrs.activeKey, localActiveKey, playKey]);

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.key === localActiveKey),
  );
  const active = items[activeIndex] || items[0] || null;

  const select = (key: string) => {
    setLocalActiveKey(key);
    if (editable) updateAttributes({ activeKey: key });
  };

  const play = (key: string) => {
    if (!items.some((item) => item.key === key)) return;
    setLocalActiveKey(key);
    setPlayKey(key);
    setPlayNonce((value) => value + 1);
    if (editable) updateAttributes({ activeKey: key });
  };

  const playPrevious = () => {
    const key = stepPlaylistKey(
      items,
      active?.key || localActiveKey,
      -1,
      !!node.attrs.loop,
    );
    if (key) play(key);
  };

  const playNext = (force = false) => {
    if (!force && !node.attrs.autoplay) return;
    if (node.attrs.shuffle && items.length > 1) {
      const alternatives = items.filter((item) => item.key !== active?.key);
      const candidate =
        alternatives[Math.floor(Math.random() * alternatives.length)];
      if (candidate) play(candidate.key);
      return;
    }
    const key = stepPlaylistKey(
      items,
      active?.key || localActiveKey,
      1,
      !!node.attrs.loop,
    );
    if (key) play(key);
  };

  const setItems = (next: MediaPlaylistItem[], nextActive?: string) => {
    const activeKey = nextActive ?? localActiveKey ?? next[0]?.key ?? "";
    updateAttributes({ items: next, activeKey });
    setLocalActiveKey(activeKey);
    if (playKey && !next.some((item) => item.key === playKey)) setPlayKey("");
  };

  const move = (key: string, direction: -1 | 1) => {
    setItems(movePlaylistItem(items, key, direction));
  };

  const reorder = (sourceKey: string, targetKey: string) => {
    setItems(reorderPlaylistItems(items, sourceKey, targetKey));
  };

  const remove = (key: string) => {
    const result = removePlaylistItem(items, key, localActiveKey);
    setItems(result.items, result.nextActiveKey);
    setRemoveCandidateKey(null);
  };

  const replaceItemArtwork = async (key: string, file?: File) => {
    if (!file?.type.startsWith("image/") || thumbnailUploading) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    setThumbnailUploading(true);
    try {
      const attachment = await uploadFile(file, pageId);
      setItems(
        items.map((item) =>
          item.key === key
            ? kind === "video"
              ? {
                  ...item,
                  poster: `/api/files/${attachment.id}/${attachment.fileName}`,
                  posterAttachmentId: attachment.id,
                }
              : {
                  ...item,
                  artwork: `/api/files/${attachment.id}/${attachment.fileName}`,
                  artworkAttachmentId: attachment.id,
                  artworkSource: "custom" as const,
                }
            : item,
        ),
      );
    } finally {
      setThumbnailUploading(false);
      setArtworkCandidateKey(null);
    }
  };

  const generateItemCaptions = async (key: string) => {
    const candidate = items.find((item) => item.key === key);
    if (!candidate?.attachmentId || captionsGenerating) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId) return;
    const language = window.prompt(
      "Caption language (leave blank to detect automatically)",
      "",
    );
    if (language === null) return;
    setCaptionsGenerating(true);
    try {
      const track = await generateVideoCaptions(
        candidate.attachmentId,
        pageId,
        language,
      );
      setItems(
        items.map((item) =>
          item.key === key
            ? { ...item, captions: [...(item.captions || []), track] }
            : item,
        ),
      );
    } finally {
      setCaptionsGenerating(false);
    }
  };

  const replaceItemMedia = async (key: string, file?: File) => {
    if (!file || uploading) return;
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId || !filterMediaFiles([file], kind).length) return;
    const current = items.find((item) => item.key === key);
    if (!current) return;
    setUploading(true);
    try {
      const result = await ingestMediaBatch([file], kind, pageId);
      const replacement = result.successful[0];
      if (!replacement) return;
      setItems(
        items.map((item) =>
          item.key === key
            ? {
                ...replacement,
                key,
                title: current.title || replacement.title,
                subtitle: current.subtitle || replacement.subtitle,
                description: current.description || replacement.description,
              }
            : item,
        ),
        key,
      );
    } finally {
      setUploading(false);
      setReplaceCandidateKey(null);
    }
  };

  const openDetails = (key: string) => {
    const item = items.find((candidate) => candidate.key === key);
    if (!item) return;
    setDetails({
      title: item.title || "",
      subtitle: item.subtitle || "",
      artist: item.artist || "",
      album: item.album || "",
      description: item.description || "",
    });
    setDetailsCandidateKey(key);
  };

  const saveDetails = () => {
    if (!detailsCandidateKey) return;
    setItems(
      items.map((item) =>
        item.key === detailsCandidateKey ? { ...item, ...details } : item,
      ),
    );
    setDetailsCandidateKey(null);
  };

  const duplicateItem = (key: string) => {
    const index = items.findIndex((item) => item.key === key);
    if (index < 0) return;
    const duplicate = {
      ...items[index],
      key: createMediaKey(kind),
      title: `${items[index].title} copy`,
      dateAdded: new Date().toISOString(),
    };
    const next = [...items];
    next.splice(index + 1, 0, duplicate);
    setItems(next, duplicate.key);
  };

  const moveItemToEdge = (key: string, edge: "start" | "end") => {
    const index = items.findIndex((item) => item.key === key);
    if (index < 0) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(edge === "start" ? 0 : next.length, 0, item);
    setItems(next, key);
  };

  const downloadItem = (key: string) => {
    const item = items.find((candidate) => candidate.key === key);
    if (!item?.src) return;
    const anchor = document.createElement("a");
    anchor.href = getFileUrl(item.src);
    anchor.download = item.title || kind;
    anchor.rel = "noopener";
    anchor.click();
  };

  const uploadFiles = async (files: FileList | File[]) => {
    // @ts-ignore portfolio editor storage owns the canonical linked page id.
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId || uploading) return;

    const accepted = filterMediaFiles(Array.from(files), kind);
    if (!accepted.length) return;

    setUploading(true);
    try {
      const result = await ingestMediaBatch(accepted, kind, pageId);
      if (!result.successful.length) return;
      const next = [...items, ...result.successful];
      setItems(next, result.successful[0]?.key || next[0]?.key || "");
    } finally {
      setUploading(false);
      setDropActive(false);
    }
  };

  const queueItems = items.map((item) => ({
    key: item.key,
    title: item.title || (kind === "video" ? "Video" : "Audio"),
    subtitle:
      item.subtitle ||
      (kind === "audio" ? item.artist || item.album : undefined),
    artwork:
      item.artwork || item.poster
        ? getFileUrl(item.artwork || item.poster || "")
        : undefined,
    durationSeconds: item.durationSeconds,
    dateAdded: item.dateAdded,
    sourceLabel: kind === "video" ? "Uploaded video" : "Uploaded audio",
  }));

  const activeArtwork = active?.artwork
    ? getFileUrl(active.artwork)
    : undefined;
  const activePoster = active?.poster ? getFileUrl(active.poster) : undefined;
  const isPlayingRequest = !!active && playKey === active.key;
  const hasPrevious =
    activeIndex > 0 || (!!node.attrs.loop && items.length > 1);
  const hasNext =
    activeIndex < items.length - 1 || (!!node.attrs.loop && items.length > 1);

  return (
    <NodeViewWrapper
      data-ramzy-playlist-kind={kind}
      className={selected ? "ProseMirror-selectednode" : undefined}
      style={{ position: "relative" }}
      onDragEnter={(event) => {
        if (!editable || !event.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        setDropActive(true);
      }}
      onDragOver={(event) => {
        if (!editable || !event.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setDropActive(true);
      }}
      onDragLeave={(event) => {
        if (!editable) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setDropActive(false);
        }
      }}
      onDrop={(event) => {
        if (!editable || !event.dataTransfer?.files.length) return;
        event.preventDefault();
        event.stopPropagation();
        void uploadFiles(event.dataTransfer.files);
      }}
    >
      {editable && <BlockDragHandle label={`Drag ${kind} playlist block`} />}
      <Stack
        gap="sm"
        py="xs"
        style={{
          outline: dropActive ? "2px solid #3B5BFF" : undefined,
          outlineOffset: dropActive ? 6 : undefined,
          borderRadius: dropActive ? 8 : undefined,
        }}
      >
        {(editable || node.attrs.title) && (
          <TextInput
            value={node.attrs.title || ""}
            onChange={(event) =>
              updateAttributes({ title: event.currentTarget.value })
            }
            readOnly={!editable}
            placeholder={
              kind === "video"
                ? "Video playlist title…"
                : "Audio playlist title…"
            }
            variant={editable ? "default" : "unstyled"}
            styles={{
              input: { fontFamily: BODY, fontSize: 16, fontWeight: 650 },
            }}
          />
        )}

        {active ? (
          kind === "video" ? (
            <RamzyVideoPlayer
              key={active.key}
              src={getFileUrl(active.src)}
              poster={activePoster}
              captions={(active.captions || []).map((track) => ({
                ...track,
                src: getFileUrl(track.src),
              }))}
              title={active.title || "Video"}
              autoPlay={isPlayingRequest}
              playRequestToken={playNonce}
              loop={false}
              onEnded={() => playNext(false)}
              onPrevious={playPrevious}
              onNext={() => playNext(true)}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              playlistTitle={node.attrs.title || "Video playlist"}
              playlistTrackCount={items.length}
              playlistIndex={activeIndex}
            />
          ) : (
            <RamzyAudioPlayer
              key={active.key}
              src={getFileUrl(active.src)}
              title={active.title || "Audio"}
              artist={active.artist}
              description={active.description || active.album}
              artwork={activeArtwork}
              autoPlay={isPlayingRequest}
              playRequestToken={playNonce}
              loop={false}
              onEnded={() => playNext(false)}
              onPrevious={playPrevious}
              onNext={() => playNext(true)}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              playlistTitle={node.attrs.title || "Audio playlist"}
              playlistTrackCount={items.length}
              playlistIndex={activeIndex}
            />
          )
        ) : (
          <div
            style={{
              minHeight: kind === "video" ? 320 : 180,
              aspectRatio: kind === "video" ? "16 / 9" : undefined,
              border: "1px dashed var(--mantine-color-default-border)",
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "var(--mantine-color-default-hover)",
            }}
          >
            <Text size="sm" c="dimmed" ff={BODY}>
              {dropActive
                ? kind === "video"
                  ? "Drop videos to add them"
                  : "Drop audio files to add them"
                : kind === "video"
                  ? "Add or drop your first video"
                  : "Add or drop your first track"}
            </Text>
          </div>
        )}

        {node.attrs.showQueue !== false && (
          <RamzyPlaylist
            items={queueItems}
            activeKey={active?.key}
            playingKey={playKey}
            editable={editable}
            kind={kind}
            layout={
              node.attrs.queueLayout === "compact" ? "compact" : "detailed"
            }
            onSelect={select}
            onPlay={play}
            onMove={move}
            onReorder={reorder}
            onRemove={setRemoveCandidateKey}
            onEditDetails={openDetails}
            onReplaceMedia={(key) => {
              setReplaceCandidateKey(key);
              replaceInputRef.current?.click();
            }}
            onChangeArtwork={(key) => {
              setArtworkCandidateKey(key);
              artworkInputRef.current?.click();
            }}
            onGenerateCaptions={(key) => void generateItemCaptions(key)}
            onManageCaptions={setCaptionsCandidateKey}
            onDownload={downloadItem}
            onDuplicate={duplicateItem}
            onMoveToStart={(key) => moveItemToEdge(key, "start")}
            onMoveToEnd={(key) => moveItemToEdge(key, "end")}
            maxHeight={kind === "video" ? 390 : 420}
          />
        )}

        {editable && (
          <>
            <button
              type="button"
              hidden
              data-ramzy-element-action="add-media"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            />
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={mediaAccept(kind)}
          multiple
          style={{ display: "none" }}
          onChange={(event) => {
            if (event.target.files?.length)
              void uploadFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />

        <input
          ref={artworkInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(event) => {
            if (artworkCandidateKey) {
              void replaceItemArtwork(
                artworkCandidateKey,
                event.currentTarget.files?.[0],
              );
            }
            event.currentTarget.value = "";
          }}
        />

        <input
          ref={replaceInputRef}
          type="file"
          accept={mediaAccept(kind)}
          style={{ display: "none" }}
          onChange={(event) => {
            if (replaceCandidateKey) {
              void replaceItemMedia(
                replaceCandidateKey,
                event.currentTarget.files?.[0],
              );
            }
            event.currentTarget.value = "";
          }}
        />

        <Modal
          opened={!!detailsCandidateKey}
          onClose={() => setDetailsCandidateKey(null)}
          title={kind === "video" ? "Edit video details" : "Edit track details"}
          centered
          size="md"
        >
          <Stack gap="sm">
            <TextInput
              label="Title"
              value={details.title}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  title: event.currentTarget.value,
                }))
              }
            />
            {kind === "audio" && (
              <>
                <TextInput
                  label="Artist"
                  value={details.artist}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      artist: event.currentTarget.value,
                    }))
                  }
                />
                <TextInput
                  label="Album"
                  value={details.album}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      album: event.currentTarget.value,
                    }))
                  }
                />
              </>
            )}
            <TextInput
              label="Subtitle"
              value={details.subtitle}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  subtitle: event.currentTarget.value,
                }))
              }
            />
            <Textarea
              label="Description"
              minRows={3}
              value={details.description}
              onChange={(event) =>
                setDetails((current) => ({
                  ...current,
                  description: event.currentTarget.value,
                }))
              }
            />
            <Group justify="flex-end" gap="xs">
              <Button
                variant="default"
                onClick={() => setDetailsCandidateKey(null)}
              >
                Cancel
              </Button>
              <Button onClick={saveDetails}>Save details</Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={!!captionsCandidateKey}
          onClose={() => setCaptionsCandidateKey(null)}
          title="Manage captions"
          centered
          size="md"
        >
          <Stack gap="sm">
            {(
              items.find((item) => item.key === captionsCandidateKey)
                ?.captions || []
            ).map((track) => (
              <Group key={track.key} justify="space-between" wrap="nowrap">
                <div>
                  <Text size="sm" fw={600}>
                    {track.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {track.language}
                  </Text>
                </div>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    if (!captionsCandidateKey) return;
                    setItems(
                      items.map((item) =>
                        item.key === captionsCandidateKey
                          ? {
                              ...item,
                              captions: (item.captions || []).filter(
                                (candidate) => candidate.key !== track.key,
                              ),
                            }
                          : item,
                      ),
                    );
                  }}
                >
                  Remove
                </Button>
              </Group>
            ))}
            {!items.find((item) => item.key === captionsCandidateKey)?.captions
              ?.length && (
              <Text size="sm" c="dimmed">
                No caption tracks yet.
              </Text>
            )}
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={() => setCaptionsCandidateKey(null)}
              >
                Done
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={!!removeCandidateKey}
          onClose={() => setRemoveCandidateKey(null)}
          title="Remove playlist item?"
          centered
          size="sm"
        >
          <Stack gap="md">
            <Text size="sm" ff={BODY}>
              Remove{" "}
              {items.find((item) => item.key === removeCandidateKey)?.title ||
                "this item"}{" "}
              from this playlist? The uploaded media stays in your library.
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button
                variant="default"
                onClick={() => setRemoveCandidateKey(null)}
              >
                Cancel
              </Button>
              <Button
                color="red"
                onClick={() => removeCandidateKey && remove(removeCandidateKey)}
              >
                Remove
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </NodeViewWrapper>
  );
}
