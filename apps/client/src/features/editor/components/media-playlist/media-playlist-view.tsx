import { Button, Group, Loader, Modal, Stack, Text, TextInput } from "@mantine/core";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { BlockDragHandle } from "@/features/editor/components/common/block-drag-handle";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaPlaylistItem } from "@docmost/editor-ext";
import { getFileUrl } from "@/lib/config.ts";
import RamzyAudioPlayer from "@/features/editor/components/audio/ramzy-audio-player.tsx";
import RamzyVideoPlayer from "@/features/editor/components/video/ramzy-video-player.tsx";
import RamzyPlaylist from "./ramzy-playlist";
import { ingestMediaBatch } from "@/features/editor/components/media/media-ingest.ts";
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
  const [removeCandidateKey, setRemoveCandidateKey] = useState<string | null>(null);

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
    const key = stepPlaylistKey(items, active?.key || localActiveKey, -1, !!node.attrs.loop);
    if (key) play(key);
  };

  const playNext = (force = false) => {
    if (!force && !node.attrs.autoplay) return;
    const key = stepPlaylistKey(items, active?.key || localActiveKey, 1, !!node.attrs.loop);
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

  const activeArtwork = active?.artwork ? getFileUrl(active.artwork) : undefined;
  const activePoster = active?.poster ? getFileUrl(active.poster) : undefined;
  const isPlayingRequest = !!active && playKey === active.key;
  const hasPrevious = activeIndex > 0 || (!!node.attrs.loop && items.length > 1);
  const hasNext = activeIndex < items.length - 1 || (!!node.attrs.loop && items.length > 1);

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
            onChange={(event) => updateAttributes({ title: event.currentTarget.value })}
            readOnly={!editable}
            placeholder={kind === "video" ? "Video playlist title…" : "Audio playlist title…"}
            variant={editable ? "default" : "unstyled"}
            styles={{ input: { fontFamily: BODY, fontSize: 16, fontWeight: 650 } }}
          />
        )}

        {active ? (
          kind === "video" ? (
            <RamzyVideoPlayer
              key={active.key}
              src={getFileUrl(active.src)}
              poster={activePoster}
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

        <RamzyPlaylist
          items={queueItems}
          activeKey={active?.key}
          playingKey={playKey}
          editable={editable}
          onSelect={select}
          onPlay={play}
          onMove={move}
          onReorder={reorder}
          onRemove={setRemoveCandidateKey}
          maxHeight={kind === "video" ? 390 : 420}
        />

        {editable && (
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Group gap={6} wrap="nowrap">
                  <Loader size={13} />
                  <span>Uploading & processing…</span>
                </Group>
              ) : kind === "video" ? (
                "+ Add video(s)"
              ) : (
                "+ Add track(s)"
              )}
            </Button>
            <Button
              size="xs"
              variant={node.attrs.autoplay ? "filled" : "subtle"}
              onClick={() => updateAttributes({ autoplay: !node.attrs.autoplay })}
            >
              Autoplay next
            </Button>
            <Button
              size="xs"
              variant={node.attrs.loop ? "filled" : "subtle"}
              onClick={() => updateAttributes({ loop: !node.attrs.loop })}
            >
              Loop playlist
            </Button>
          </Group>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={mediaAccept(kind)}
          multiple
          style={{ display: "none" }}
          onChange={(event) => {
            if (event.target.files?.length) void uploadFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />

        <Modal
          opened={!!removeCandidateKey}
          onClose={() => setRemoveCandidateKey(null)}
          title="Remove playlist item?"
          centered
          size="sm"
        >
          <Stack gap="md">
            <Text size="sm" ff={BODY}>
              Remove {items.find((item) => item.key === removeCandidateKey)?.title || "this item"} from this playlist? The uploaded media stays in your library.
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={() => setRemoveCandidateKey(null)}>
                Cancel
              </Button>
              <Button color="red" onClick={() => removeCandidateKey && remove(removeCandidateKey)}>
                Remove
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </NodeViewWrapper>
  );
}
