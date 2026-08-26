// ─── RAMZY MEDIA SESSION ────────────────────────────────────────────────────
// Ported from ahmedramzy.com v8.0.0 (2beb19718c9192d75cbd6929d9762fb64909253b).
// Global playback arbitration for every Ramzy media player on the page.
//
// Rules:
// - Only one media session may play at a time.
// - The media that most recently entered "playing" becomes the active session.
// - Activating a session pauses the previously active session.
// - Page-level keyboard shortcuts are routed only while the active *inline*
//   player is actually visible in the viewport.
// - Modal viewing surfaces always own their keys.
// - Form fields/contentEditable keep their native keyboard behaviour.

export interface RamzyMediaSessionControls {
  pause: () => void;
  handleShortcut?: (event: KeyboardEvent) => boolean | void;
  isShortcutEnabled?: () => boolean;
}

const sessions = new Map<string, RamzyMediaSessionControls>();
let activeSessionId: string | null = null;
let listening = false;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function hasActiveModalSurface() {
  if (typeof document === "undefined") return false;
  return !!document.querySelector(
    '[data-ramzy-photo-viewer="true"], [role="dialog"][aria-modal="true"]',
  );
}

function handleGlobalKeyDown(event: KeyboardEvent) {
  if (!activeSessionId) return;
  if (event.defaultPrevented) return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (isEditableTarget(event.target)) return;
  if (hasActiveModalSurface()) return;
  if (
    event.target instanceof HTMLElement &&
    event.target.tagName === "BUTTON" &&
    (event.key === " " || event.key === "Enter")
  ) {
    return;
  }

  const session = sessions.get(activeSessionId);
  if (!session?.handleShortcut) return;
  if (session.isShortcutEnabled && !session.isShortcutEnabled()) return;

  const handled = session.handleShortcut(event);
  if (handled) event.preventDefault();
}

function ensureListener() {
  if (listening || typeof window === "undefined") return;
  window.addEventListener("keydown", handleGlobalKeyDown);
  listening = true;
}

function removeListenerIfUnused() {
  if (!listening || sessions.size > 0 || typeof window === "undefined") return;
  window.removeEventListener("keydown", handleGlobalKeyDown);
  listening = false;
}

export function registerRamzyMediaSession(
  id: string,
  controls: RamzyMediaSessionControls,
) {
  sessions.set(id, controls);
  ensureListener();

  return () => {
    sessions.delete(id);
    if (activeSessionId === id) activeSessionId = null;
    removeListenerIfUnused();
  };
}

export function activateRamzyMediaSession(id: string) {
  if (activeSessionId === id) return;

  const previousId = activeSessionId;
  activeSessionId = id;

  if (previousId) {
    const previous = sessions.get(previousId);
    try {
      previous?.pause();
    } catch {
      // A stale/unmounted media node should never block the new session.
    }
  }
}

export function isRamzyMediaSessionActive(id: string) {
  return activeSessionId === id;
}
