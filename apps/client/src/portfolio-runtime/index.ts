import "@/features/editor/styles/index.css";
import "@/features/editor/styles/portfolio-embedded.css";

export {
  RamzyStudioPortfolioEditor,
  type RamzyStudioPortfolioEditorProps,
} from "@/portfolio-runtime/portfolio-editor-with-history";

export {
  type RamzyPortfolioSaveState,
} from "@/features/editor/portfolio/portfolio-editor";

export {
  buildPortfolioTestProjectDocument,
  PORTFOLIO_TEST_PROJECT_KEYS,
  PORTFOLIO_TEST_PROJECT_COVERAGE,
  type PortfolioTestProjectKey,
} from "@/features/editor/portfolio/test-projects";

export {
  RamzyStudioPortfolioRenderer,
  type RamzyStudioPortfolioRendererProps,
} from "@/features/editor/portfolio/portfolio-renderer";

export {
  RamzyPortfolioEditor,
  type RamzyPortfolioEditorProps,
  extractPortfolioOutline,
  type PortfolioOutlineItem,
  type PortfolioOutlineOptions,
  type RamzyPortfolioDocument,
  type RamzyPortfolioSession,
  type RamzyPortfolioSessionRequest,
  type RamzyPortfolioSessionResponse,
  type RamzyPortfolioUser,
  RAMZY_PORTFOLIO_ENGINE_API_VERSION,
} from "@docmost/editor-ext/portfolio";
