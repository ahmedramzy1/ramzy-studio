import type { AnyExtension } from "@tiptap/core";
import { UniqueID } from "../unique-id";

/**
 * Ramzy Studio's portfolio editor is an explicit editor profile, not a route or
 * URL convention. Build and readonly rendering must both opt into this profile.
 */
export const RAMZY_PORTFOLIO_PROFILE = "portfolio" as const;

export type RamzyEditorProfile = typeof RAMZY_PORTFOLIO_PROFILE;

export interface PortfolioReadonlyExtensionOptions {
  /**
   * Print/export rendering removes interactions that only make sense on an
   * on-screen readonly table.
   */
  printMode?: boolean;
}

/**
 * Build and Preview intentionally start from the same complete extension set.
 * This function only changes behaviour that must differ in a readonly surface;
 * it never creates a reduced portfolio schema.
 *
 * Keeping this policy in the shared extension package prevents the website,
 * preview and standalone Ramzy Studio app from independently inventing render
 * rules as the product grows.
 */
export function createPortfolioReadonlyExtensions(
  baseExtensions: AnyExtension[],
  options: PortfolioReadonlyExtensionOptions = {},
): AnyExtension[] {
  const { printMode = false } = options;

  const excludedExtensions = new Set([
    "uniqueID",
    ...(printMode ? ["tableHeaderPin", "tableReadonlySort"] : []),
  ]);

  const extensions = baseExtensions.filter(
    (extension) => !excludedExtensions.has(extension.name),
  );

  return [
    ...extensions,
    UniqueID.configure({
      types: ["heading", "paragraph"],
      updateDocument: false,
    }),
  ];
}
