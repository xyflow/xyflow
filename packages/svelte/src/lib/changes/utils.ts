import type { SelectionChange } from './types';
import { selectionChange } from './create';

export function getSelectionChangesFor(
  items: { id: string; selected?: boolean }[],
  selectedIds: Set<string> = new Set()
): SelectionChange[] {
  const changes: SelectionChange[] = [];

  for (const item of items) {
    const willBeSelected = selectedIds.has(item.id);

    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      changes.push(selectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}
