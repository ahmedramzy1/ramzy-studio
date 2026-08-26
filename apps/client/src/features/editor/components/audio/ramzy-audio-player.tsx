// ─── RAMZY WAVE ──────────────────────────────────────────────────────────────
// Canonical Ahmed Ramzy audio player ported from ahmedramzy.com v8.0.0.
// Studio adaptation: protected attachment waveform reads keep credentials.

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { dsTheme, FONT, R, SIGNAL, type DsMode } from "../media/v8-media-tokens";
import RamzyVolumeControl from "../media/ramzy-volume-control";
import RamzyMini from "../media/ramzy-mini";
import {
  activateRamzyMediaSession,
  registerRamzyMediaSession,
} from "../media/media-session";

export interface RamzyAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  description?: string;
  artwork?: string;
  mode?: DsMode;
  loop?: boolean;
  showWaveform?: boolean;
  autoPlay?: boolean;
  playRequestToken?: number;
  playlistTitle?: string;
  playlistTrackCount?: number;
  playlistIndex?: number;
  style?: React.CSSProperties;
  onEnded?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onDurationChange?: (duration: number) => void;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const WAVEFORM_BARS = 220;
const WAVEFORM_VIEWBOX_HEIGHT = 178;
const WAVEFORM_SURFACE_HEIGHT = 204;

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

type AudioIconName =
  | "play"
  | "pause"
  | "rewind"
  | "forward"
  | "previous"
  | "next"
  | "volume"
  | "muted"
  | "loop";

function AudioIcon({ name, size = 22 }: { name: AudioIconName; size?: number }) {
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
  if (name === "previous") return <svg {...common}><path d="M7 5v14M18 6.5 9.5 12 18 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "next") return <svg {...common}><path d="M17 5v14M6 6.5 14.5 12 6 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "rewind") return <svg {...common}><path d="M7.4 8.6H3.5V4.7M3.9 8.2A8.5 8.5 0 1 1 4.7 17" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /><text x="8.1" y="15.1" fill="currentColor" fontSize="8.4" fontFamily="Arial, sans-serif" fontWeight="700">10</text></svg>;
  if (name === "forward") return <svg {...common}><path d="M16.6 8.6h3.9V4.7M20.1 8.2A8.5 8.5 0 1 0 19.3 17" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /><text x="7.7" y="15.1" fill="currentColor" fontSize="8.4" fontFamily="Arial, sans-serif" fontWeight="700">10</text></svg>;
  if (name === "volume") return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="M16 8.2c1.6 1.6 1.6 6 0 7.6M18.8 5.8c3.1 3.2 3.1 9.2 0 12.4" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" /></svg>;
  if (name === "muted") return <svg {...common}><path d="M4 9.5v5h4L13 19V5L8 9.5H4Z" fill="currentColor" /><path d="m16.2 9.2 4.2 5.6m0-5.6-4.2 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  return <svg {...common}><path d="M17 7h3V4M20 7c-1.5-2.2-4-3.5-6.8-3.5A8.5 8.5 0 0 0 4.7 12M7 17H4v3M4 17c1.5 2.2 4 3.5 6.8 3.5a8.5 8.5 0 0 0 8.5-8.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function normalisePeaks(values: number[]) {
  if (!values.length) return [];
  const max = Math.max(...values, 0.0001);
  return values.map((value) => Math.max(0.08, value / max));
}

async function decodeWaveform(src: string, bars = WAVEFORM_BARS): Promise<number[]> {
  const response = await fetch(src, { credentials: "include" });
  if (!response.ok) throw new Error("Audio waveform fetch failed");
  const bytes = await response.arrayBuffer();
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) throw new Error("Web Audio unavailable");

  const context = new AudioContextCtor();
  try {
    const buffer = await context.decodeAudioData(bytes.slice(0));
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
    const blockSize = Math.max(1, Math.floor(buffer.length / bars));
    const peaks: number[] = [];
    for (let barIndex = 0; barIndex < bars; barIndex += 1) {
      const start = barIndex * blockSize;
      const end = Math.min(buffer.length, start + blockSize);
      const sampleStep = Math.max(1, Math.floor(blockSize / 56));
      let sum = 0;
      let count = 0;
      let peak = 0;
      for (const channel of channels) {
        for (let sample = start; sample < end; sample += sampleStep) {
          const value = Math.abs(channel[sample] || 0);
          sum += value;
          peak = Math.max(peak, value);
          count += 1;
        }
      }
      peaks.push(peak * 0.72 + (count ? sum / count : 0) * 0.28);
    }
    return normalisePeaks(peaks);
  } finally {
    void context.close();
  }
}

