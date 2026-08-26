import type { Editor } from "@tiptap/core";
import { notifications } from "@mantine/notifications";
import { getFileUploadSizeLimit } from "@/lib/config.ts";
import { formatBytes } from "@/lib";
import i18n from "@/i18n.ts";
import { uploadVideoAction } from "@/features/editor/components/video/upload-video-action.tsx";
import { uploadAudioAction } from "@/features/editor/components/audio/upload-audio-action.tsx";
import { ingestMediaBatch } from "./media-ingest";
import {
  AUDIO_ACCEPT,
  VIDEO_ACCEPT,
  isAudioFile,
  isVideoFile,
} from "./media-file-utils";

export type StudioMediaKind = "video" | "audio";

export function mediaAccept(kind: StudioMediaKind) {
  return kind === "video" ? VIDEO_ACCEPT : AUDIO_ACCEPT;
}

function validSize(file: File) {
  if (file.size <= getFileUploadSizeLimit()) return true;
  notifications.show({
    color: "red",
    message: i18n.t("File exceeds the {{limit}} attachment limit", {
      limit: formatBytes(getFileUploadSizeLimit()),
    }),
  });
  return false;
}

export function filterMediaFiles(files: File[], kind: StudioMediaKind) {
  return files.filter((file) => {
    const accepted = kind === "video" ? isVideoFile(file) : isAudioFile(file);
    return accepted && validSize(file);
  });
}

export async function insertMediaFiles({
  editor,
  files,
  pageId,
  kind,
  pos,
}: {
  editor: Editor;
  files: File[];
  pageId: string;
  kind: StudioMediaKind;
  pos?: number;
}) {
  const accepted = filterMediaFiles(files, kind);
  if (!accepted.length) return false;

  const insertPos = pos ?? editor.state.selection.from;

  if (accepted.length === 1) {
    if (kind === "video") {
      uploadVideoAction(accepted[0], editor, insertPos, pageId);
    } else {
      uploadAudioAction(accepted[0], editor, insertPos, pageId);
    }
    return true;
  }

  notifications.show({
    id: `ramzy-${kind}-playlist-upload`,
    loading: true,
    autoClose: false,
    title: kind === "video" ? "Building video playlist" : "Building audio playlist",
    message: `${accepted.length} files are being uploaded and enriched.`,
  });

  const result = await ingestMediaBatch(accepted, kind, pageId);
  if (!result.successful.length) {
    notifications.update({
      id: `ramzy-${kind}-playlist-upload`,
      loading: false,
      color: "red",
      autoClose: 5000,
      title: "Media upload failed",
      message: "No files could be added.",
    });
    return false;
  }

  editor
    .chain()
    .focus()
    .insertContentAt(insertPos, {
      type: "mediaPlaylist",
      attrs: {
        kind,
        title: "",
        items: result.successful,
        activeKey: result.successful[0]?.key || "",
        autoplay: false,
        loop: false,
      },
    })
    .run();

  notifications.update({
    id: `ramzy-${kind}-playlist-upload`,
    loading: false,
    color: result.failed.length ? "yellow" : "green",
    autoClose: 3500,
    title: kind === "video" ? "Video playlist ready" : "Audio playlist ready",
    message: result.failed.length
      ? `${result.successful.length} added, ${result.failed.length} failed.`
      : `${result.successful.length} files added.`,
  });

  return true;
}

export async function insertDroppedMedia({
  editor,
  files,
  pageId,
  pos,
}: {
  editor: Editor;
  files: File[];
  pageId: string;
  pos: number;
}) {
  const videos = files.filter(isVideoFile);
  const audios = files.filter(isAudioFile);
  let handled = false;

  if (videos.length) {
    handled = (await insertMediaFiles({ editor, files: videos, pageId, kind: "video", pos })) || handled;
  }
  if (audios.length) {
    const nextPos = editor.state.selection.from || pos;
    handled = (await insertMediaFiles({ editor, files: audios, pageId, kind: "audio", pos: nextPos })) || handled;
  }

  return handled;
}
