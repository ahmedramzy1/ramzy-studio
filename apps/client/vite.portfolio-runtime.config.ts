import {
  defineConfig,
  esmExternalRequirePlugin,
  loadEnv,
} from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "node:fs";
import { createRequire } from "node:module";
import * as path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "..", "..");
const clientRequire = createRequire(path.resolve(process.cwd(), "package.json"));

const hostExternals = [
  /^react(?:\/|$)/,
  /^react-dom(?:\/|$)/,
  /^react-router-dom(?:\/|$)/,
];

const prosemirrorModules = [
  ["changeset", "prosemirror-changeset"],
  ["commands", "prosemirror-commands"],
  ["dropcursor", "prosemirror-dropcursor"],
  ["gapcursor", "prosemirror-gapcursor"],
  ["history", "prosemirror-history"],
  ["inputrules", "prosemirror-inputrules"],
  ["keymap", "prosemirror-keymap"],
  ["model", "prosemirror-model"],
  ["schema-list", "prosemirror-schema-list"],
  ["state", "prosemirror-state"],
  ["tables", "prosemirror-tables"],
  ["transform", "prosemirror-transform"],
  ["view", "prosemirror-view"],
] as const;

function esmEntry(moduleId: string): string {
  const resolved = clientRequire.resolve(moduleId);

  // ProseMirror packages expose CommonJS as their `require` target and ESM as
  // the sibling dist/index.js import target. Vite may load this config through
  // a CommonJS wrapper, so import.meta.resolve is unavailable here. Resolve the
  // package from the client dependency graph and explicitly select its ESM
  // sibling instead.
  if (resolved.endsWith(".cjs")) {
    const esm = resolved.slice(0, -4) + ".js";
    if (fs.existsSync(esm)) return esm;
  }

  return resolved;
}

// @tiptap/pm/* is intentionally a thin re-export layer over ProseMirror.
// Rolldown can otherwise follow a CommonJS request through that wrapper while
// a direct ProseMirror import follows the package ESM entry. Both point to the
// same installed version but become different runtime identities. ProseMirror
// DecorationSet/DecorationGroup use instanceof checks, so mixing those copies
// crashes Suggestion/slash-menu decorations while reading `localsInner`.
//
// Route BOTH spellings to the exact same ESM physical entry. This is stronger
// than resolve.dedupe: dedupe unifies package roots, but cannot merge a package's
// distinct index.cjs and index.js files once both have entered the graph.
const prosemirrorAliases = prosemirrorModules.flatMap(
  ([subpath, packageName]) => {
    const entry = esmEntry(packageName);
    return [
      { find: `@tiptap/pm/${subpath}`, replacement: entry },
      { find: packageName, replacement: entry },
    ];
  },
);

const editorSingletons = [
  "@tiptap/core",
  "@tiptap/pm",
  "@tiptap/react",
  "@tiptap/suggestion",
  ...prosemirrorModules.map(([, packageName]) => packageName),
  "y-prosemirror",
  "yjs",
];

export default defineConfig(({ mode }) => {
  const {
    APP_URL,
    FILE_UPLOAD_SIZE_LIMIT,
    FILE_IMPORT_SIZE_LIMIT,
    DRAWIO_URL,
    CLOUD,
    SUBDOMAIN_HOST,
    COLLAB_URL,
    BILLING_TRIAL_DAYS,
    POSTHOG_HOST,
    POSTHOG_KEY,
    AI_VECTOR_DRIVER,
  } = loadEnv(mode, workspaceRoot, "");

  return {
    // This is a reusable library build, not the standalone Ramzy Studio web
    // application. Do not copy PWA icons, manifests, locale JSON, or other
    // public/ assets into the package distribution automatically.
    publicDir: false,
    define: {
      "process.env": {
        APP_URL,
        FILE_UPLOAD_SIZE_LIMIT,
        FILE_IMPORT_SIZE_LIMIT,
        DRAWIO_URL,
        CLOUD,
        SUBDOMAIN_HOST,
        COLLAB_URL,
        BILLING_TRIAL_DAYS,
        POSTHOG_HOST,
        POSTHOG_KEY,
        AI_VECTOR_DRIVER,
      },
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      // Rolldown intentionally preserves CommonJS require() semantics for
      // externals by default. A browser library cannot execute require('react'),
      // so let Rolldown's official bridge own React/router externals and turn
      // any CJS require() calls into ESM imports. This handles every bundled
      // dependency, not only use-sync-external-store.
      esmExternalRequirePlugin({ external: hostExternals }),
      react(),
    ],
    resolve: {
      alias: [
        ...prosemirrorAliases,
        { find: "@", replacement: path.resolve(process.cwd(), "src") },
      ],
      dedupe: editorSingletons,
    },
    build: {
      outDir: "dist-portfolio-runtime",
      emptyOutDir: true,
      // Shipping source maps multiplied the private runtime artifact size and
      // exposed implementation source without helping the consuming website.
      sourcemap: false,
      lib: {
        entry: path.resolve(process.cwd(), "src/portfolio-runtime/index.ts"),
        formats: ["es"],
        fileName: "index",
        cssFileName: "style",
      },
    },
  };
});
