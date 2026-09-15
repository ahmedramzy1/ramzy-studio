import type { Node } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { TableMap } from "@tiptap/pm/tables";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/** Mark the actual perimeter, including corners owned by row/column spans.
 * Decorations are view-only: no document attributes, undo steps or sync writes.
 * Keeping overflow visible preserves sticky headers and resize/drag controls.
 */
export function tableSurfaceDecorations(doc: Node): DecorationSet {
  const decorations: Decoration[] = [];
  doc.descendants((table, pos) => {
    if (table.type.spec.tableRole !== "table") return;
    const map = TableMap.get(table);
    if (!map.width || !map.height) return;
    decorations.push(Decoration.node(pos, pos + table.nodeSize, {
      class: "ramzy-rounded-table",
    }));
    const cells = new Map<number, Set<string>>();
    const mark = (index: number, edge: string) => {
      const offset = map.map[index];
      if (!cells.has(offset)) cells.set(offset, new Set());
      cells.get(offset)!.add(edge);
    };
    for (let row = 0; row < map.height; row++) {
      mark((row + 1) * map.width - 1, "right");
    }
    for (let col = 0; col < map.width; col++) {
      mark((map.height - 1) * map.width + col, "bottom");
    }
    mark(0, "top-left");
    mark(map.width - 1, "top-right");
    mark((map.height - 1) * map.width, "bottom-left");
    mark(map.map.length - 1, "bottom-right");
    for (const [offset, edges] of cells) {
      const cell = table.nodeAt(offset);
      if (!cell) continue;
      const start = pos + 1 + offset;
      decorations.push(Decoration.node(start, start + cell.nodeSize, {
        "data-table-edge": [...edges].join(" "),
      }));
    }
    // Continue into descendants: tables inside nested layouts get their own frame.
  });
  return DecorationSet.create(doc, decorations);
}

export const tableSurfaceKey = new PluginKey<DecorationSet>("tableSurface");
export const tableSurfacePlugin = () => new Plugin<DecorationSet>({
  key: tableSurfaceKey,
  state: {
    init: (_, state) => tableSurfaceDecorations(state.doc),
    apply: (tr, previous) => tr.docChanged
      ? tableSurfaceDecorations(tr.doc)
      : previous,
  },
  props: {
    decorations: state => tableSurfaceKey.getState(state),
  },
});
