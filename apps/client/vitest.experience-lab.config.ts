import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vitest.config';
import path from 'node:path';
export default mergeConfig(base, defineConfig({
  test: {
    include: ['src/features/editor/portfolio/experience-lab-mount.integration.tsx'],
    // These browser packages use extensionless ESM imports. Transform them
    // through Vite just as the application does instead of Node's loader.
    server: { deps: { inline: [/@excalidraw\/excalidraw/, /roughjs/] } },
  },
  resolve: {
    alias: [
      { find: '@docmost/editor-ext/portfolio', replacement: path.resolve(__dirname, '../../packages/editor-ext/src/lib/portfolio/index.ts') },
      { find: '@docmost/editor-ext', replacement: path.resolve(__dirname, '../../packages/editor-ext/src/index.ts') },
    ],
  },
}));
