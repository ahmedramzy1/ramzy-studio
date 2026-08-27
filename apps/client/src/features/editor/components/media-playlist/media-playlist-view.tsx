import { Button, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaPlaylistItem } from "@docmost/editor-ext";
import { getFileUrl } from "@/lib/config.ts";
import RamzyAudioPlayer from "@/features/editor/components/audio/ramzy-audio-player.tsx";
import RamzyVideoPlayer from "@/features/editor/components/video/ramzy-video-player.tsx";
import RamzyExternalVideoPlayer from "@/features/editor/components/video/ramzy-external-video-player.tsx";
import {
  detectExternalVideoProvider,
  externalVideoEmbedUrl,
} from "@/features/editor/components/video/external-video.ts";
import RamzyPlaylist from "./ramzy-playlist";
import { ingestMediaBatch } from "@/features/editor/components/media/media-ingest.ts";
import {
  filterMediaFiles,
  mediaAccept,
} from "@/features/editor/components/media/media-authoring-actions.ts";

const BODY = '"DM Sans", system-ui, sans-serif';

function mediaUrl(value?: string) {
  if (!value) return undefined;
  return value.startsWith("data:") ? value : getFileUrl(value);
}

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
  const [activated, setActivated] = useState(false);

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
    if (!items.length) return;
    const index = Math.max(0, items.findIndex((item) => item.key === (active?.key || localActiveKey)));
    if (index <= 0) {
      if (node.attrs.loop && items.length > 1) play(items[items.length - 1].key);
      return;
    }
    play(items[index - 1].key);
  };

  const playNext = (force = false) => {
    if (!items.length) return;
    if (!force && !node.attrs.autoplay) return;
    const index = Math.max(0, items.findIndex((item) => item.key === (active?.key || localActiveKey)));
    if (index < items.length - 1) {
      play(items[index + 1].key);
      return;
    }
    if (node.attrs.loop && items.length > 1) play(items[0].key);
  };

  const setItems = (next: MediaPlaylistItem[], nextActive?: string) => {
    const activeKey = nextActive ?? localActiveKey ?? next[0]?.key ?? "";
    updateAttributes({ items: next, activeKey });
    setLocalActiveKey(activeKey);
    if (playKey && !next.some((item) => item.key === playKey)) setPlayKey("");
  };

  const move = (key: string, direction: -1 | 1) => {
    const index = items.findIndex((item) => item.key === key);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const reorder = (sourceKey: string, targetKey: string) => {
    const from = items.findIndex((item) => item.key === sourceKey);
    const to = items.findIndex((item) => item.key === targetKey);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  };

  const remove = (key: string) => {
    const index = items.findIndex((item) => item.key === key);
    const next = items.filter((item) => item.key !== key);
    const nextActive =
      key === localActiveKey
        ? next[Math.min(Math.max(index, 0), Math.max(next.length - 1, 0))]?.key ||
          next[0]?.key ||
          ""
        : localActiveKey;
    setItems(next, nextActive);
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
        ? mediaUrl(item.artwork || item.poster)
        : undefined,
    durationSeconds: item.durationSeconds,
    dateAdded: item.dateAdded,
    sourceLabel:
      kind === "video"
        ? item.source === "youtube"
          ? "YouTube"
          : item.source === "vimeo"
            ? "Vimeo"
            : "Uploaded video"
        : "Uploaded audio",
  }));

  const activeArtwork = mediaUrl(active?.artwork);
  const activePoster = mediaUrl(active?.poster);
  const activeExternalUrl = active?.externalUrl || "";
  const activeProvider =
    active?.source === "youtube" || active?.source === "vimeo"
      ? active.source
      : detectExternalVideoProvider(activeExternalUrl);
  const activeEmbed = activeProvider
    ? externalVideoEmbedUrl(activeProvider, activeExternalUrl)
    : null;
  const activeMediaSrc = mediaUrl(active?.src);
  const isPlayingRequest = !!active && playKey === active.key;
  const hasPrevious = activeIndex > 0 || (!!node.attrs.loop && items.length > 1);
  const hasNext = activeIndex < items.length - 1 || (!!node.attrs.loop && items.length > 1);

  if (!activated && items.length > 0) {
    return (
      <NodeViewWrapper data-drag-handle data-ramzy-playlist-kind={kind}>
        <button
          type="button"
          onClick={() => setActivated(true)}
          style={{
            width: "100%",
            minHeight: kind === "video" ? 180 : 112,
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: 8,
            background: "var(--mantine-color-default-hover)",
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          Load {kind === "video" ? "video" : "audio"} playlist · {items.length} item{items.length === 1 ? "" : "s"}
        </button>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      data-drag-handle
      data-ramzy-playlist-kind={kind}
      className={selected ? "ProseMirror-selectednode" : undefined}
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
            activeEmbed && activeProvider ? (
              <RamzyExternalVideoPlayer
                embedUrl={activeEmbed}
                provider={activeProvider}
                title={active.title || "Video"}
                playRequestToken={playNonce}
                onEnded={() => playNext(false)}
                onPrevious={playPrevious}
                onNext={() => playNext(true)}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                playlistTitle={node.attrs.title || "Video playlist"}
                playlistTrackCount={items.length}
                playlistIndex={activeIndex}
              />
            ) : activeMediaSrc ? (
              <RamzyVideoPlayer
                src={activeMediaSrc}
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
            ) : null
          ) : (
            <RamzyAudioPlayer
              src={activeMediaSrc || ""}
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
          onRemove={remove}
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
      </Stack>
    </NodeViewWrapper>
  );
}