export default function RamzyAudioPlayer({
  src,
  title = "Untitled audio",
  artist,
  description,
  artwork,
  mode = "light",
  loop = false,
  showWaveform = true,
  autoPlay = false,
  playRequestToken = 0,
  playlistTitle,
  playlistTrackCount,
  playlistIndex,
  style,
  onEnded,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onDurationChange,
}: RamzyAudioPlayerProps) {
  const c = dsTheme(mode);
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clipId = useId().replace(/:/g, "");
  const sessionId = `ramzy-audio-${useId().replace(/:/g, "")}`;
  const shortcutRef = useRef<(event: KeyboardEvent) => boolean>(() => false);
  const shortcutEnabledRef = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.82);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [localLoop, setLocalLoop] = useState(loop);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [waveLoading, setWaveLoading] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [inlineVisible, setInlineVisible] = useState(true);
  const [miniOpen, setMiniOpen] = useState(false);
  shortcutEnabledRef.current = inlineVisible;

  const progress = duration > 0 ? clamp(currentTime / duration) : 0;
  const secondary = artist || description;
  const waveform = showWaveform !== false;

  useEffect(() => {
    setLocalLoop(loop);
  }, [loop, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = localLoop;
    audio.volume = volume;
    audio.muted = muted;
  }, [localLoop, volume, muted, src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (autoPlay) {
      const tryPlay = () => void audio.play().catch(() => setPlaying(false));
      if (audio.readyState >= 2) tryPlay();
      else audio.addEventListener("canplay", tryPlay, { once: true });
      return () => audio.removeEventListener("canplay", tryPlay);
    }
  }, [src, autoPlay, playRequestToken]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setInlineVisible(entry.isIntersecting && entry.intersectionRatio >= 0.22);
    }, { threshold: [0, 0.08, 0.22, 0.4, 1] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inlineVisible) {
      setMiniOpen(false);
      return;
    }
    if (playing) setMiniOpen(true);
  }, [inlineVisible, playing]);

  useEffect(() => {
    let cancelled = false;
    setWaveLoading(true);
    setPeaks([]);
    if (!waveform || !src) {
      setWaveLoading(false);
      return;
    }
    void decodeWaveform(src)
      .then((next) => {
        if (cancelled) return;
        setPeaks(next);
        setWaveLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPeaks([]);
        setWaveLoading(false);
      });
    return () => { cancelled = true; };
  }, [src, waveform]);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }

  function seekSeconds(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const maxDuration = Number.isFinite(audio.duration) ? audio.duration : duration;
    const next = clamp(audio.currentTime + delta, 0, maxDuration || 0);
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function seekRatio(ratio: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = clamp(ratio) * duration;
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function pointerRatio(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.width ? clamp((event.clientX - rect.left) / rect.width) : 0;
  }

  function setPlayerVolume(nextValue: number) {
    const next = clamp(nextValue);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = next;
      audio.muted = next === 0;
    }
    setVolume(next);
    setMuted(next === 0);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    if (!audio.muted && audio.volume === 0) audio.volume = 0.75;
    setMuted(audio.muted);
    setVolume(audio.muted ? 0 : audio.volume);
  }

  function cycleSpeed() {
    const audio = audioRef.current;
    if (!audio) return;
    const currentIndex = SPEEDS.indexOf(speed);
    const next = SPEEDS[(currentIndex + 1) % SPEEDS.length];
    audio.playbackRate = next;
    setSpeed(next);
  }

  function handleGlobalShortcut(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === " " || key === "k") togglePlayback();
    else if (key === "arrowleft") seekSeconds(-10);
    else if (key === "arrowright") seekSeconds(10);
    else if (key === "arrowup") setPlayerVolume((muted ? 0 : volume) + 0.05);
    else if (key === "arrowdown") setPlayerVolume((muted ? 0 : volume) - 0.05);
    else if (key === "m") toggleMute();
    else return false;
    return true;
  }

  shortcutRef.current = handleGlobalShortcut;

  useEffect(
    () =>
      registerRamzyMediaSession(sessionId, {
        pause: () => {
          audioRef.current?.pause();
          setMiniOpen(false);
        },
        handleShortcut: (event) => shortcutRef.current(event),
        isShortcutEnabled: () => shortcutEnabledRef.current,
      }),
    [sessionId],
  );

  const iconButton: React.CSSProperties = {
    width: 46,
    height: 46,
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: c.textPrimary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  };

  const barGeometry = useMemo(() => {
    const source = peaks.length
      ? peaks
      : Array.from({ length: WAVEFORM_BARS }, (_, index) => 0.16 + ((index * 37) % 11) / 80);
    const count = source.length;
    const width = 1000;
    const gap = 1.9;
    const barWidth = Math.max(1.35, width / count - gap);
    return source.map((peak, index) => {
      const height = Math.max(14, peak * 158);
      const x = index * (width / count);
      return { x, y: WAVEFORM_VIEWBOX_HEIGHT / 2 - height / 2, width: barWidth, height };
    });
  }, [peaks]);

  return (
    <>
      <div
        ref={rootRef}
        tabIndex={0}
        data-ramzy-media-player="audio"
        aria-label={`${title} audio player`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: 24,
          border: `1px solid ${c.borderDefault}`,
          borderRadius: R.default,
          background: c.bgSurface,
          outline: "none",
          boxShadow: mode === "light" ? "0 8px 30px rgba(29,29,27,.045)" : "0 10px 32px rgba(0,0,0,.18)",
          ...style,
        }}
      >
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onPlay={() => {
            activateRamzyMediaSession(sessionId);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
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
            if (!seeking) setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            onEnded?.();
          }}
          onError={() => setPlaying(false)}
        />

        <div style={{ display: "grid", gridTemplateColumns: artwork ? "104px minmax(0, 1fr) auto" : "minmax(0,1fr) auto", gap: 20, alignItems: "center" }}>
          {artwork && <img src={artwork} alt="" style={{ width: 104, height: 104, borderRadius: 10, objectFit: "cover", boxShadow: "0 8px 24px rgba(0,0,0,.14)" }} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT.body, fontSize: 21, fontWeight: 720, lineHeight: 1.18, letterSpacing: "-.015em", color: c.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
            {secondary && <div style={{ marginTop: 7, fontFamily: FONT.body, fontSize: 14, fontWeight: artist ? 550 : 400, lineHeight: 1.4, color: c.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{secondary}</div>}
            {artist && description && <div style={{ marginTop: 3, fontFamily: FONT.body, fontSize: 13, color: c.textTertiary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</div>}
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: c.textTertiary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatTime(duration)}</div>
        </div>

        {waveform && (
          <div style={{ marginTop: 20 }}>
            <div
              role="slider"
              aria-label="Audio waveform and progress"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              tabIndex={0}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                setSeeking(true);
                seekRatio(pointerRatio(event));
              }}
              onPointerMove={(event) => {
                const ratio = pointerRatio(event);
                setHoverRatio(ratio);
                if (seeking) seekRatio(ratio);
              }}
              onPointerEnter={(event) => setHoverRatio(pointerRatio(event))}
              onPointerLeave={() => { if (!seeking) setHoverRatio(null); }}
              onPointerUp={(event) => {
                setSeeking(false);
                try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
              }}
              style={{ position: "relative", height: WAVEFORM_SURFACE_HEIGHT, cursor: duration ? "pointer" : "default", touchAction: "none", userSelect: "none" }}
            >
              <svg width="100%" height="100%" viewBox={`0 0 1000 ${WAVEFORM_VIEWBOX_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
                <defs><clipPath id={`${clipId}-played`}><rect x="0" y="0" width={progress * 1000} height={WAVEFORM_VIEWBOX_HEIGHT} /></clipPath></defs>
                <g opacity={waveLoading ? 0.32 : 0.7}>{barGeometry.map((bar, index) => <rect key={`base-${index}`} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="1.6" fill={c.borderDefault} />)}</g>
                <g clipPath={`url(#${clipId}-played)`}>{barGeometry.map((bar, index) => <rect key={`played-${index}`} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="1.6" fill={SIGNAL} />)}</g>
                <line x1={progress * 1000} y1="4" x2={progress * 1000} y2={WAVEFORM_VIEWBOX_HEIGHT - 4} stroke={c.textPrimary} strokeWidth="2" opacity=".8" />
                {hoverRatio !== null && <line x1={hoverRatio * 1000} y1="8" x2={hoverRatio * 1000} y2={WAVEFORM_VIEWBOX_HEIGHT - 8} stroke={c.textSecondary} strokeWidth="1.2" opacity=".52" />}
              </svg>
              {hoverRatio !== null && duration > 0 && <div style={{ position: "absolute", left: `${hoverRatio * 100}%`, top: -2, transform: "translate(-50%, -100%)", padding: "5px 7px", borderRadius: 6, background: c.textPrimary, color: c.bgSurface, fontFamily: FONT.mono, fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,.12)" }}>{formatTime(hoverRatio * duration)}</div>}
              {waveLoading && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: FONT.body, fontSize: 11, color: c.textTertiary }}>Reading waveform…</div>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontFamily: FONT.mono, fontSize: 12, color: c.textTertiary, fontVariantNumeric: "tabular-nums" }}><span>{formatTime(currentTime)}</span><span>−{formatTime(Math.max(0, duration - currentTime))}</span></div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(170px,1fr) auto minmax(170px,1fr)", alignItems: "center", gap: 14, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}><RamzyVolumeControl value={volume} muted={muted} mode={mode} alwaysVisible onChange={setPlayerVolume} onToggleMute={toggleMute} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button type="button" disabled={!hasPrevious} aria-label="Previous track" style={{ ...iconButton, opacity: hasPrevious ? 1 : 0.3, cursor: hasPrevious ? "pointer" : "default" }} onClick={() => hasPrevious && onPrevious?.()}><AudioIcon name="previous" size={22} /></button>
            <button type="button" aria-label="Back 10 seconds" style={iconButton} onClick={() => seekSeconds(-10)}><AudioIcon name="rewind" size={25} /></button>
            <button type="button" aria-label={playing ? "Pause" : "Play"} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); togglePlayback(); }} style={{ ...iconButton, width: 62, height: 62, margin: "0 5px", background: SIGNAL, color: "#fff", boxShadow: "0 8px 24px rgba(59,91,255,.28)" }}><AudioIcon name={playing ? "pause" : "play"} size={29} /></button>
            <button type="button" aria-label="Forward 10 seconds" style={iconButton} onClick={() => seekSeconds(10)}><AudioIcon name="forward" size={25} /></button>
            <button type="button" disabled={!hasNext} aria-label="Next track" style={{ ...iconButton, opacity: hasNext ? 1 : 0.3, cursor: hasNext ? "pointer" : "default" }} onClick={() => hasNext && onNext?.()}><AudioIcon name="next" size={22} /></button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
            <button type="button" aria-label="Playback speed" title="Playback speed" onClick={cycleSpeed} style={{ minWidth: 52, height: 38, padding: "0 10px", border: `1px solid ${c.borderDefault}`, borderRadius: 999, background: c.bgElevated, color: c.textSecondary, fontFamily: FONT.body, fontSize: 13, fontWeight: 650, cursor: "pointer" }}>{speed}×</button>
            <button type="button" aria-label="Repeat" aria-pressed={localLoop} onClick={() => setLocalLoop((value) => !value)} style={{ ...iconButton, color: localLoop ? SIGNAL : c.textSecondary, background: localLoop ? c.signalBg : "transparent" }}><AudioIcon name="loop" size={22} /></button>
          </div>
        </div>

        <style>{`
          [data-ramzy-media-player="audio"] button:hover:not(:disabled) { background: ${mode === "light" ? "rgba(29,29,27,.06)" : "rgba(255,255,255,.07)"}; }
          [data-ramzy-media-player="audio"] button:focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: 2px; }
        `}</style>
      </div>

      {miniOpen && !inlineVisible && typeof document !== "undefined" && createPortal(
        <RamzyMini
          title={title}
          artist={artist}
          artwork={artwork}
          mode={mode}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          muted={muted}
          peaks={peaks}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          playlistTitle={playlistTitle}
          playlistTrackCount={playlistTrackCount}
          playlistIndex={playlistIndex}
          onTogglePlayback={togglePlayback}
          onPrevious={onPrevious}
          onNext={onNext}
          onSeek={seekRatio}
          onVolumeChange={setPlayerVolume}
          onToggleMute={toggleMute}
          onReturn={() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          onClose={() => {
            audioRef.current?.pause();
            setMiniOpen(false);
          }}
        />,
        document.body,
      )}
    </>
  );
}
