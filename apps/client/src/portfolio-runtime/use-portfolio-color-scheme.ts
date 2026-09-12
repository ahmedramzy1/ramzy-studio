import { useSyncExternalStore } from "react";

export type PortfolioColorScheme = "light" | "dark";

// The host owns the preference. Do not read/write Mantine's independent local
// storage preference or feed our own data-mantine-color-scheme back into it.
function snapshot(): PortfolioColorScheme {
  const host = document.documentElement.getAttribute("data-theme");
  if (host === "light" || host === "dark") return host;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function subscribe(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener("change", notify);
  return () => { observer.disconnect(); media?.removeEventListener("change", notify); };
}
export function usePortfolioColorScheme(explicit?: PortfolioColorScheme): PortfolioColorScheme {
  const host = useSyncExternalStore(subscribe, snapshot, () => "light" as const);
  return explicit ?? host;
}
