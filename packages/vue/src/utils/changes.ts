import type {
  EdgeRemoveChange,
  EdgeSelectionChange,
  NodeRemoveChange,
  NodeSelectionChange,
} from '@xyflow/system';
import type {
  Edge,
  EdgeAddChange,
  EdgeChange,
  ElementChange,
  InternalNode,
  Node,
  NodeAddChange,
  NodeChange,
} from '../types';
import { isNode } from '.';

/**
 * Apply element changes IMMUTABLY (xyflow/react `applyNodeChanges` semantics): returns a NEW array where
 * changed elements are NEW objects and unchanged elements are reused by reference. Immutability is required
 * by the node split — the store re-adopts the result via `adoptUserNodes`, whose `checkEquality` reuses the
 * existing `InternalNode` when the user-node reference is unchanged; mutating in place would keep the same
 * reference and re-adopt a stale internal node. Reusing unchanged refs keeps re-adoption O(changed).
 *
 * `position`/`dimensions` changes are gated on `isNode` (user `Node`s have no `internals`, so the old
 * `isInternalNode` guard would skip them) — edges never receive those change types anyway.
 */
export function applyChanges<
  T extends Node | Edge = Node | Edge,
  C extends ElementChange = T extends InternalNode ? NodeChange : EdgeChange,
>(changes: C[], elements: T[]): T[] {
  // bucket changes: field updates by id, plus add/remove
  const updatesById = new Map<string, C[]>();
  const addChanges: (NodeAddChange | EdgeAddChange)[] = [];
  const removeIds = new Set<string>();

  for (const change of changes) {
    if (change.type === 'add') {
      addChanges.push(change as NodeAddChange | EdgeAddChange);
    }
    else if (change.type === 'remove') {
      removeIds.add((change as NodeRemoveChange | EdgeRemoveChange).id);
    }
    else {
      const id = (change as { id?: string }).id;
      if (id == null) {
        continue;
      }
      const bucket = updatesById.get(id);
      if (bucket) {
        bucket.push(change);
      }
      else {
        updatesById.set(id, [change]);
      }
    }
  }

  const next: T[] = [];

  for (const element of elements) {
    if (removeIds.has(element.id)) {
      continue;
    }

    const elementChanges = updatesById.get(element.id);
    if (!elementChanges) {
      // unchanged → reuse the same reference (so the store's `checkEquality` re-adopt is a no-op)
      next.push(element);
      continue;
    }

    const updated = { ...element } as T;

    for (const currentChange of elementChanges) {
      switch (currentChange.type) {
        case 'select':
          ;(updated as { selected?: boolean }).selected = currentChange.selected;
          break;
        case 'position':
          if (isNode(updated)) {
            if (typeof currentChange.position !== 'undefined') {
              updated.position = currentChange.position;
            }

            if (typeof currentChange.dragging !== 'undefined') {
              updated.dragging = currentChange.dragging;
            }
          }
          break;
        case 'dimensions':
          if (isNode(updated)) {
            if (typeof currentChange.dimensions !== 'undefined') {
              updated.measured = { width: currentChange.dimensions.width, height: currentChange.dimensions.height };
            }

            if (currentChange.setAttributes) {
              const setW = currentChange.setAttributes === true || currentChange.setAttributes === 'width';
              const setH = currentChange.setAttributes === true || currentChange.setAttributes === 'height';
              updated.style = {
                ...(updated.style ?? {}),
                ...(setW && { width: `${currentChange.dimensions?.width}px` }),
                ...(setH && { height: `${currentChange.dimensions?.height}px` }),
              };
            }

            if (typeof currentChange.resizing !== 'undefined') {
              updated.resizing = currentChange.resizing;
            }
          }
          break;
      }
    }

    next.push(updated);
  }

  for (const change of addChanges) {
    if (next.some(el => el.id === change.item.id)) {
      continue;
    }

    if (typeof change.index === 'number') {
      next.splice(change.index, 0, change.item as unknown as T);
    }
    else {
      next.push(change.item as unknown as T);
    }
  }

  return next;
}

/** @deprecated Prefer the store instance's apply methods (from `useVueFlow` or the `onInit` instance). */
export function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]) {
  return applyChanges(changes, edges);
}

/** @deprecated Prefer the store instance's apply methods (from `useVueFlow` or the `onInit` instance). */
export function applyNodeChanges(changes: NodeChange[], nodes: InternalNode[]) {
  return applyChanges(changes, nodes);
}

export function createSelectionChange(id: string, selected: boolean): NodeSelectionChange | EdgeSelectionChange {
  return {
    id,
    type: 'select',
    selected,
  };
}

export function createAdditionChange<
  T extends Node | Edge = Node,
  C extends NodeAddChange | EdgeAddChange = T extends Node ? NodeAddChange : EdgeAddChange,
>(item: T, index?: number): C {
  return <C>{
    item,
    type: 'add',
    ...(typeof index === 'number' && { index }),
  };
}

export function createNodeRemoveChange(id: string): NodeRemoveChange {
  return {
    id,
    type: 'remove',
  };
}

export function createEdgeRemoveChange(id: string): EdgeRemoveChange {
  return {
    id,
    type: 'remove',
  };
}

export function getSelectionChanges(
  items: Map<string, { id: string; selected?: boolean }>,
  selectedIds: Set<string> = new Set(),
): NodeSelectionChange[] | EdgeSelectionChange[] {
  const changes: NodeSelectionChange[] | EdgeSelectionChange[] = [];

  for (const [id, item] of items) {
    const willBeSelected = selectedIds.has(id);

    // we don't want to set all items to selected=false on the first selection
    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}
