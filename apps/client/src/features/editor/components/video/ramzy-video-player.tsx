import React, { useEffect, useRef, useState } from "react";

const SIGNAL = "#3B5BFF";
const BODY = '"DM Sans", system-ui, sans-serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

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
  | "settings"
  | "pip"
  | "fullscreen"
  | "fullscreenExit";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (name === "play") {
    return <svg {...common}><path d="M8 5.2 19 12 8 18.8V5.2Z" fill="currentColor" /></svg>;
  }
  if (name === "pause") {
    return <svg {...common}><path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" fill="currentColor" /></svg>;
  }
  if (name === "volume") {
    return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="M16 8.2c1.6 1.6 1.6 6 0 7.6M18.8 5.8c3.1 3.2 3.1 9.2 0 12.4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" /></svg>;
  }
  if (name === "muted") {
    return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="m16.2 9.2 4.2 5.6m0-5.6-4.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  }
  if (name === "settings") {
    return <svg {...common}><path d="M12 15.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" stroke="currentColor" strokeWidth="1.6" /><path d="M19.4 13.4a7.7 7.7 0 0 0 0-2.8l2-1.5-2-3.4-2.4 1a8.4 8.4 0 0 0-2.4-1.4L14.3 2h-4.6l-.3 3.3A8.4 8.4 0 0 0 7 6.7l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2.8l-2 1.5 2 3.4 2.4-1a8.4 8.4 0 0 0 2.4 1.4l.3 3.3h4.6l.3-3.3a8.4 8.4 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.5Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" /></svg>;
  }
  if (name === "pip") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><rect x="11.5" y="11" width="7" height="5" rx="1" fill="currentColor" /></svg>;
  }
  if (name === "fullscreenExit") {
    return <svg {...common}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  }
  return <svg {...common}><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>;
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
  const hideTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [seeking, setSeeking] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);

  const progress = duration > 0 ? clamp(currentTime / duration) : 0;
  const bufferProgress = duration > 0 ? clamp(buffered / duration) : 0;

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    const sync = () => setNativeFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
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

  function pointerRatio(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.width ? clamp((event.clientX - rect.left) / rect.width) : 0;
  }

  function seekRatio(ratio: number) {
    if (duration) setTime(ratio * duration);
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

  function setPlaybackSpeed(next: number) {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = next;
    setSpeed(next);
    setSettingsOpen(false);
  }

  async function toggleFullscreen() {
    const root = rootRef.current;
    if (!root || typeof document === "undefined") return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.requestFullscreen?.();
    } catch {
      // The host may deny fullscreen; playback should remain unaffected.
    }
  }

  async function togglePiP() {
    const video = videoRef.current as (HTMLVideoElement & {
      requestPictureInPicture?: () => Promise<unknown>;
    }) | null;
    if (!video?.requestPictureInPicture || typeof document === "undefined") return;
    const doc = document as Document & {
      pictureInPictureElement?: Element | null;
      exitPictureInPicture?: () => Promise<void>;
    };
    try {
      if (doc.pictureInPictureElement) await doc.exitPictureInPicture?.();
      else await video.requestPictureInPicture();
    } catch {
      // Browser or embedded host may deny PiP.
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button,input,[role='slider']")) return;
    const key = event.key.toLowerCase();
    if (key === " " || key === "k") {
      event.preventDefault();
      togglePlayback();
    } else if (key === "arrowleft") {
      event.preventDefault();
      setTime(currentTime - 5);
    } else if (key === "arrowright") {
      event.preventDefault();
      setTime(currentTime + 5);
    } else if (key === "m") {
      event.preventDefault();
      toggleMute();
    } else if (key === "f") {
      event.preventDefault();
      void toggleFullscreen();
    }
  }

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
  };

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      data-ramzy-media-player="video"
      aria-label={`${title} video player`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onMouseEnter={() => showControls(true)}
      onMouseMove={() => showControls()}
      onMouseLeave={() => {
        setSettingsOpen(false);
        if (playing) setControlsVisible(false);
      }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        borderRadius: nativeFullscreen ? 0 : 8,
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
        onDoubleClick={() => void toggleFullscreen()}
        onPlay={() => {
          setPlaying(true);
          showControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          setCurrentTime(event.currentTarget.currentTime || 0);
        }}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setCurrentTime(video.currentTime);
          if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
        }}
        onProgress={(event) => {
          const video = event.currentTarget;
          if (video.buffered.length) setBuffered(video.buffered.end(video.buffered.length - 1));
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
          background: "#0F0F0F",
        }}
      />

      {!playing && controlsVisible && (
        <button
          type="button"
          aria-label="Play video"
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 76,
            height: 76,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.35)",
            background: "rgba(15,15,15,.72)",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 36px rgba(0,0,0,.28)",
          }}
        >
          <Icon name="play" size={34} />
        </button>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: controlsVisible
            ? "linear-gradient(to bottom, rgba(0,0,0,.12) 0%, transparent 35%, transparent 55%, rgba(0,0,0,.82) 100%)"
            : "transparent",
          transition: "background 160ms ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: nativeFullscreen ? "48px 28px 22px" : "42px 18px 14px",
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 160ms ease, transform 160ms ease",
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
          style={{
            position: "relative",
            height: 22,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            touchAction: "none",
            marginBottom: 2,
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, height: hoverProgress !== null || seeking ? 6 : 4, borderRadius: 99, background: "rgba(255,255,255,.28)" }} />
          <div style={{ position: "absolute", left: 0, width: `${bufferProgress * 100}%`, height: hoverProgress !== null || seeking ? 6 : 4, borderRadius: 99, background: "rgba(255,255,255,.46)" }} />
          <div style={{ position: "absolute", left: 0, width: `${progress * 100}%`, height: hoverProgress !== null || seeking ? 6 : 4, borderRadius: 99, background: SIGNAL }} />
          <div style={{ position: "absolute", left: `calc(${progress * 100}% - 7px)`, width: 14, height: 14, borderRadius: "50%", background: SIGNAL, opacity: hoverProgress !== null || seeking ? 1 : 0, boxShadow: "0 1px 5px rgba(0,0,0,.35)" }} />
          {hoverProgress !== null && duration > 0 && (
            <div style={{ position: "absolute", left: `${hoverProgress * 100}%`, bottom: 22, transform: "translateX(-50%)", padding: "5px 7px", borderRadius: 6, background: "rgba(15,15,15,.92)", color: "#fff", fontFamily: MONO, fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap" }}>
              {formatTime(hoverProgress * duration)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", minHeight: 48, gap: 2 }}>
          <button type="button" aria-label={playing ? "Pause" : "Play"} style={controlButton} onClick={togglePlayback}>
            <Icon name={playing ? "pause" : "play"} size={27} />
          </button>

          <button type="button" aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"} style={controlButton} onClick={toggleMute}>
            <Icon name={isMuted || volume === 0 ? "muted" : "volume"} size={24} />
          </button>
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(event) => setPlayerVolume(Number(event.target.value))}
            style={{ width: 82, accentColor: "#FFFFFF" }}
          />

          <span style={{ marginLeft: 5, fontFamily: BODY, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.94)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {formatTime(currentTime)} <span style={{ opacity: .58 }}>/</span> {formatTime(duration)}
          </span>

          <div style={{ flex: 1 }} />

          <div style={{ position: "relative" }}>
            <button type="button" aria-label="Playback settings" style={controlButton} onClick={() => setSettingsOpen((value) => !value)}>
              <Icon name="settings" size={23} />
            </button>
            {settingsOpen && (
              <div style={{ position: "absolute", right: 0, bottom: 50, width: 190, padding: 8, borderRadius: 10, background: "rgba(22,22,22,.96)", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,.35)", backdropFilter: "blur(18px)" }}>
                <div style={{ padding: "5px 8px 8px", fontFamily: BODY, fontSize: 12, fontWeight: 650, opacity: .72 }}>Playback speed</div>
                {SPEEDS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPlaybackSpeed(value)}
                    style={{ width: "100%", height: 34, border: 0, borderRadius: 6, padding: "0 9px", display: "flex", alignItems: "center", justifyContent: "space-between", background: value === speed ? "rgba(255,255,255,.1)" : "transparent", color: "#fff", fontFamily: BODY, fontSize: 13, cursor: "pointer" }}
                  >
                    <span>{value === 1 ? "Normal" : `${value}×`}</span>
                    {value === speed && <span style={{ color: SIGNAL }}>●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {typeof document !== "undefined" && "pictureInPictureEnabled" in document && (
            <button type="button" aria-label="Picture in picture" style={controlButton} onClick={() => void togglePiP()}>
              <Icon name="pip" size={22} />
            </button>
          )}

          <button type="button" aria-label={nativeFullscreen ? "Exit fullscreen" : "Fullscreen"} style={controlButton} onClick={() => void toggleFullscreen()}>
            <Icon name={nativeFullscreen ? "fullscreenExit" : "fullscreen"} size={24} />
          </button>
        </div>
      </div>

      <style>{`
        [data-ramzy-media-player="video"] button:hover { background: rgba(255,255,255,.10) !important; }
        [data-ramzy-media-player="video"] button:focus-visible,
        [data-ramzy-media-player="video"] [role="slider"]:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
