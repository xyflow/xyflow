import type { SelectionChange } from './types.js';
import { selectionChange } from './create.js';

export function getSelectionChanges(
  items: Map<string, { id: string; selected?: boolean }>,
  selectedIds: Set<string> = new Set(),
  mutateItem = false
): SelectionChange[] {
  const changes: SelectionChange[] = [];

  for (const [, item] of items) {
    const willBeSelected = selectedIds.has(item.id);

    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      if (mutateItem) {
        item.selected = willBeSelected;
      }
      changes.push(selectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}

export function getDeselectionChanges(
  items: Map<string, { id: string; selected?: boolean }>,
  deselectedIds: Set<string> | null = new Set(),
  mutateItem = false
): SelectionChange[] {
  const changes: SelectionChange[] = [];

  for (const [, item] of items) {
    const shouldDeselect = deselectedIds ? deselectedIds.has(item.id) : true;

    if (shouldDeselect && item.selected) {
      if (mutateItem) {
        item.selected = false;
      }
      changes.push(selectionChange(item.id, false));
    }
  }

  return changes;
}
