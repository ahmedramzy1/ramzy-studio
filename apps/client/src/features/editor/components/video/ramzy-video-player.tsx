import React, { useEffect, useMemo, useRef, useState } from "react";

const SIGNAL = "#3B5BFF";
const MONO = '"JetBrains Mono", "Courier New", monospace';
const RADIUS = 8;
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export interface RamzyVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
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

function PlayerIcon({
  name,
  size = 18,
}: {
  name: "play" | "pause" | "volume" | "muted" | "pip" | "fullscreen";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (name === "play") {
    return <svg {...common}><path d="M8 5L19 12L8 19V5Z" fill="currentColor" /></svg>;
  }
  if (name === "pause") {
    return <svg {...common}><path d="M7 5H10V19H7V5ZM14 5H17V19H14V5Z" fill="currentColor" /></svg>;
  }
  if (name === "volume") {
    return <svg {...common}><path d="M4 10V14H8L13 18V6L8 10H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 9C17.2 10.1 17.2 13.9 16 15M18.5 6.5C21.3 9.1 21.3 14.9 18.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  }
  if (name === "muted") {
    return <svg {...common}><path d="M4 10V14H8L13 18V6L8 10H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 10L20 14M20 10L16 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  }
  if (name === "pip") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="11.5" y="11" width="7" height="5" rx="1" fill="currentColor" /></svg>;
  }
  return <svg {...common}><path d="M8 4H4V8M16 4H20V8M20 16V20H16M8 20H4V16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function RamzyVideoPlayer({
  src,
  poster,
  title = "Video",
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = true,
  style,
}: RamzyVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;
  const supportsPiP = useMemo(
    () => typeof document !== "undefined" && "pictureInPictureEnabled" in document,
    [],
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
    if (!video || !autoPlay) return;
    void video.play().catch(() => setPlaying(false));
  }, [autoPlay, src]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function seekTo(clientX: number, element: HTMLElement) {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = element.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted && video.volume === 0) {
      video.volume = 0.75;
      setVolume(0.75);
    }
  }

  function setPlayerVolume(value: number) {
    const video = videoRef.current;
    if (!video) return;
    const next = Math.max(0, Math.min(1, value));
    video.volume = next;
    video.muted = next === 0;
    setVolume(next);
    setIsMuted(next === 0);
  }

  function cycleSpeed() {
    const video = videoRef.current;
    if (!video) return;
    const currentIndex = SPEEDS.indexOf(speed);
    const next = SPEEDS[(currentIndex + 1) % SPEEDS.length];
    video.playbackRate = next;
    setSpeed(next);
  }

  async function toggleFullscreen() {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    await root.requestFullscreen?.().catch(() => undefined);
  }

  async function togglePiP() {
    const video = videoRef.current as (HTMLVideoElement & {
      requestPictureInPicture?: () => Promise<unknown>;
    }) | null;
    if (!video?.requestPictureInPicture) return;

    if ((document as Document & { pictureInPictureElement?: Element | null }).pictureInPictureElement) {
      const doc = document as Document & { exitPictureInPicture?: () => Promise<void> };
      await doc.exitPictureInPicture?.().catch(() => undefined);
      return;
    }
    await video.requestPictureInPicture().catch(() => undefined);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "SELECT") return;

    switch (event.key.toLowerCase()) {
      case " ":
      case "k":
        event.preventDefault();
        togglePlayback();
        break;
      case "arrowleft":
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        break;
      case "arrowright":
        event.preventDefault();
        video.currentTime = Math.min(duration, video.currentTime + 5);
        break;
      case "arrowup":
        event.preventDefault();
        setPlayerVolume(Math.min(1, volume + 0.1));
        break;
      case "arrowdown":
        event.preventDefault();
        setPlayerVolume(Math.max(0, volume - 0.1));
        break;
      case "m":
        event.preventDefault();
        toggleMute();
        break;
      case "f":
        event.preventDefault();
        void toggleFullscreen();
        break;
    }
  }

  const iconButton: React.CSSProperties = {
    width: 34,
    height: 34,
    border: 0,
    borderRadius: 4,
    background: "transparent",
    color: "#FFFFFF",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label={`${title} video player`}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseMove={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(!playing)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        borderRadius: RADIUS,
        background: "#0F0F0F",
        outline: "none",
        ...style,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline={playsInline}
        preload="metadata"
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          setCurrentTime(event.currentTarget.currentTime || 0);
        }}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setCurrentTime(video.currentTime);
          if (video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
          }
        }}
        onProgress={(event) => {
          const video = event.currentTarget;
          if (video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
          background: "#0F0F0F",
        }}
      />

      {!playing && (
        <button
          type="button"
          aria-label="Play"
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.55)",
            background: "rgba(255,255,255,0.92)",
            color: SIGNAL,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          }}
        >
          <PlayerIcon name="play" size={24} />
        </button>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "36px 14px 12px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.78))",
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 150ms ease, transform 150ms ease",
          pointerEvents: controlsVisible ? "auto" : "none",
        }}
      >
        <div
          role="slider"
          aria-label="Video progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onPointerDown={(event) => seekTo(event.clientX, event.currentTarget)}
          style={{
            position: "relative",
            height: 16,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: 6,
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.28)" }} />
          <div style={{ position: "absolute", left: 0, width: `${Math.min(100, bufferProgress)}%`, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.5)" }} />
          <div style={{ position: "absolute", left: 0, width: `${Math.min(100, progress)}%`, height: 3, borderRadius: 999, background: SIGNAL }} />
          <div style={{ position: "absolute", left: `calc(${Math.min(100, progress)}% - 5px)`, width: 10, height: 10, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 5px rgba(0,0,0,0.3)" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button type="button" aria-label={playing ? "Pause" : "Play"} style={iconButton} onClick={togglePlayback}>
            <PlayerIcon name={playing ? "pause" : "play"} />
          </button>
          <button type="button" aria-label={isMuted ? "Unmute" : "Mute"} style={iconButton} onClick={toggleMute}>
            <PlayerIcon name={isMuted || volume === 0 ? "muted" : "volume"} />
          </button>
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => setPlayerVolume(Number(event.target.value))}
            style={{ width: 74, accentColor: SIGNAL }}
          />
          <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.86)", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div style={{ flex: 1 }} />
          <button type="button" aria-label="Playback speed" title="Playback speed" style={{ ...iconButton, width: 42, fontFamily: MONO, fontSize: 10 }} onClick={cycleSpeed}>
            {speed}×
          </button>
          {supportsPiP && (
            <button type="button" aria-label="Picture in picture" style={iconButton} onClick={() => void togglePiP()}>
              <PlayerIcon name="pip" />
            </button>
          )}
          <button type="button" aria-label="Fullscreen" style={iconButton} onClick={() => void toggleFullscreen()}>
            <PlayerIcon name="fullscreen" />
          </button>
        </div>
      </div>
    </div>
  );
}
