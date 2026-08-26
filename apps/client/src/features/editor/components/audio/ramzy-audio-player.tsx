import React, { useEffect, useId, useMemo, useRef, useState } from "react";

const SIGNAL = "#3B5BFF";
const BODY = '"DM Sans", system-ui, sans-serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const WAVEFORM_BARS = 220;
const WAVEFORM_VIEWBOX_HEIGHT = 178;
const WAVEFORM_SURFACE_HEIGHT = 204;

export interface RamzyAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  description?: string;
  artwork?: string;
  loop?: boolean;
  showWaveform?: boolean;
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

type IconName = "play" | "pause" | "rewind" | "forward" | "volume" | "muted" | "loop";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
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
  loop = false,
  showWaveform = true,
  style,
}: RamzyAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const clipId = useId().replace(/:/g, "");
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

  const progress = duration > 0 ? clamp(currentTime / duration) : 0;
  const secondary = artist || description;
  const waveform = showWaveform !== false;
  const text = "var(--mantine-color-text, #1D1D1B)";
  const secondaryText = "var(--mantine-color-dimmed, #6D6D68)";
  const border = "var(--mantine-color-default-border, #DEDED9)";
  const surface = "var(--mantine-color-body, #FFFFFF)";
  const elevated = "var(--mantine-color-default, #F7F7F4)";

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

  function setPlayerVolume(value: number) {
    const next = clamp(value);
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button,input,[role='slider']")) return;
    const key = event.key.toLowerCase();
    if (key === " " || key === "k") {
      event.preventDefault();
      togglePlayback();
    } else if (key === "arrowleft") {
      event.preventDefault();
      seekSeconds(-10);
    } else if (key === "arrowright") {
      event.preventDefault();
      seekSeconds(10);
    } else if (key === "m") {
      event.preventDefault();
      toggleMute();
    }
  }

  const iconButton: React.CSSProperties = {
    width: 46,
    height: 46,
    border: 0,
    borderRadius: 999,
    background: "transparent",
    color: text,
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
    <div
      tabIndex={0}
      data-ramzy-media-player="audio"
      aria-label={`${title} audio player`}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: 24,
        border: `1px solid ${border}`,
        borderRadius: 8,
        background: surface,
        color: text,
        outline: "none",
        boxShadow: "0 8px 30px rgba(29,29,27,.045)",
        ...style,
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration || 0);
          setCurrentTime(event.currentTarget.currentTime || 0);
        }}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => {
          if (!seeking) setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={() => setPlaying(false)}
      />

      <div style={{ display: "grid", gridTemplateColumns: artwork ? "104px minmax(0, 1fr) auto" : "minmax(0,1fr) auto", gap: 20, alignItems: "center" }}>
        {artwork && <img src={artwork} alt="" style={{ width: 104, height: 104, borderRadius: 10, objectFit: "cover", boxShadow: "0 8px 24px rgba(0,0,0,.14)" }} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: BODY, fontSize: 21, fontWeight: 720, lineHeight: 1.18, letterSpacing: "-.015em", color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          {secondary && <div style={{ marginTop: 7, fontFamily: BODY, fontSize: 14, fontWeight: artist ? 550 : 400, lineHeight: 1.4, color: secondaryText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{secondary}</div>}
          {artist && description && <div style={{ marginTop: 3, fontFamily: BODY, fontSize: 13, color: secondaryText, opacity: .75, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{description}</div>}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: secondaryText, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatTime(duration)}</div>
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
              <g opacity={waveLoading ? .32 : .7}>{barGeometry.map((bar, index) => <rect key={`base-${index}`} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="1.6" fill={border} />)}</g>
              <g clipPath={`url(#${clipId}-played)`}>{barGeometry.map((bar, index) => <rect key={`played-${index}`} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="1.6" fill={SIGNAL} />)}</g>
              <line x1={progress * 1000} y1="4" x2={progress * 1000} y2={WAVEFORM_VIEWBOX_HEIGHT - 4} stroke={text} strokeWidth="2" opacity=".8" />
              {hoverRatio !== null && <line x1={hoverRatio * 1000} y1="8" x2={hoverRatio * 1000} y2={WAVEFORM_VIEWBOX_HEIGHT - 8} stroke={secondaryText} strokeWidth="1.2" opacity=".52" />}
            </svg>
            {hoverRatio !== null && duration > 0 && <div style={{ position: "absolute", left: `${hoverRatio * 100}%`, top: -2, transform: "translate(-50%, -100%)", padding: "5px 7px", borderRadius: 6, background: text, color: surface, fontFamily: MONO, fontSize: 11, pointerEvents: "none", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(0,0,0,.12)" }}>{formatTime(hoverRatio * duration)}</div>}
            {waveLoading && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: BODY, fontSize: 11, color: secondaryText }}>Reading waveform…</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2, fontFamily: MONO, fontSize: 12, color: secondaryText, fontVariantNumeric: "tabular-nums" }}>
            <span>{formatTime(currentTime)}</span>
            <span>−{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(170px,1fr) auto minmax(170px,1fr)", alignItems: "center", gap: 14, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", minWidth: 0, gap: 4 }}>
          <button type="button" aria-label={muted || volume === 0 ? "Unmute" : "Mute"} style={iconButton} onClick={toggleMute}><Icon name={muted || volume === 0 ? "muted" : "volume"} /></button>
          <input aria-label="Volume" type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={(event) => setPlayerVolume(Number(event.target.value))} style={{ width: 124, accentColor: text }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <button type="button" aria-label="Back 10 seconds" style={iconButton} onClick={() => seekSeconds(-10)}><Icon name="rewind" size={25} /></button>
          <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={togglePlayback} style={{ ...iconButton, width: 62, height: 62, margin: "0 5px", background: SIGNAL, color: "#fff", boxShadow: "0 8px 24px rgba(59,91,255,.28)" }}><Icon name={playing ? "pause" : "play"} size={29} /></button>
          <button type="button" aria-label="Forward 10 seconds" style={iconButton} onClick={() => seekSeconds(10)}><Icon name="forward" size={25} /></button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
          <button type="button" aria-label="Playback speed" title="Playback speed" onClick={cycleSpeed} style={{ minWidth: 52, height: 38, padding: "0 10px", border: `1px solid ${border}`, borderRadius: 999, background: elevated, color: secondaryText, fontFamily: BODY, fontSize: 13, fontWeight: 650, cursor: "pointer" }}>{speed}×</button>
          <button type="button" aria-label="Repeat" aria-pressed={localLoop} onClick={() => setLocalLoop((value) => !value)} style={{ ...iconButton, color: localLoop ? SIGNAL : secondaryText, background: localLoop ? "rgba(59,91,255,.10)" : "transparent" }}><Icon name="loop" size={22} /></button>
        </div>
      </div>

      <style>{`
        [data-ramzy-media-player="audio"] button:hover { background: rgba(29,29,27,.06); }
        [data-ramzy-media-player="audio"] button:focus-visible,
        [data-ramzy-media-player="audio"] [role="slider"]:focus-visible { outline: 2px solid ${SIGNAL}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
