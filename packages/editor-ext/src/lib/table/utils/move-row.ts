import type { Node } from '@tiptap/pm/model';
import { TextSelection, type Transaction } from '@tiptap/pm/state';
import { CellSelection, TableMap } from '@tiptap/pm/tables';

import { convertArrayOfRowsToTableNode } from './convert-array-of-rows-to-table-node';
import { convertTableNodeToArrayOfRows } from './convert-table-node-to-array-of-rows';
import { getSelectionRangeInRow } from './get-selection-range-in-row';
import { moveRowInArrayOfRows } from './move-row-in-array-of-rows';
import { findTable } from './query';

export interface MoveRowParams {
  tr: Transaction;
  originIndex: number;
  targetIndex: number;
  select: boolean;
  pos: number;
}

/**
 * Move a row from index `origin` to index `target`.
 *
 * @internal
 */
export function moveRow(moveRowParams: MoveRowParams): boolean {
  const { tr, originIndex, targetIndex, select, pos } = moveRowParams;
  const $pos = tr.doc.resolve(pos);
  const table = findTable($pos);
  if (!table) return false;

  const indexesOriginRow = getSelectionRangeInRow(tr, originIndex)?.indexes;
  const indexesTargetRow = getSelectionRangeInRow(tr, targetIndex)?.indexes;

  if (!indexesOriginRow || !indexesTargetRow) return false;

  if (indexesOriginRow.includes(targetIndex)) return false;

  const newTable = moveTableRow(
    table.node,
    indexesOriginRow,
    indexesTargetRow,
    0,
  );

  tr.replaceWith(table.pos, table.pos + table.node.nodeSize, newTable);

  const map = TableMap.get(newTable);
  if (!select) {
    // Replacing the table auto-maps the old selection across its full content.
    // Explicitly collapse it inside the moved lane in this same undo step.
    const cell = map.map[targetIndex * map.width];
    tr.setSelection(TextSelection.near(tr.doc.resolve(table.start + cell + 1)));
    return true;
  }
  const start = table.start;
  const index = targetIndex;
  const lastCell = map.positionAt(index, map.width - 1, newTable);
  const $lastCell = tr.doc.resolve(start + lastCell);

  const firstCell = map.positionAt(index, 0, newTable);
  const $firstCell = tr.doc.resolve(start + firstCell);

  tr.setSelection(CellSelection.rowSelection($lastCell, $firstCell));
  return true;
}

function moveTableRow(
  table: Node,
  indexesOrigin: number[],
  indexesTarget: number[],
  direction: -1 | 1 | 0,
) {
  let rows = convertTableNodeToArrayOfRows(table);

  rows = moveRowInArrayOfRows(rows, indexesOrigin, indexesTarget, direction);

  return convertArrayOfRowsToTableNode(table, rows);
}
