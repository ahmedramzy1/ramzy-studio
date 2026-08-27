// ─── RAMZY EXTERNAL VIDEO ────────────────────────────────────────────────────
// Wrapper for YouTube/Vimeo provider-native players.
//
// Provider controls remain intact. Ramzy adds:
// - reliable fullscreen fallback in nested authoring surfaces
// - provider end/duration events for mixed playlists

import React, {useEffect, useId, useRef, useState} from 'react'
import { FONT, R } from "../media/v8-media-tokens";
import { activateRamzyMediaSession, registerRamzyMediaSession } from "../media/media-session";

export interface RamzyExternalVideoPlayerProps {
  embedUrl: string
  title?: string
  provider?: 'youtube' | 'vimeo'
  style?: React.CSSProperties
  playRequestToken?: number
  onEnded?: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  playlistTitle?: string
  playlistTrackCount?: number
  playlistIndex?: number
  onDurationChange?: (duration: number) => void
}

let youtubeApiPromise: Promise<void> | undefined
let vimeoApiPromise: Promise<void> | undefined

function loadYouTubeApi() {
  if (youtubeApiPromise) return youtubeApiPromise
  youtubeApiPromise = new Promise<void>((resolve, reject) => {
    const w = window as typeof window & {
      YT?: {Player?: unknown}
      onYouTubeIframeAPIReady?: () => void
    }
    if (w.YT?.Player) {
      resolve()
      return
    }
    const previous = w.onYouTubeIframeAPIReady
    const timeout = window.setTimeout(() => reject(new Error('YouTube API timeout')), 12000)
    w.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout)
      previous?.()
      resolve()
    }
    if (!document.querySelector('script[data-ramzy-youtube-api]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ramzyYoutubeApi = 'true'
      script.onerror = () => reject(new Error('YouTube API unavailable'))
      document.head.appendChild(script)
    }
  })
  return youtubeApiPromise
}

function loadVimeoApi() {
  if (vimeoApiPromise) return vimeoApiPromise
  vimeoApiPromise = new Promise<void>((resolve, reject) => {
    const w = window as typeof window & {Vimeo?: {Player?: unknown}}
    if (w.Vimeo?.Player) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-ramzy-vimeo-api]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), {once:true})
      existing.addEventListener('error', () => reject(new Error('Vimeo API unavailable')), {once:true})
      return
    }
    const script = document.createElement('script')
    script.src = 'https://player.vimeo.com/api/player.js'
    script.async = true
    script.dataset.ramzyVimeoApi = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Vimeo API unavailable'))
    document.head.appendChild(script)
  })
  return vimeoApiPromise
}

function FullscreenIcon({exit = false}: {exit?: boolean}) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {exit
        ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  )
}

