export {
  RamzyPortfolioEditor,
  type RamzyPortfolioEditorProps,
} from "./editor";

export {
  RamzyPortfolioRenderer,
  type RamzyPortfolioRendererProps,
} from "./renderer";

export {
  createPortfolioReadonlyExtensions,
  type PortfolioReadonlyExtensionOptions,
} from "./extension-profile";

export {
  extractPortfolioOutline,
  type PortfolioOutlineItem,
  type PortfolioOutlineOptions,
} from "./outline";

/**
 * Versioned contract for hosts that consume the Ramzy Studio portfolio engine.
 *
 * Increment this only when a host-facing document/runtime contract changes in a
 * backwards-incompatible way. It is intentionally independent from Docmost's
 * application version so ahmedramzy.com can validate compatibility explicitly.
 */
export const RAMZY_PORTFOLIO_ENGINE_API_VERSION = 1 as const;
