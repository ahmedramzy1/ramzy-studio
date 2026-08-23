import { Button, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaPlaylistItem } from "@docmost/editor-ext";
import { uploadFile } from "@/features/page/services/page-service.ts";
import { getFileUrl } from "@/lib/config.ts";
import RamzyAudioPlayer from "@/features/editor/components/audio/ramzy-audio-player.tsx";
import RamzyVideoPlayer from "@/features/editor/components/video/ramzy-video-player.tsx";
import RamzyPlaylist from "./ramzy-playlist";

const BODY = '"DM Sans", system-ui, sans-serif';

function makeKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (items.some((item) => item.key === localActiveKey)) return;
    setLocalActiveKey(node.attrs.activeKey || items[0]?.key || "");
  }, [items, node.attrs.activeKey, localActiveKey]);

  const active =
    items.find((item) => item.key === localActiveKey) || items[0] || null;

  const select = (key: string) => {
    setLocalActiveKey(key);
    if (editable) updateAttributes({ activeKey: key });
  };

  const setItems = (next: MediaPlaylistItem[], nextActive?: string) => {
    const activeKey = nextActive ?? localActiveKey ?? next[0]?.key ?? "";
    updateAttributes({ items: next, activeKey });
    setLocalActiveKey(activeKey);
  };

  const move = (key: string, direction: -1 | 1) => {
    const index = items.findIndex((item) => item.key === key);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
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
    // Portfolio editor storage owns the canonical linked page id.
    // @ts-ignore
    const pageId = editor.storage?.pageId as string | undefined;
    if (!pageId || uploading) return;

    const accepted = Array.from(files).filter((file) =>
      kind === "video"
        ? file.type.startsWith("video/")
        : file.type.startsWith("audio/"),
    );
    if (!accepted.length) return;

    setUploading(true);
    try {
      const uploaded: MediaPlaylistItem[] = [];
      for (const file of accepted) {
        const attachment = await uploadFile(file, pageId);
        uploaded.push({
          key: makeKey(),
          src: `/api/files/${attachment.id}/${attachment.fileName}`,
          attachmentId: attachment.id,
          title: file.name.replace(/\.[^.]+$/, ""),
          subtitle: kind === "video" ? "Uploaded video" : "Uploaded audio",
        });
      }

      const next = [...items, ...uploaded];
      setItems(next, uploaded[0]?.key || next[0]?.key || "");
    } finally {
      setUploading(false);
    }
  };

  const queueItems = items.map((item) => ({
    key: item.key,
    title: item.title || (kind === "video" ? "Video" : "Audio"),
    subtitle: item.subtitle,
    artwork: item.artwork || item.poster,
  }));

  return (
    <NodeViewWrapper
      data-drag-handle
      data-ramzy-playlist-kind={kind}
      className={selected ? "ProseMirror-selectednode" : undefined}
    >
      <Stack gap="sm" py="xs">
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
              poster={active.poster ? getFileUrl(active.poster) : undefined}
              title={active.title || "Video"}
            />
          ) : (
            <RamzyAudioPlayer
              key={active.key}
              src={getFileUrl(active.src)}
              title={active.title || "Audio"}
              loop={!!node.attrs.loop}
            />
          )
        ) : (
          <div
            style={{
              minHeight: kind === "video" ? 240 : 116,
              border: "1px dashed var(--mantine-color-default-border)",
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "var(--mantine-color-default-hover)",
            }}
          >
            <Text size="sm" c="dimmed" ff={BODY}>
              {kind === "video" ? "Add your first video" : "Add your first track"}
            </Text>
          </div>
        )}

        <RamzyPlaylist
          items={queueItems}
          activeKey={active?.key}
          editable={editable}
          onSelect={select}
          onMove={move}
          onRemove={remove}
          maxHeight={kind === "video" ? 330 : 360}
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
                  <span>Uploading…</span>
                </Group>
              ) : kind === "video" ? (
                "+ Add video"
              ) : (
                "+ Add track"
              )}
            </Button>
            {kind === "audio" && (
              <Button
                size="xs"
                variant={node.attrs.loop ? "filled" : "subtle"}
                onClick={() => updateAttributes({ loop: !node.attrs.loop })}
              >
                Loop playlist
              </Button>
            )}
          </Group>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={kind === "video" ? "video/*" : "audio/*"}
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
