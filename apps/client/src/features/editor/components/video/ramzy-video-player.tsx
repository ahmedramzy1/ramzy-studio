// ─── RAMZY PLAYER ────────────────────────────────────────────────────────────
// Canonical Ahmed Ramzy video player ported from ahmedramzy.com v8.0.0.
// Source release: 2beb19718c9192d75cbd6929d9762fb64909253b.

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FONT, R, SIGNAL, type DsMode } from "../media/v8-media-tokens";
import RamzyVolumeControl from "../media/ramzy-volume-control";
import {
  activateRamzyMediaSession,
  registerRamzyMediaSession,
} from "../media/media-session";

export interface RamzyVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  mode?: DsMode;
  autoPlay?: boolean;
  playRequestToken?: number;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onEnded?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  playlistTitle?: string;
  playlistTrackCount?: number;
  playlistIndex?: number;
  onDurationChange?: (duration: number) => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type IconName =
  | "play"
  | "pause"
  | "volume"
  | "muted"
  | "pip"
  | "fullscreen"
  | "fullscreenExit"
  | "settings"
  | "previous"
  | "next"
  | "close";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (name === "play") return <svg {...common}><path d="M8 5.2 19 12 8 18.8V5.2Z" fill="currentColor" /></svg>;
  if (name === "pause") return <svg {...common}><path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" fill="currentColor" /></svg>;
  if (name === "volume") return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="M16 8.2c1.6 1.6 1.6 6 0 7.6M18.8 5.8c3.1 3.2 3.1 9.2 0 12.4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" /></svg>;
  if (name === "muted") return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="m16.2 9.2 4.2 5.6m0-5.6-4.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "pip") return <svg {...common}><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="11.5" y="11" width="7" height="5" rx="1" fill="currentColor" /></svg>;
  if (name === "previous") return <svg {...common}><path d="M7 5v14M18 6.5 9.5 12 18 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "next") return <svg {...common}><path d="M17 5v14M6 6.5 14.5 12 6 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "close") return <svg {...common}><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "fullscreenExit") return <svg {...common}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "settings") return <svg {...common}><path d="M12 15.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" stroke="currentColor" strokeWidth="1.6" /><path d="M19.4 13.4a7.7 7.7 0 0 0 0-2.8l2-1.5-2-3.4-2.4 1a8.4 8.4 0 0 0-2.4-1.4L14.3 2h-4.6l-.3 3.3A8.4 8.4 0 0 0 7 6.7l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2.8l-2 1.5 2 3.4 2.4-1a8.4 8.4 0 0 0 2.4 1.4l.3 3.3h4.6l.3-3.3a8.4 8.4 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.5Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" /></svg>;
  return <svg {...common}><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function RamzyVideoPlayer({
  src,
  poster,
  title = "Video",
  mode = "light",
  autoPlay = false,
  playRequestToken = 0,
  loop = false,
  muted = false,
  playsInline = true,
  className,
  style,
  onEnded,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  playlistTitle,
  playlistTrackCount,
  playlistIndex,
  onDurationChange,
}: RamzyVideoPlayerProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerHost] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );
  const sessionId = `ramzy-video-${useId().replace(/:/g, "")}`;
  const shortcutRef = useRef<(event: KeyboardEvent) => boolean>(() => false);
  const shortcutEnabledRef = useRef(true);
  const hideTimer = useRef<number | null>(null);
  const seekFeedbackTimer = useRef<number | null>(null);
  const seekFeedbackNonce = useRef(0);
  const floatingExitTimer = useRef<number | null>(null);
  const floatingFrame = useRef<number | null>(null);
  const videoClickTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [seekFeedback, setSeekFeedback] = useState<{ delta: -5 | 5; id: number } | null>(null);
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [inlineVisible, setInlineVisible] = useState(true);
  shortcutEnabledRef.current = inlineVisible;
  const [nativePiP, setNativePiP] = useState(false);
  const [followActive, setFollowActive] = useState(false);
  const [floatingFallback, setFloatingFallback] = useState(false);
  const [floatingMounted, setFloatingMounted] = useState(false);
  const [floatingVisible, setFloatingVisible] = useState(false);
  const [floatingDismissed, setFloatingDismissed] = useState(false);

  const progress = duration > 0 ? clamp(currentTime / duration) : 0;
  const bufferProgress = duration > 0 ? clamp(buffered / duration) : 0;
  const fullscreen = pseudoFullscreen || nativeFullscreen;

  // Keep the portal target stable for the lifetime of the player. Moving this
  // host between the inline anchor and document.body preserves the same
  // HTMLVideoElement, including playback, currentTime and buffered data.
  // Changing the portal target itself would remount the video and show its
  // poster again whenever the follow-player opens or closes.
  useLayoutEffect(() => {
    if (!playerHost) return;
    const floating = floatingMounted || pseudoFullscreen;
    const parent = floating ? document.body : anchorRef.current;
    if (!parent) return;

    if (floating) {
      playerHost.style.display = "contents";
      playerHost.style.position = "";
      playerHost.style.inset = "";
      playerHost.style.width = "";
      playerHost.style.height = "";
    } else {
      playerHost.style.display = "block";
      playerHost.style.position = "absolute";
      playerHost.style.inset = "0";
      playerHost.style.width = "100%";
      playerHost.style.height = "100%";
    }

    if (playerHost.parentNode !== parent) parent.appendChild(playerHost);
  }, [floatingMounted, playerHost, pseudoFullscreen]);

  useEffect(
    () => () => {
      playerHost?.remove();
    },
    [playerHost],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = loop;
    video.muted = muted;
    setIsMuted(muted);
    setVolume(muted ? 0 : video.volume);
  }, [loop, muted, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.load();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (autoPlay || playRequestToken > 0) {
      const tryPlay = () => void video.play().catch(() => setPlaying(false));
      if (video.readyState >= 2) tryPlay();
      else video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }
  }, [autoPlay, src, playRequestToken]);

  useEffect(() => {
    const sync = () => setNativeFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    const node = anchorRef.current;
    if (!node || typeof window === "undefined") return;
    let frame: number | null = null;
    const measure = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      setInlineVisible(rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidth);
    };
    const schedule = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (inlineVisible) setFloatingDismissed(false);
  }, [inlineVisible]);

  useEffect(() => {
    const video = videoRef.current as (HTMLVideoElement & { requestPictureInPicture?: () => Promise<unknown> }) | null;
    if (!video) return;
    const entered = () => {
      setNativePiP(true);
      setFloatingFallback(false);
    };
    const left = () => {
      setNativePiP(false);
      if (!inlineVisible) {
        setFloatingDismissed(false);
      }
    };
    video.addEventListener("enterpictureinpicture", entered as EventListener);
    video.addEventListener("leavepictureinpicture", left as EventListener);
    return () => {
      video.removeEventListener("enterpictureinpicture", entered as EventListener);
      video.removeEventListener("leavepictureinpicture", left as EventListener);
    };
  }, [followActive, inlineVisible, pseudoFullscreen, nativeFullscreen]);

  useEffect(() => {
    const offscreenFollow = followActive && !inlineVisible && !pseudoFullscreen && !nativeFullscreen && !nativePiP && !floatingDismissed && (playing || floatingMounted);
    setFloatingFallback(offscreenFollow);
  }, [followActive, inlineVisible, pseudoFullscreen, nativeFullscreen, nativePiP, floatingDismissed, playing, floatingMounted]);

  useEffect(() => {
    if (floatingExitTimer.current) {
      window.clearTimeout(floatingExitTimer.current);
      floatingExitTimer.current = null;
    }
    if (floatingFrame.current) {
      window.cancelAnimationFrame(floatingFrame.current);
      floatingFrame.current = null;
    }
    if (floatingFallback) {
      setFloatingMounted(true);
      floatingFrame.current = window.requestAnimationFrame(() => {
        setFloatingVisible(true);
        floatingFrame.current = null;
      });
      return;
    }
    if (floatingMounted) {
      setFloatingVisible(false);
      floatingExitTimer.current = window.setTimeout(() => {
        setFloatingMounted(false);
        floatingExitTimer.current = null;
      }, 170);
    }
  }, [floatingFallback, floatingMounted]);

  useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (seekFeedbackTimer.current) window.clearTimeout(seekFeedbackTimer.current);
    if (floatingExitTimer.current) window.clearTimeout(floatingExitTimer.current);
    if (floatingFrame.current) window.cancelAnimationFrame(floatingFrame.current);
    if (videoClickTimer.current) window.clearTimeout(videoClickTimer.current);
  }, []);

  function showControls(persist = false) {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    if (!persist && playing) {
      hideTimer.current = window.setTimeout(() => {
        setControlsVisible(false);
        setSettingsOpen(false);
      }, 1900);
    }
  }

  useEffect(() => {
    showControls(!playing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  function setTime(next: number) {
    const video = videoRef.current;
    if (!video) return;
    const safe = clamp(next, 0, Number.isFinite(video.duration) ? video.duration : duration || 0);
    video.currentTime = safe;
    setCurrentTime(safe);
  }

  function showSeekFeedback(delta: -5 | 5) {
    seekFeedbackNonce.current += 1;
    setSeekFeedback({ delta, id: seekFeedbackNonce.current });
    if (seekFeedbackTimer.current) window.clearTimeout(seekFeedbackTimer.current);
    seekFeedbackTimer.current = window.setTimeout(() => setSeekFeedback(null), 420);
  }

  function seekBy(delta: -5 | 5, feedback = true) {
    const video = videoRef.current;
    if (!video) return;
    setTime(video.currentTime + delta);
    if (feedback) showSeekFeedback(delta);
    showControls();
  }

  function pointerRatio(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.width ? clamp((event.clientX - rect.left) / rect.width) : 0;
  }

  function seekRatio(ratio: number) {
    if (!duration) return;
    setTime(ratio * duration);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 0.75;
    setIsMuted(video.muted);
    setVolume(video.muted ? 0 : video.volume);
  }

  function setPlayerVolume(nextValue: number) {
    const video = videoRef.current;
    if (!video) return;
    const next = clamp(nextValue);
    video.volume = next;
    video.muted = next === 0;
    setVolume(next);
    setIsMuted(next === 0);
  }

  function closeFloatingFollow() {
    const video = videoRef.current;
    if (video && !video.paused) video.pause();
    setPlaying(false);
    setFloatingDismissed(true);
    setFloatingFallback(false);
  }

  function handleVideoSurfaceClick() {
    if (videoClickTimer.current) window.clearTimeout(videoClickTimer.current);
    videoClickTimer.current = window.setTimeout(() => {
      videoClickTimer.current = null;
      togglePlayback();
    }, 220);
  }

  function handleVideoSurfaceDoubleClick(event?: React.MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    if (videoClickTimer.current) {
      window.clearTimeout(videoClickTimer.current);
      videoClickTimer.current = null;
    }
    void toggleFullscreen();
  }

  async function toggleFullscreen() {
    const root = rootRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!root) return;
    if (pseudoFullscreen) {
      setPseudoFullscreen(false);
      return;
    }
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setPseudoFullscreen(false);
      }
      return;
    }
    const webkitRoot = root as HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void };
    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
        return;
      }
      if (webkitRoot.webkitRequestFullscreen) {
        await webkitRoot.webkitRequestFullscreen();
        return;
      }
      if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
        return;
      }
      setPseudoFullscreen(true);
    } catch {
      setPseudoFullscreen(true);
    }
  }

  async function togglePiP() {
    const video = videoRef.current as (HTMLVideoElement & { requestPictureInPicture?: () => Promise<unknown> }) | null;
    if (!video?.requestPictureInPicture) return;
    const doc = document as Document & { pictureInPictureElement?: Element | null; exitPictureInPicture?: () => Promise<void> };
    try {
      if (doc.pictureInPictureElement) await doc.exitPictureInPicture?.();
      else await video.requestPictureInPicture();
    } catch {}
  }

  function setPlaybackSpeed(next: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = next;
    setSpeed(next);
    setSettingsOpen(false);
  }

  function handleGlobalShortcut(event: KeyboardEvent) {
    const video = videoRef.current;
    if (!video) return false;
    const key = event.key.toLowerCase();
    if (key === " " || key === "k") togglePlayback();
    else if (key === "arrowleft") seekBy(-5);
    else if (key === "arrowright") seekBy(5);
    else if (key === "j") {
      setTime(video.currentTime - 10);
      showControls();
    } else if (key === "l") {
      setTime(video.currentTime + 10);
      showControls();
    } else if (key === "arrowup") {
      setPlayerVolume(volume + 0.05);
      showControls();
    } else if (key === "arrowdown") {
      setPlayerVolume(volume - 0.05);
      showControls();
    } else if (key === "m") toggleMute();
    else if (key === "f") void toggleFullscreen();
    else if (key === "escape" && pseudoFullscreen) setPseudoFullscreen(false);
    else if (/^[0-9]$/.test(key) && duration) {
      setTime((Number(key) / 10) * duration);
      showControls();
    } else return false;
    return true;
  }

  shortcutRef.current = handleGlobalShortcut;

  useEffect(
    () =>
      registerRamzyMediaSession(sessionId, {
        pause: () => {
          videoRef.current?.pause();
          setFollowActive(false);
          setFloatingFallback(false);
        },
        handleShortcut: (event) => shortcutRef.current(event),
        isShortcutEnabled: () => shortcutEnabledRef.current,
      }),
    [sessionId],
  );

  const controlButton: React.CSSProperties = {
    width: 44,
    height: 44,
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: "#FFFFFF",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    flex: "0 0 auto",
    transition: "background 120ms ease, transform 120ms ease",
  };

  const player = (
      <div
        ref={rootRef}
        tabIndex={0}
        data-ramzy-media-player="video"
        aria-label={`${title} video player`}
        data-floating={floatingMounted ? "true" : undefined}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button,[role="slider"],[data-ramzy-volume-control="true"]')) return;
          handleVideoSurfaceDoubleClick(event);
        }}
        onMouseEnter={() => showControls(true)}
        onMouseMove={() => showControls()}
        onMouseLeave={() => {
          setSettingsOpen(false);
          if (playing) setControlsVisible(false);
        }}
        style={{
          position: pseudoFullscreen || floatingMounted ? "fixed" : "absolute",
          inset: pseudoFullscreen ? 0 : floatingMounted ? undefined : 0,
          right: floatingMounted ? 20 : undefined,
          bottom: floatingMounted ? 20 : undefined,
          zIndex: pseudoFullscreen ? 2147483000 : floatingMounted ? 2147482400 : undefined,
          width: pseudoFullscreen ? "100vw" : floatingMounted ? "min(440px, calc(100vw - 32px))" : "100%",
          height: pseudoFullscreen ? "100vh" : floatingMounted ? "auto" : "100%",
          aspectRatio: pseudoFullscreen ? undefined : "16 / 9",
          overflow: "hidden",
          borderRadius: fullscreen ? 0 : R.default,
          background: "#0F0F0F",
          outline: "none",
          boxShadow: pseudoFullscreen ? "0 0 0 100vmax #000" : floatingMounted ? "0 18px 60px rgba(0,0,0,.38)" : undefined,
          opacity: floatingMounted ? (floatingVisible ? 1 : 0) : 1,
          transition: floatingMounted ? "opacity 170ms ease" : undefined,
        }}
      >
        {floatingMounted && (
          <div style={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 6, display: "flex", alignItems: "center", gap: 6, pointerEvents: "none" }}>
            {playlistTrackCount && playlistTrackCount > 1 ? (
              <div style={{ minWidth: 0, maxWidth: "65%", padding: "6px 9px", borderRadius: 999, background: "rgba(15,15,15,.66)", color: "#fff", fontFamily: FONT.body, fontSize: 11, fontWeight: 650, backdropFilter: "blur(10px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {playlistTitle || "Video playlist"} · {playlistIndex !== undefined ? `${playlistIndex + 1} / ${playlistTrackCount}` : `${playlistTrackCount} videos`}
              </div>
            ) : <div />}
            <div style={{ marginLeft: "auto", display: "flex", gap: 4, pointerEvents: "auto" }}>
              {playlistTrackCount && playlistTrackCount > 1 && (
                <>
                  <button type="button" aria-label="Previous video" disabled={!hasPrevious} onClick={(event) => { event.stopPropagation(); if (hasPrevious) onPrevious?.(); }} style={{ ...controlButton, width: 38, height: 38, background: "rgba(15,15,15,.66)", opacity: hasPrevious ? 1 : 0.38, backdropFilter: "blur(10px)" }}><Icon name="previous" size={18} /></button>
                  <button type="button" aria-label="Next video" disabled={!hasNext} onClick={(event) => { event.stopPropagation(); if (hasNext) onNext?.(); }} style={{ ...controlButton, width: 38, height: 38, background: "rgba(15,15,15,.66)", opacity: hasNext ? 1 : 0.38, backdropFilter: "blur(10px)" }}><Icon name="next" size={18} /></button>
                </>
              )}
              <button type="button" aria-label="Close picture in picture" title="Close picture in picture" onClick={(event) => { event.stopPropagation(); closeFloatingFollow(); }} style={{ ...controlButton, width: 38, height: 38, background: "rgba(15,15,15,.66)", backdropFilter: "blur(10px)" }}><Icon name="close" size={18} /></button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline={playsInline}
          preload="metadata"
          onClick={handleVideoSurfaceClick}
          onDoubleClick={handleVideoSurfaceDoubleClick}
          onPlay={() => {
            activateRamzyMediaSession(sessionId);
            setPlaying(true);
            setFollowActive(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          onLoadedMetadata={(event) => {
            const next = event.currentTarget.duration || 0;
            setDuration(next);
            setCurrentTime(event.currentTarget.currentTime || 0);
            onDurationChange?.(next);
          }}
          onDurationChange={(event) => {
            const next = event.currentTarget.duration || 0;
            setDuration(next);
            onDurationChange?.(next);
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            setCurrentTime(video.currentTime);
            if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
          }}
          onProgress={(event) => {
            const video = event.currentTarget;
            if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
          }}
          style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", background: "#0F0F0F" }}
        />

        {seekFeedback && (
          <div key={seekFeedback.id} aria-live="polite" style={{ position: "absolute", top: "50%", [seekFeedback.delta < 0 ? "left" : "right"]: "8%", transform: "translateY(-50%)", minWidth: 70, height: 70, borderRadius: 999, background: "rgba(0,0,0,0.58)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.body, fontSize: 18, fontWeight: 700, backdropFilter: "blur(10px)", pointerEvents: "none", animation: "ramzySeekFeedback 420ms ease-out both" }}>
            {seekFeedback.delta > 0 ? "+5" : "−5"}
          </div>
        )}

        {!playing && controlsVisible && (
          <button type="button" aria-label="Play video" onClick={(event) => { event.stopPropagation(); togglePlayback(); }} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 76, height: 76, borderRadius: "50%", border: "1px solid rgba(255,255,255,.35)", background: "rgba(15,15,15,.72)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(12px)", boxShadow: "0 10px 36px rgba(0,0,0,.28)" }}>
            <Icon name="play" size={34} />
          </button>
        )}

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: controlsVisible ? "linear-gradient(to bottom, rgba(0,0,0,.12) 0%, transparent 35%, transparent 55%, rgba(0,0,0,.82) 100%)" : "transparent", transition: "background 160ms ease" }} />

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: fullscreen ? "48px 28px 22px" : "42px 18px 14px", opacity: controlsVisible ? 1 : 0, transform: controlsVisible ? "translateY(0)" : "translateY(8px)", transition: "opacity 160ms ease, transform 160ms ease", pointerEvents: controlsVisible ? "auto" : "none" }}>
          <div
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            tabIndex={0}
            onPointerEnter={(event) => setHoverProgress(pointerRatio(event))}
            onPointerMove={(event) => {
              const ratio = pointerRatio(event);
              setHoverProgress(ratio);
              if (seeking) seekRatio(ratio);
            }}
            onPointerLeave={() => {
              if (!seeking) setHoverProgress(null);
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              setSeeking(true);
              seekRatio(pointerRatio(event));
            }}
            onPointerUp={(event) => {
              setSeeking(false);
              try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
            }}
            style={{ position: "relative", height: 22, display: "flex", alignItems: "center", cursor: "pointer", touchAction: "none", marginBottom: 2 }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, height: seeking || hoverProgress !== null ? 6 : 4, borderRadius: 99, background: "rgba(255,255,255,.28)", transition: "height 100ms ease" }} />
            <div style={{ position: "absolute", left: 0, width: `${bufferProgress * 100}%`, height: seeking || hoverProgress !== null ? 6 : 4, borderRadius: 99, background: "rgba(255,255,255,.46)" }} />
            <div style={{ position: "absolute", left: 0, width: `${progress * 100}%`, height: seeking || hoverProgress !== null ? 6 : 4, borderRadius: 99, background: SIGNAL }} />
            <div style={{ position: "absolute", left: `calc(${progress * 100}% - 7px)`, width: 14, height: 14, borderRadius: "50%", background: SIGNAL, opacity: seeking || hoverProgress !== null ? 1 : 0, transform: `scale(${seeking ? 1.12 : 1})`, transition: "opacity 100ms ease, transform 100ms ease", boxShadow: "0 1px 5px rgba(0,0,0,.35)" }} />
            {hoverProgress !== null && duration > 0 && (
              <div style={{ position: "absolute", left: `${hoverProgress * 100}%`, bottom: 22, transform: "translateX(-50%)", padding: "5px 7px", borderRadius: 6, background: "rgba(15,15,15,.92)", color: "#fff", fontFamily: FONT.mono, fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap" }}>
                {formatTime(hoverProgress * duration)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", minHeight: 48, gap: 2 }}>
            <button type="button" aria-label={playing ? "Pause" : "Play"} style={controlButton} onClick={togglePlayback}><Icon name={playing ? "pause" : "play"} size={27} /></button>
            <RamzyVolumeControl value={volume} muted={isMuted} mode={mode} tone="inverse" onChange={setPlayerVolume} onToggleMute={toggleMute} />
            <span style={{ marginLeft: 4, fontFamily: FONT.body, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.94)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {formatTime(currentTime)} <span style={{ opacity: 0.58 }}>/</span> {formatTime(duration)}
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative" }}>
              <button type="button" aria-label="Playback settings" style={controlButton} onClick={() => setSettingsOpen((value) => !value)}><Icon name="settings" size={23} /></button>
              {settingsOpen && (
                <div style={{ position: "absolute", right: 0, bottom: 50, width: 190, padding: 8, borderRadius: 10, background: "rgba(22,22,22,.96)", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.35)", backdropFilter: "blur(18px)" }}>
                  <div style={{ padding: "5px 8px 8px", fontFamily: FONT.body, fontSize: 12, fontWeight: 650, opacity: 0.72 }}>Playback speed</div>
                  {SPEEDS.map((value) => (
                    <button key={value} type="button" onClick={() => setPlaybackSpeed(value)} style={{ width: "100%", height: 34, border: 0, borderRadius: 6, padding: "0 9px", display: "flex", alignItems: "center", justifyContent: "space-between", background: value === speed ? "rgba(255,255,255,.1)" : "transparent", color: "#fff", fontFamily: FONT.body, fontSize: 13, cursor: "pointer" }}>
                      <span>{value === 1 ? "Normal" : `${value}×`}</span>
                      {value === speed && <span style={{ color: SIGNAL }}>●</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {"pictureInPictureEnabled" in document && (
              <button type="button" aria-label="Picture in picture" style={controlButton} onClick={() => void togglePiP()}><Icon name="pip" size={22} /></button>
            )}
            <button type="button" aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} style={controlButton} onClick={() => void toggleFullscreen()}><Icon name={fullscreen ? "fullscreenExit" : "fullscreen"} size={24} /></button>
          </div>
        </div>

        <style>{`
          @keyframes ramzySeekFeedback {
            0% { opacity: 0; transform: translateY(-50%) scale(.84); }
            18% { opacity: 1; transform: translateY(-50%) scale(1); }
            72% { opacity: 1; transform: translateY(-50%) scale(1); }
            100% { opacity: 0; transform: translateY(-50%) scale(.94); }
          }
          [data-ramzy-media-player="video"] button:hover { background: rgba(255,255,255,.10) !important; }
          [data-ramzy-media-player="video"] button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        `}</style>
      </div>
  );

  return (
    <div ref={anchorRef} className={className} data-ramzy-video-anchor="true" style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", ...style }}>
      {playerHost ? createPortal(player, playerHost) : player}
    </div>
  );
}
