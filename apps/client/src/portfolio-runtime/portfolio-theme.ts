import type { CSSVariablesResolver } from "@mantine/core";
import { mantineCssResolver } from "@/theme";
import {
  dsTheme,
  SIGNAL,
} from "@/features/editor/components/media/v8-media-tokens";

// Reuse the existing canonical adapter. Do not add a second palette here.
export const portfolioCssResolver: CSSVariablesResolver = (theme) => {
  const base = mantineCssResolver(theme);
  function mode(name: "light" | "dark") {
    const c = dsTheme(name);
    return {
      ...base[name],
      "--mantine-color-body": c.bg,
      "--mantine-color-text": c.textPrimary,
      "--mantine-color-dimmed": c.textSecondary,
      "--mantine-color-placeholder": c.textSecondary,
      "--mantine-color-default": c.bgSurface,
      "--mantine-color-default-color": c.textPrimary,
      "--mantine-color-default-border": c.borderDefault,
      "--mantine-color-default-hover": c.bgSubtle,
      "--ramzy-element-surface": c.bgSurface,
      "--ramzy-element-border": c.borderDefault,
      "--ramzy-element-shadow": c.elev2,
    };
  }
  return {
    variables: { ...base.variables, "--ramzy-element-signal": SIGNAL },
    light: mode("light"),
    dark: mode("dark"),
  };
};
