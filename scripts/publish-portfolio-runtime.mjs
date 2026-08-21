import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'apps', 'client', 'dist-portfolio-runtime');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ramzy-portfolio-runtime-'));
const isWindows = process.platform === 'win32';
const pnpm = isWindows ? 'pnpm.cmd' : 'pnpm';

function quoteWindowsArg(value) {
  const arg = String(value);
  if (!/[\s"&|<>^]/.test(arg)) return arg;
  return `"${arg.replace(/"/g, '\\"')}"`;
}

function run(command, args, options = {}) {
  const cwd = options.cwd ?? root;
  const stdio = options.capture ? 'pipe' : 'inherit';

  // Newer Node versions on Windows do not reliably spawn .cmd shims directly.
  // Route only .cmd commands through cmd.exe; native executables such as git
  // continue to use spawnSync directly so argument handling stays predictable.
  const shouldUseCmd = isWindows && command.toLowerCase().endsWith('.cmd');
  const result = shouldUseCmd
    ? spawnSync(
        process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe',
        [
          '/d',
          '/s',
          '/c',
          [command, ...args].map(quoteWindowsArg).join(' '),
        ],
        {
          cwd,
          stdio,
          encoding: 'utf8',
          windowsHide: true,
        },
      )
    : spawnSync(command, args, {
        cwd,
        stdio,
        encoding: 'utf8',
        shell: false,
        windowsHide: isWindows,
      });

  if (result.error) {
    throw new Error(
      `${command} ${args.join(' ')} could not start: ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(
      `${command} ${args.join(' ')} failed${detail ? `\n${detail}` : ''}`,
    );
  }

  return result.stdout?.trim() ?? '';
}

function writePublicTypes() {
  const declarations = `import type { ComponentType } from 'react';

export type RamzyPortfolioDocument = Record<string, unknown>;

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

export interface RamzyStudioPortfolioEditorProps {
  pageId: string;
  session: RamzyPortfolioSession;
  initialContent?: RamzyPortfolioDocument | null;
  editable?: boolean;
  onCreate?: (editor: unknown) => void;
  onUpdate?: (content: RamzyPortfolioDocument, editor: unknown) => void;
  onSessionExpired?: () => void;
}

export interface RamzyStudioPortfolioRendererProps {
  content: RamzyPortfolioDocument | null | undefined;
  pageId?: string;
  shareId?: string;
  printMode?: boolean;
  onCreate?: (editor: unknown) => void;
  session?: RamzyPortfolioSession;
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
`;

  fs.writeFileSync(path.join(tempDir, 'index.d.ts'), declarations);
}

function writePackageManifest(entry) {
  const manifest = {
    name: '@ramzy-studio/portfolio-runtime',
    version: '0.1.0',
    type: 'module',
    main: `./${entry}`,
    module: `./${entry}`,
    types: './index.d.ts',
    exports: {
      '.': {
        types: './index.d.ts',
        import: `./${entry}`,
        default: `./${entry}`,
      },
      './style.css': './style.css',
    },
    peerDependencies: {
      react: '^19.2.0',
      'react-dom': '^19.2.0',
      'react-router-dom': '^7.18.0',
    },
  };

  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

try {
  console.log('\nBuilding Ramzy Studio portfolio runtime…\n');
  run(pnpm, ['run', 'portfolio-runtime:build']);

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Runtime build output was not found at ${sourceDir}`);
  }

  fs.cpSync(sourceDir, tempDir, { recursive: true });

  const entry = fs.existsSync(path.join(tempDir, 'index.mjs'))
    ? 'index.mjs'
    : fs.existsSync(path.join(tempDir, 'index.js'))
      ? 'index.js'
      : null;

  if (!entry) {
    throw new Error('Runtime build did not produce index.mjs or index.js');
  }

  writePublicTypes();
  writePackageManifest(entry);

  const sourceCommit = run('git', ['rev-parse', 'HEAD'], { capture: true });
  const sourceRemote = run('git', ['remote', 'get-url', 'origin'], {
    capture: true,
  });

  fs.writeFileSync(
    path.join(tempDir, 'RAMZY_RUNTIME_SOURCE_COMMIT'),
    `${sourceCommit}\n`,
  );

  run('git', ['init', '-b', 'portfolio-runtime-dist'], { cwd: tempDir });
  run('git', ['add', '--all'], { cwd: tempDir });
  run(
    'git',
    [
      '-c',
      'user.name=Ramzy Studio Runtime',
      '-c',
      'user.email=runtime@local.invalid',
      'commit',
      '-m',
      `Portfolio runtime from ${sourceCommit}`,
    ],
    { cwd: tempDir },
  );
  run('git', ['remote', 'add', 'origin', sourceRemote], { cwd: tempDir });
  run('git', ['push', '--force', 'origin', 'portfolio-runtime-dist'], {
    cwd: tempDir,
  });

  console.log('\nPortfolio runtime published successfully.');
  console.log(`Source commit: ${sourceCommit}`);
  console.log('Distribution branch: portfolio-runtime-dist\n');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
