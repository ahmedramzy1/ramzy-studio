import React, { useEffect, useRef, useState } from "react";

const SIGNAL = "#3B5BFF";
const BODY = '"DM Sans", system-ui, sans-serif';
const MONO = '"JetBrains Mono", "Courier New", monospace';
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export interface RamzyAudioPlayerProps {
  src: string;
  title?: string;
  loop?: boolean;
  showWaveform?: boolean;
  style?: React.CSSProperties;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function AudioIcon({
  name,
  size = 18,
}: {
  name: "play" | "pause" | "back" | "forward" | "volume" | "muted" | "loop";
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
  if (name === "back") {
    return <svg {...common}><path d="M12 6L6 12L12 18M7 12H18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><text x="13.2" y="9" fill="currentColor" fontSize="6" fontFamily="sans-serif">10</text></svg>;
  }
  if (name === "forward") {
    return <svg {...common}><path d="M12 6L18 12L12 18M17 12H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><text x="4.2" y="9" fill="currentColor" fontSize="6" fontFamily="sans-serif">10</text></svg>;
  }
  if (name === "volume") {
    return <svg {...common}><path d="M4 10V14H8L13 18V6L8 10H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 9C17.2 10.1 17.2 13.9 16 15M18.5 6.5C21.3 9.1 21.3 14.9 18.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  }
  if (name === "muted") {
    return <svg {...common}><path d="M4 10V14H8L13 18V6L8 10H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 10L20 14M20 10L16 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  }
  return <svg {...common}><path d="M17 8H20V5M20 8C18.6 5.7 16 4.2 13 4.2C8.7 4.2 5.2 7.7 5.2 12M7 16H4V19M4 16C5.4 18.3 8 19.8 11 19.8C15.3 19.8 18.8 16.3 18.8 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function normalisePeaks(values: number[], target = 96) {
  if (!values.length) return [];
  const max = Math.max(...values, 0.0001);
  return values.slice(0, target).map((value) => Math.max(0.08, value / max));
}

async function decodeWaveform(src: string, bars = 96): Promise<number[]> {
  const response = await fetch(src, { credentials: "include" });
  if (!response.ok) throw new Error("Audio waveform fetch failed");

  const bytes = await response.arrayBuffer();
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) throw new Error("Web Audio unavailable");

  const context = new AudioContextCtor();
  try {
    const buffer = await context.decodeAudioData(bytes.slice(0));
    const channel = buffer.getChannelData(0);
    const block = Math.max(1, Math.floor(channel.length / bars));
    const peaks: number[] = [];

    for (let i = 0; i < bars; i += 1) {
      const start = i * block;
      const end = Math.min(channel.length, start + block);
      let sum = 0;
      let count = 0;
      for (let j = start; j < end; j += 1) {
        sum += Math.abs(channel[j]);
        count += 1;
      }
      peaks.push(count ? sum / count : 0);
    }

    return normalisePeaks(peaks, bars);
  } finally {
    void context.close();
  }
}

export default function RamzyAudioPlayer({
  src,
  title = "Audio",
  loop = false,
  showWaveform = true,
  style,
}: RamzyAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [waveformAvailable, setWaveformAvailable] = useState(false);
  const [localLoop, setLocalLoop] = useState(loop);

  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.loop = localLoop;
  }, [localLoop]);

  useEffect(() => {
    setLocalLoop(loop);
  }, [loop, src]);

  useEffect(() => {
    let cancelled = false;
    setPeaks([]);
    setWaveformAvailable(false);

    if (!showWaveform || !src) return;

    void decodeWaveform(src)
      .then((result) => {
        if (cancelled) return;
        setPeaks(result);
        setWaveformAvailable(result.length > 0);
      })
      .catch(() => {
        if (!cancelled) setWaveformAvailable(false);
      });

    return () => {
      cancelled = true;
    };
  }, [src, showWaveform]);

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  function seek(ratio: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Math.max(0, Math.min(duration, ratio * duration));
  }

  function setPlayerVolume(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.max(0, Math.min(1, value));
    audio.volume = next;
    audio.muted = next === 0;
    setVolume(next);
    setMuted(next === 0);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  function cycleSpeed() {
    const audio = audioRef.current;
    if (!audio) return;
    const index = SPEEDS.indexOf(speed);
    const next = SPEEDS[(index + 1) % SPEEDS.length];
    audio.playbackRate = next;
    setSpeed(next);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio) return;
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
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        break;
      case "arrowright":
        event.preventDefault();
        audio.currentTime = Math.min(duration, audio.currentTime + 10);
        break;
      case "m":
        event.preventDefault();
        toggleMute();
        break;
    }
  }

  const iconButton: React.CSSProperties = {
    width: 34,
    height: 34,
    border: 0,
    borderRadius: 4,
    background: "transparent",
    color: "var(--mantine-color-text)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div
      tabIndex={0}
      aria-label={`${title} audio player`}
      onKeyDown={handleKeyDown}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: 16,
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: 8,
        background: "var(--mantine-color-body)",
        color: "var(--mantine-color-text)",
        outline: "none",
        ...style,
      }}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <div
        style={{
          fontFamily: BODY,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--mantine-color-text)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>

      {showWaveform && (
        <div
          role="slider"
          aria-label="Audio progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onPointerDown={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            seek((event.clientX - rect.left) / rect.width);
          }}
          style={{
            position: "relative",
            height: 64,
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {waveformAvailable ? (
            peaks.map((peak, index) => {
              const ratio = peaks.length > 1 ? index / (peaks.length - 1) : 0;
              const played = ratio <= progress;
              return (
                <span
                  key={index}
                  style={{
                    flex: 1,
                    minWidth: 1,
                    height: `${Math.max(10, Math.round(peak * 58))}px`,
                    borderRadius: 999,
                    background: played ? SIGNAL : "var(--mantine-color-default-border)",
                    transition: "background 90ms linear",
                  }}
                />
              );
            })
          ) : (
            <>
              <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 999, background: "var(--mantine-color-default-border)" }} />
              <div style={{ position: "absolute", left: 0, width: `${progress * 100}%`, height: 4, borderRadius: 999, background: SIGNAL }} />
            </>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: showWaveform ? 6 : 14 }}>
        <button type="button" style={{ ...iconButton, background: SIGNAL, color: "#fff", borderRadius: "50%" }} aria-label={playing ? "Pause" : "Play"} onClick={togglePlayback}>
          <AudioIcon name={playing ? "pause" : "play"} />
        </button>
        <button type="button" style={iconButton} aria-label="Back 10 seconds" onClick={() => {
          const audio = audioRef.current;
          if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
        }}><AudioIcon name="back" /></button>
        <button type="button" style={iconButton} aria-label="Forward 10 seconds" onClick={() => {
          const audio = audioRef.current;
          if (audio) audio.currentTime = Math.min(duration, audio.currentTime + 10);
        }}><AudioIcon name="forward" /></button>

        <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--mantine-color-dimmed)", fontVariantNumeric: "tabular-nums" }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div style={{ flex: 1 }} />

        <button type="button" style={iconButton} aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
          <AudioIcon name={muted || volume === 0 ? "muted" : "volume"} />
        </button>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(event) => setPlayerVolume(Number(event.target.value))}
          style={{ width: 72, accentColor: SIGNAL }}
        />
        <button type="button" style={{ ...iconButton, width: 42, fontFamily: MONO, fontSize: 10 }} aria-label="Playback speed" onClick={cycleSpeed}>
          {speed}×
        </button>
        <button
          type="button"
          style={{ ...iconButton, color: localLoop ? SIGNAL : "var(--mantine-color-text)" }}
          aria-label="Loop"
          aria-pressed={localLoop}
          onClick={() => setLocalLoop((value) => !value)}
        >
          <AudioIcon name="loop" />
        </button>
      </div>
    </div>
  );
}
