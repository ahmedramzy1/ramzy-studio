import { describe, expect, it, vi } from "vitest";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds: number[] = [];

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

describe("portfolio dnd manager lifecycle", () => {
  it("supports a second drag after entities are rebuilt following a drop", async () => {
    const { DragDropManager, Draggable, Droppable } = await import("@dnd-kit/dom");
    const manager = new DragDropManager({ plugins: [], sensors: [] });
    let completedDrops = 0;
    const cleanup = manager.monitor.addEventListener("dragend", () => {
      completedDrops += 1;
    });

    const runDrag = async () => {
      const sourceElement = document.createElement("div");
      const targetElement = document.createElement("div");
      document.body.append(sourceElement, targetElement);
      const source = new Draggable(
        { id: "source", element: sourceElement, type: "portfolio" },
        manager,
      );
      const target = new Droppable(
        { id: "target", element: targetElement, type: "portfolio" },
        manager,
      );
      source.register();
      target.register();

      manager.actions.start({ source, coordinates: { x: 0, y: 0 } });
      await manager.actions.setDropTarget(target.id);
      manager.actions.stop();
      await Promise.resolve();

      source.destroy();
      target.destroy();
      sourceElement.remove();
      targetElement.remove();
    };

    await runDrag();
    await runDrag();

    expect(completedDrops).toBe(2);
    expect(manager.dragOperation.status.idle).toBe(true);
    cleanup();
    manager.destroy();
  });
});
