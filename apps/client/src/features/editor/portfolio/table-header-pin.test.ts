import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TablePinController } from "../../../../../../packages/editor-ext/src/lib/table/header-pin/controller";

describe("responsive table header pinning", () => {
  let controller: TablePinController;
  let wrapper: HTMLDivElement;
  let table: HTMLTableElement;
  let fits: (entries: unknown[]) => void;
  let resized: () => void;
  let scrolling = true;

  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: typeof fits) {
          fits = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          resized = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        ({
          overflowX: scrolling ? "auto" : "visible",
          overflowY: scrolling ? "auto" : "visible",
        }) as CSSStyleDeclaration,
    );
    wrapper = document.createElement("div");
    wrapper.innerHTML =
      "<table><tbody><tr><th>Device</th><th>Status</th></tr><tr><td>Desktop</td><td>Pending</td></tr><tr><td>iPad</td><td>Pending</td></tr></tbody></table>";
    table = wrapper.querySelector("table")!;
    document.body.append(wrapper);
    Object.defineProperty(wrapper, "clientWidth", { value: 400 });
    Object.defineProperty(table, "scrollWidth", { value: 400 });
    vi.spyOn(table, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 650,
      height: 150,
      width: 400,
    } as DOMRect);
    vi.spyOn(table.rows[0], "getBoundingClientRect").mockReturnValue({
      height: 40,
    } as DOMRect);
    scrolling = true;
    controller = new TablePinController(wrapper, table);
  });

  afterEach(() => {
    controller.destroy();
    wrapper.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("never uses native sticky against a compact table's own scroll wrapper", () => {
    fits([
      { isIntersecting: true, boundingClientRect: { width: 400, height: 150 } },
    ]);
    expect(wrapper.classList.contains("tableHeaderPinned")).toBe(true);
    expect(wrapper.classList.contains("tableWrapperNoOverflow")).toBe(false);
    expect(wrapper.style.getPropertyValue("--table-pin-offset")).toBe("");
  });

  it("re-evaluates actual overflow when a column is resized", () => {
    scrolling = false;
    resized();
    expect(wrapper.classList.contains("tableWrapperNoOverflow")).toBe(true);
    scrolling = true;
    resized();
    expect(wrapper.classList.contains("tableWrapperNoOverflow")).toBe(false);
    expect(wrapper.style.getPropertyValue("--table-pin-offset")).toBe("");
  });

  it("pins only after the table crosses the viewport pin line and clears on return", () => {
    resized();
    vi.spyOn(table, "getBoundingClientRect").mockReturnValue({
      top: 20,
      bottom: 170,
      height: 150,
      width: 400,
    } as DOMRect);
    controller.updateFallbackOffset();
    expect(wrapper.style.getPropertyValue("--table-pin-offset")).toBe("25px");
    vi.spyOn(table, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 650,
      height: 150,
      width: 400,
    } as DOMRect);
    controller.updateFallbackOffset();
    expect(wrapper.style.getPropertyValue("--table-pin-offset")).toBe("");
  });
});
