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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    shell: false,
  });

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(
      `${command} ${args.join(' ')} failed${detail ? `\n${detail}` : ''}`,
    );
  }

  return result.stdout?.trim() ?? '';
}

function writePackageManifest(entry) {
  const manifest = {
    name: '@ramzy-studio/portfolio-runtime',
    version: '0.1.0',
    type: 'module',
    main: `./${entry}`,
    module: `./${entry}`,
    exports: {
      '.': `./${entry}`,
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
    ['-c', 'user.name=Ramzy Studio Runtime', '-c', 'user.email=runtime@local.invalid', 'commit', '-m', `Portfolio runtime from ${sourceCommit}`],
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
