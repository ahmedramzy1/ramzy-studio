import type { ComponentType } from 'react';

export type RamzyPortfolioDocument = Record<string, unknown>;
export type RamzyPortfolioSaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface RamzyPortfolioUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface RamzyPortfolioSession {
  accessToken: string;
  collaborationToken: string;
  user: RamzyPortfolioUser;
  apiUrl: string;
  collaborationUrl: string;
  expiresAt: string;
}

export interface RamzyPortfolioSessionRequest {
  pageId: string;
  websiteAccessToken?: string;
}

export interface RamzyPortfolioSessionResponse {
  session: RamzyPortfolioSession;
  document: {
    id: string;
    title: string;
    content: RamzyPortfolioDocument | null;
    updatedAt?: string;
  };
}

export interface PortfolioOutlineItem {
  id: string;
  label: string;
  level: number;
}

export interface PortfolioOutlineOptions {
  levels?: number[];
}

export interface RamzyStudioPortfolioHeaderActions {
  openHistory: () => void;
  addSection: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface RamzyStudioPortfolioEditorProps {
  pageId: string;
  session: RamzyPortfolioSession;
  initialContent?: RamzyPortfolioDocument | null;
  editable?: boolean;
  onCreate?: (editor: unknown) => void;
  onEditorChange?: (editor: unknown | null) => void;
  onUpdate?: (content: RamzyPortfolioDocument, editor: unknown) => void;
  onHeaderActionsChange?: (actions: RamzyStudioPortfolioHeaderActions | null) => void;
  onSessionExpired?: () =>
    | Promise<RamzyPortfolioSession | void>
    | RamzyPortfolioSession
    | void;
  onSaveStateChange?: (state: RamzyPortfolioSaveState, error?: string) => void;
}

export interface RamzyStudioPortfolioRendererProps {
  content: RamzyPortfolioDocument | null | undefined;
  pageId?: string;
  shareId?: string;
  printMode?: boolean;
  onCreate?: (editor: unknown) => void;
  session?: RamzyPortfolioSession;
  apiUrl?: string;
  withProviders?: boolean;
}

export interface RamzyPortfolioEditorProps extends RamzyStudioPortfolioEditorProps {}

export declare const RamzyStudioPortfolioEditor: ComponentType<RamzyStudioPortfolioEditorProps>;
export declare const RamzyStudioPortfolioRenderer: ComponentType<RamzyStudioPortfolioRendererProps>;
export declare const RamzyPortfolioEditor: ComponentType<RamzyPortfolioEditorProps>;

export declare function extractPortfolioOutline(
  document: RamzyPortfolioDocument | null | undefined,
  options?: PortfolioOutlineOptions,
): PortfolioOutlineItem[];

export declare const RAMZY_PORTFOLIO_ENGINE_API_VERSION: 1;