export default function RamzyExternalVideoPlayer({
  embedUrl,
  title = 'Video',
  provider,
  style,
  playRequestToken = 0,
  onEnded,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  playlistTitle,
  playlistTrackCount,
  playlistIndex,
  onDurationChange,
}: RamzyExternalVideoPlayerProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerId = `ramzy-external-${useId().replace(/:/g,'')}`
  const sessionId = `ramzy-external-session-${useId().replace(/:/g,'')}`
  const providerControlsRef = useRef<{
    play: () => void
    pause: () => void
    togglePlayback: () => void
    seekBy: (seconds: number) => void
    volumeBy: (amount: number) => void
    toggleMute: () => void
  }>({
    play: () => undefined,
    pause: () => undefined,
    togglePlayback: () => undefined,
    seekBy: () => undefined,
    volumeBy: () => undefined,
    toggleMute: () => undefined,
  })
  const shortcutRef = useRef<(event: KeyboardEvent) => boolean>(() => false)
  const shortcutEnabledRef = useRef(true)
  const [pseudoFullscreen, setPseudoFullscreen] = useState(false)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [inlineVisible, setInlineVisible] = useState(true)
  const [followActive, setFollowActive] = useState(false)
  const [floatingMounted, setFloatingMounted] = useState(false)
  const [floatingVisible, setFloatingVisible] = useState(false)
  const [floatingDismissed, setFloatingDismissed] = useState(false)
  const floatingExitTimer = useRef<number | null>(null)
  const floatingFrame = useRef<number | null>(null)
  const surfaceClickTimer = useRef<number | null>(null)
  shortcutEnabledRef.current = inlineVisible
  const fullscreen = pseudoFullscreen || nativeFullscreen

  const resolvedProvider =
    provider ??
    (embedUrl.includes('youtube.com') || embedUrl.includes('youtube-nocookie.com')
      ? 'youtube'
      : embedUrl.includes('vimeo.com')
        ? 'vimeo'
        : undefined)

  useEffect(() => {
    const sync = () => setNativeFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    const node = anchorRef.current
    if (!node || typeof window === 'undefined') return
    let frame: number | null = null

    const measure = () => {
      frame = null
      const rect = node.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth
      setInlineVisible(
        rect.bottom > 0 &&
        rect.top < viewportHeight &&
        rect.right > 0 &&
        rect.left < viewportWidth,
      )
    }
    const schedule = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, {passive:true, capture:true})
    window.addEventListener('resize', schedule, {passive:true})
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useEffect(() => {
    if (inlineVisible) setFloatingDismissed(false)
  }, [inlineVisible])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !resolvedProvider) return
    let cancelled = false
    let cleanup = () => {}

    if (resolvedProvider === 'youtube') {
      void loadYouTubeApi().then(() => {
        if (cancelled || !iframeRef.current) return
        const w = window as typeof window & {
          YT?: {
            Player?: new (element: HTMLIFrameElement | string, options: Record<string, unknown>) => {
              getDuration: () => number
              getCurrentTime: () => number
              getPlayerState: () => number
              getVolume: () => number
              setVolume: (volume: number) => void
              isMuted: () => boolean
              mute: () => void
              unMute: () => void
              playVideo: () => void
              pauseVideo: () => void
              seekTo: (seconds: number, allowSeekAhead?: boolean) => void
              destroy: () => void
            }
          }
        }
        if (!w.YT?.Player) return
        const player = new w.YT.Player(iframeRef.current, {
          events: {
            onReady: (event: {target?: {getDuration?: () => number}}) => {
              const duration = event.target?.getDuration?.() ?? player.getDuration()
              if (duration > 0) onDurationChange?.(duration)
            },
            onStateChange: (event: {data?: number}) => {
              if (event.data === 1) { activateRamzyMediaSession(sessionId); setPlaying(true); setFollowActive(true) }
              if (event.data === 2) setPlaying(false)
              if (event.data === 0) { setPlaying(false); onEnded?.() }
            },
          },
        })
        providerControlsRef.current = {
          play: () => player.playVideo(),
          pause: () => player.pauseVideo(),
          togglePlayback: () => {
            if (player.getPlayerState() === 1) player.pauseVideo()
            else player.playVideo()
          },
          seekBy: seconds => player.seekTo(Math.max(0, player.getCurrentTime() + seconds), true),
          volumeBy: amount => player.setVolume(Math.max(0, Math.min(100, player.getVolume() + amount * 100))),
          toggleMute: () => {
            if (player.isMuted()) player.unMute()
            else player.mute()
          },
        }
        cleanup = () => {
          providerControlsRef.current = {
            play: () => undefined,
            pause: () => undefined,
            togglePlayback: () => undefined,
            seekBy: () => undefined,
            volumeBy: () => undefined,
            toggleMute: () => undefined,
          }
          try { player.destroy() } catch {}
        }
      }).catch(() => undefined)
    } else {
      void loadVimeoApi().then(() => {
        if (cancelled || !iframeRef.current) return
        const w = window as typeof window & {
          Vimeo?: {
            Player?: new (element: HTMLIFrameElement) => {
              on: (event: string, callback: (data?: {duration?: number}) => void) => void
              off: (event: string, callback?: (data?: {duration?: number}) => void) => void
              getDuration: () => Promise<number>
              getPaused: () => Promise<boolean>
              getCurrentTime: () => Promise<number>
              setCurrentTime: (seconds: number) => Promise<number>
              getVolume: () => Promise<number>
              setVolume: (volume: number) => Promise<number>
              play: () => Promise<void>
              pause: () => Promise<void>
              destroy: () => Promise<void>
            }
          }
        }
        if (!w.Vimeo?.Player) return
        const player = new w.Vimeo.Player(iframeRef.current)
        const ended = () => { setPlaying(false); onEnded?.() }
        const played = () => { setPlaying(true); setFollowActive(true); activateRamzyMediaSession(sessionId) }
        const paused = () => setPlaying(false)
        player.on('ended', ended)
        player.on('play', played)
        player.on('pause', paused)
        void player.getDuration().then(duration => {
          if (duration > 0) onDurationChange?.(duration)
        }).catch(() => undefined)
        providerControlsRef.current = {
          play: () => { void player.play().catch(() => undefined) },
          pause: () => { void player.pause().catch(() => undefined) },
          togglePlayback: () => {
            void player.getPaused().then(paused => paused ? player.play() : player.pause()).catch(() => undefined)
          },
          seekBy: seconds => {
            void player.getCurrentTime().then(current => player.setCurrentTime(Math.max(0, current + seconds))).catch(() => undefined)
          },
          volumeBy: amount => {
            void player.getVolume().then(current => player.setVolume(Math.max(0, Math.min(1, current + amount)))).catch(() => undefined)
          },
          toggleMute: () => {
            void player.getVolume().then(current => player.setVolume(current > 0 ? 0 : 0.8)).catch(() => undefined)
          },
        }
        cleanup = () => {
          providerControlsRef.current = {
            play: () => undefined,
            pause: () => undefined,
            togglePlayback: () => undefined,
            seekBy: () => undefined,
            volumeBy: () => undefined,
            toggleMute: () => undefined,
          }
          try { player.off('ended', ended) } catch {}
          try { player.off('play', played) } catch {}
          try { player.off('pause', paused) } catch {}
          void player.destroy().catch(() => undefined)
        }
      }).catch(() => undefined)
    }

    return () => {
      cancelled = true
      cleanup()
    }
  }, [embedUrl, resolvedProvider, onEnded, onDurationChange])

  useEffect(() => {
    if (!playRequestToken) return
    providerControlsRef.current.play()
  }, [playRequestToken])

  const floatingFallback =
    followActive &&
    !inlineVisible &&
    !fullscreen &&
    !floatingDismissed &&
    (playing || floatingMounted)

  useEffect(() => {
    if (floatingExitTimer.current) {
      window.clearTimeout(floatingExitTimer.current)
      floatingExitTimer.current = null
    }
    if (floatingFrame.current) {
      window.cancelAnimationFrame(floatingFrame.current)
      floatingFrame.current = null
    }

    if (floatingFallback) {
      setFloatingMounted(true)
      floatingFrame.current = window.requestAnimationFrame(() => {
        setFloatingVisible(true)
        floatingFrame.current = null
      })
      return
    }

    if (floatingMounted) {
      setFloatingVisible(false)
      floatingExitTimer.current = window.setTimeout(() => {
        setFloatingMounted(false)
        floatingExitTimer.current = null
      }, 170)
    }
  }, [floatingFallback, floatingMounted])

  useEffect(() => () => {
    if (floatingExitTimer.current) window.clearTimeout(floatingExitTimer.current)
    if (floatingFrame.current) window.cancelAnimationFrame(floatingFrame.current)
    if (surfaceClickTimer.current) window.clearTimeout(surfaceClickTimer.current)
  }, [])

  function closeFloatingFollow() {
    providerControlsRef.current.pause()
    setPlaying(false)
    setFloatingDismissed(true)
  }

  function handleSurfaceClick() {
    if (surfaceClickTimer.current) window.clearTimeout(surfaceClickTimer.current)
    surfaceClickTimer.current = window.setTimeout(() => {
      surfaceClickTimer.current = null
      providerControlsRef.current.togglePlayback()
    }, 220)
  }

  function handleSurfaceDoubleClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (surfaceClickTimer.current) {
      window.clearTimeout(surfaceClickTimer.current)
      surfaceClickTimer.current = null
    }
    void toggleFullscreen()
  }

  async function toggleFullscreen() {
    const root = rootRef.current
    if (!root) return
    if (pseudoFullscreen) {
      setPseudoFullscreen(false)
      return
    }
    if (document.fullscreenElement) {
      try { await document.exitFullscreen() } catch { setPseudoFullscreen(false) }
      return
    }
    const webkit = root as HTMLDivElement & {webkitRequestFullscreen?: () => Promise<void> | void}
    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen()
        return
      }
      if (webkit.webkitRequestFullscreen) {
        await webkit.webkitRequestFullscreen()
        return
      }
      setPseudoFullscreen(true)
    } catch {
      setPseudoFullscreen(true)
    }
  }

  function handleGlobalShortcut(event: KeyboardEvent) {
    const key = event.key.toLowerCase()
    if (key === ' ' || key === 'k') {
      providerControlsRef.current.togglePlayback()
    } else if (key === 'arrowleft') {
      providerControlsRef.current.seekBy(-5)
    } else if (key === 'arrowright') {
      providerControlsRef.current.seekBy(5)
    } else if (key === 'j') {
      providerControlsRef.current.seekBy(-10)
    } else if (key === 'l') {
      providerControlsRef.current.seekBy(10)
    } else if (key === 'arrowup') {
      providerControlsRef.current.volumeBy(0.05)
    } else if (key === 'arrowdown') {
      providerControlsRef.current.volumeBy(-0.05)
    } else if (key === 'm') {
      providerControlsRef.current.toggleMute()
    } else if (key === 'f') {
      void toggleFullscreen()
    } else if (key === 'escape' && pseudoFullscreen) {
      setPseudoFullscreen(false)
    } else {
      return false
    }
    return true
  }

  shortcutRef.current = handleGlobalShortcut

  useEffect(() => registerRamzyMediaSession(sessionId, {
    pause: () => {
      providerControlsRef.current.pause()
      setFollowActive(false)
    },
    handleShortcut: event => shortcutRef.current(event),
    isShortcutEnabled: () => shortcutEnabledRef.current,
  }), [sessionId])

  return (
    <div
      ref={anchorRef}
      data-ramzy-external-video-anchor="true"
      style={{position:'relative',width:'100%',aspectRatio:'16 / 9',...style}}
    >
    <div
      ref={rootRef}
      data-ramzy-external-video="true"
      data-floating={floatingMounted ? 'true' : undefined}
      onPointerDown={event => event.stopPropagation()}
      onClick={event => event.stopPropagation()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: pseudoFullscreen || floatingMounted ? 'fixed' : 'absolute',
        inset: pseudoFullscreen ? 0 : floatingMounted ? undefined : 0,
        right: floatingMounted ? 20 : undefined,
        bottom: floatingMounted ? 20 : undefined,
        zIndex: pseudoFullscreen ? 2147483000 : floatingMounted ? 2147482400 : undefined,
        width: pseudoFullscreen ? '100vw' : floatingMounted ? 'min(440px, calc(100vw - 32px))' : '100%',
        height: pseudoFullscreen ? '100vh' : floatingMounted ? 'auto' : '100%',
        aspectRatio: pseudoFullscreen ? undefined : '16 / 9',
        overflow: 'hidden',
        borderRadius: fullscreen ? 0 : R.default,
        background: '#111',
        boxShadow: pseudoFullscreen ? '0 0 0 100vmax #000' : floatingMounted ? '0 18px 60px rgba(0,0,0,.38)' : undefined,
        opacity: floatingMounted ? (floatingVisible ? 1 : 0) : 1,
        transition: floatingMounted ? 'opacity 170ms ease' : undefined,
      }}
    >
      {floatingMounted && (
        <div style={{position:'absolute',top:10,left:10,right:10,zIndex:4,display:'flex',alignItems:'center',gap:6,pointerEvents:'none'}}>
          {playlistTrackCount && playlistTrackCount > 1 ? (
            <div style={{minWidth:0,maxWidth:'65%',padding:'6px 9px',borderRadius:999,background:'rgba(15,15,15,.68)',color:'#fff',fontFamily:FONT.body,fontSize:11,fontWeight:650,backdropFilter:'blur(10px)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {playlistTitle || 'Video playlist'} · {playlistIndex !== undefined ? `${playlistIndex + 1} / ${playlistTrackCount}` : `${playlistTrackCount} videos`}
            </div>
          ) : <div />}
          <div style={{marginLeft:'auto',display:'flex',gap:4,pointerEvents:'auto'}}>
            {playlistTrackCount && playlistTrackCount > 1 && (
              <>
                <button type="button" aria-label="Previous video" disabled={!hasPrevious} onClick={event=>{event.stopPropagation();if(hasPrevious)onPrevious?.()}} style={{width:38,height:38,border:'1px solid rgba(255,255,255,.22)',borderRadius:999,background:'rgba(15,15,15,.68)',color:'#fff',display:'grid',placeItems:'center',cursor:hasPrevious?'pointer':'default',opacity:hasPrevious?1:.38,backdropFilter:'blur(10px)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 5v14M18 6.5 9.5 12 18 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button type="button" aria-label="Next video" disabled={!hasNext} onClick={event=>{event.stopPropagation();if(hasNext)onNext?.()}} style={{width:38,height:38,border:'1px solid rgba(255,255,255,.22)',borderRadius:999,background:'rgba(15,15,15,.68)',color:'#fff',display:'grid',placeItems:'center',cursor:hasNext?'pointer':'default',opacity:hasNext?1:.38,backdropFilter:'blur(10px)'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 5v14M6 6.5 14.5 12 6 17.5v-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </>
            )}
            <button type="button" aria-label="Close picture in picture" title="Close picture in picture" onClick={event=>{event.stopPropagation();closeFloatingFollow()}} style={{width:38,height:38,border:'1px solid rgba(255,255,255,.22)',borderRadius:999,background:'rgba(15,15,15,.68)',color:'#fff',display:'grid',placeItems:'center',cursor:'pointer',backdropFilter:'blur(10px)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        id={playerId}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          position:'absolute',
          inset:0,
          width:'100%',
          height:'100%',
          border:0,
        }}
      />

      <div
        aria-hidden="true"
        onClick={event => { event.stopPropagation(); handleSurfaceClick() }}
        onDoubleClick={handleSurfaceDoubleClick}
        style={{position:'absolute',left:0,right:0,top:0,bottom:64,zIndex:1,cursor:'pointer',background:'transparent'}}
      />

      <button
        type="button"
        aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        onClick={event => {
          event.stopPropagation()
          void toggleFullscreen()
        }}
        style={{
          position:'absolute',
          top:floatingMounted ? 56 : 12,
          right:12,
          width:42,
          height:42,
          border:'1px solid rgba(255,255,255,.22)',
          borderRadius:999,
          background:'rgba(15,15,15,.68)',
          color:'#fff',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          cursor:'pointer',
          opacity:hovered || pseudoFullscreen ? 1 : 0,
          transform:hovered || pseudoFullscreen ? 'translateY(0)' : 'translateY(-4px)',
          transition:'opacity 140ms ease, transform 140ms ease',
          backdropFilter:'blur(10px)',
          zIndex:2,
        }}
      >
        <FullscreenIcon exit={fullscreen}/>
      </button>
    </div>
    </div>
  )
}
