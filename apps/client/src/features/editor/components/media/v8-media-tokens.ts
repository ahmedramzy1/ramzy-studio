// Canonical media-facing subset of ahmedramzy.com v8.0.0 design-system tokens.
// Source: release commit 2beb19718c9192d75cbd6929d9762fb64909253b.

export const SIGNAL = "#3B5BFF";
export const SIGNAL_DIM = "#2A44CC";
export const ON_SIGNAL = "#FFFFFF";

const N = {
  n0: "#FFFFFF",
  n25: "#FDFCFA",
  n50: "#F8F6F1",
  n100: "#F0EDE6",
  n200: "#E0DDD5",
  n300: "#C8C5BC",
  n400: "#A8A59C",
  n500: "#88857C",
  n600: "#68655C",
  n700: "#4A4844",
  n800: "#333130",
  n900: "#252422",
  n950: "#1D1D1B",
} as const;

const S = {
  s50: "#EEF1FF",
  s100: "#D8DEFF",
  s200: "#B4BFFF",
  s300: "#8FA3FF",
  s400: "#6B84FF",
  s500: "#3B5BFF",
  s600: "#2A44CC",
  s700: "#1D30A3",
  s800: "#12207A",
  s900: "#0A1452",
} as const;

const SEMANTIC = {
  success: "#16A34A",
  successLight: "#DCFCE7",
  warning: "#CA8A04",
  warningLight: "#FEF9C3",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  info: "#0EA5E9",
  infoLight: "#E0F2FE",
} as const;

export type DsMode = "light" | "dark";

export const FONT = {
  display: "'Fraunces', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
} as const;

export const R = {
  none: 0,
  xs: 2,
  sm: 4,
  compact: 6,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export function dsTheme(mode: DsMode) {
  const d = mode === "dark";
  return {
    bg: d ? N.n950 : N.n0,
    bgSurface: d ? N.n900 : N.n25,
    bgSubtle: d ? N.n800 : N.n50,
    bgInverse: d ? N.n100 : N.n950,
    bgCanvas: d ? "#1C1C1E" : "#F3F0E8",
    bgElevated: d ? "#262628" : N.n0,
    bgAlt: d ? "#141416" : N.n200,
    textPrimary: d ? N.n50 : N.n950,
    textSecondary: d ? N.n400 : N.n600,
    textTertiary: d ? N.n600 : N.n400,
    textDisabled: d ? N.n700 : N.n300,
    textInverse: d ? N.n950 : N.n50,
    textMuted: d ? "rgba(237,233,224,0.20)" : "rgba(29,29,27,0.20)",
    textBrand: SIGNAL,
    textLink: SIGNAL,
    textError: SEMANTIC.error,
    textSuccess: SEMANTIC.success,
    borderDefault: d ? N.n700 : N.n200,
    borderStrong: d ? N.n600 : N.n400,
    borderSubtle: d ? N.n800 : N.n100,
    borderFocus: SIGNAL,
    borderError: SEMANTIC.error,
    borderSuccess: SEMANTIC.success,
    borderHair: d ? "rgba(237,233,224,0.08)" : "rgba(29,29,27,0.08)",
    borderMid: d ? "rgba(237,233,224,0.22)" : "rgba(29,29,27,0.20)",
    btnPrimary: d ? "#EDE9E0" : N.n950,
    btnPrimaryText: d ? N.n950 : N.n0,
    bgBrand: SIGNAL,
    actionPrimary: SIGNAL,
    actionPrimaryText: ON_SIGNAL,
    actionPrimaryHover: SIGNAL_DIM,
    actionSecondary: d ? N.n800 : N.n100,
    actionSecondaryHover: d ? N.n700 : N.n200,
    elev1: d ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(29,29,27,0.08)",
    elev2: d ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(29,29,27,0.1)",
    elev3: d ? "0 8px 24px rgba(0,0,0,0.55)" : "0 8px 24px rgba(29,29,27,0.12)",
    elev4: d ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(29,29,27,0.14)",
    errorBg: d ? "#2D1B1B" : SEMANTIC.errorLight,
    successBg: d ? "#14261A" : SEMANTIC.successLight,
    warningBg: d ? "#2A2000" : SEMANTIC.warningLight,
    infoBg: d ? "#001A2D" : SEMANTIC.infoLight,
    errorBorder: d ? "#7F1D1D" : "#FECACA",
    successBorder: d ? "#14532D" : "#BBF7D0",
    warningBorder: d ? "#78350F" : "#FDE68A",
    infoBorder: d ? "#075985" : "#BAE6FD",
    errorText: SEMANTIC.error,
    successText: d ? "#4ADE80" : SEMANTIC.success,
    warningText: SEMANTIC.warning,
    infoText: SEMANTIC.info,
    signalBg: d ? S.s900 : S.s50,
    signalText: d ? S.s200 : S.s600,
  };
}
