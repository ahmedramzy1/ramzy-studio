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
      "--ramzy-element-focus": c.borderFocus,
      "--ramzy-element-muted": c.textSecondary,
      "--ramzy-element-error": c.errorText,
      "--ramzy-element-success": c.successText,
      "--ramzy-element-link": c.textLink,
      "--mantine-color-anchor": c.textLink,
      "--mantine-color-error": c.errorText,
      "--mantine-primary-color-light-color": c.signalText,
      "--mantine-color-blue-light-color": c.signalText,
      "--mantine-primary-color-light": name === "dark" ? "rgba(107,132,255,.18)" : "rgba(59,91,255,.10)",
      "--mantine-color-blue-light": name === "dark" ? "rgba(107,132,255,.18)" : "rgba(59,91,255,.10)",
      "--mantine-color-red-light-color": c.errorText,
    };
  }
  return {
    variables: { ...base.variables, "--ramzy-element-signal": SIGNAL },
    light: mode("light"),
    dark: mode("dark"),
  };
};
