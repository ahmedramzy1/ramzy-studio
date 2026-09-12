import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { Portal, useComputedColorScheme } from "@mantine/core";
import { PortfolioRuntimeProviders } from "./runtime-providers";

function Probe() {
  const mode = useComputedColorScheme("light");
  return <><span data-testid="content-theme">{mode}</span><Portal><span data-testid="portal-theme">{mode}</span></Portal></>;
}
beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn().mockImplementation(query => ({
    matches: true, media: query, addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {},
  })));
});
afterEach(() => { cleanup(); document.documentElement.removeAttribute("data-theme"); vi.unstubAllGlobals(); });

it("starts in the host theme and updates content plus body portals live", async () => {
  document.documentElement.setAttribute("data-theme", "dark");
  render(<PortfolioRuntimeProviders><Probe /></PortfolioRuntimeProviders>);
  expect(screen.getByTestId("content-theme").textContent).toBe("dark");
  expect(screen.getByTestId("portal-theme").textContent).toBe("dark");
  expect(document.documentElement.getAttribute("data-mantine-color-scheme")).toBe("dark");
  await act(async () => { document.documentElement.setAttribute("data-theme", "light"); });
  await waitFor(() => expect(screen.getByTestId("portal-theme").textContent).toBe("light"));
  expect(screen.getByTestId("content-theme").textContent).toBe("light");
  expect(document.documentElement.getAttribute("data-mantine-color-scheme")).toBe("light");
});
it("supports an explicit host prop without resetting mounted children", () => {
  document.documentElement.setAttribute("data-theme", "light");
  const mounted = vi.fn();
  function Child() { React.useEffect(() => { mounted(); }, []); return <Probe />; }
  const result = render(<PortfolioRuntimeProviders colorScheme="dark"><Child /></PortfolioRuntimeProviders>);
  expect(screen.getByTestId("portal-theme").textContent).toBe("dark");
  result.rerender(<PortfolioRuntimeProviders colorScheme="light"><Child /></PortfolioRuntimeProviders>);
  expect(screen.getByTestId("portal-theme").textContent).toBe("light");
  expect(mounted).toHaveBeenCalledTimes(1);
});
it("uses the system preference when the host has not set a theme", () => {
  render(<PortfolioRuntimeProviders><Probe /></PortfolioRuntimeProviders>);
  expect(screen.getByTestId("content-theme").textContent).toBe("dark");
});
