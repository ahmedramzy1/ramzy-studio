import { Youtube } from "@tiptap/extension-youtube";

/**
 * TipTap's stock YouTube node is draggable from the iframe surface itself.
 * That conflicts with native YouTube controls: timeline scrubbing, fullscreen,
 * and overlay controls all begin with pointer gestures inside the iframe.
 *
 * Ramzy Studio already owns block reordering through its dedicated global drag
 * handle, so the media surface itself should remain purely interactive.
 */
export const InteractiveYoutube = Youtube.extend({
  draggable: false,
});

export default InteractiveYoutube;
