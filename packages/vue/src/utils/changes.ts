import type { AddChange, RemoveChange, SelectionChange } from '@xyflow/system';
import type { Edge, EdgeChange, ElementChange, InternalNode, Node, NodeChange } from '../types';
import { isNode } from './graph';

/**
 * Apply element changes immutably: returns a NEW array with new objects for changed elements and unchanged
 * ones reused by reference, so the store's `adoptUserNodes`/`checkEquality` re-adopt stays O(changed)
 * (mutating in place would keep the reference and re-adopt a stale InternalNode).
 *
 * `position`/`dimensions` changes are gated on `isNode` — edges never receive those change types.
 */
export function applyChanges<
  T extends Node | Edge = Node | Edge,
  C extends ElementChange = T extends InternalNode ? NodeChange : EdgeChange,
>(changes: C[], elements: T[]): T[] {
  // bucket changes: field updates by id, plus add/remove
  const updatesById = new Map<string, C[]>();
  const addChanges: AddChange<Node | Edge>[] = [];
  const removeIds = new Set<string>();

  for (const change of changes) {
    if (change.type === 'add') {
      addChanges.push(change as AddChange<Node | Edge>);
    } else if (change.type === 'remove') {
      removeIds.add((change as RemoveChange).id);
    } else {
      const id = (change as { id?: string }).id;
      if (id == null) {
        continue;
      }
      const bucket = updatesById.get(id);
      if (bucket) {
        bucket.push(change);
      } else {
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
          (updated as { selected?: boolean }).selected = currentChange.selected;
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
    if (next.some((el) => el.id === change.item.id)) {
      continue;
    }

    if (typeof change.index === 'number') {
      next.splice(change.index, 0, change.item as unknown as T);
    } else {
      next.push(change.item as unknown as T);
    }
  }

  return next;
}

/** Apply a set of `EdgeChange`s to your edge array and return the next array (for controlled `:edges`). */
export function applyEdgeChanges<EdgeType extends Edge = Edge>(changes: EdgeChange[], edges: EdgeType[]): EdgeType[] {
  return applyChanges(changes, edges) as EdgeType[];
}

/** Apply a set of `NodeChange`s to your node array and return the next array (for controlled `:nodes`). */
export function applyNodeChanges<NodeType extends Node = Node>(changes: NodeChange[], nodes: NodeType[]): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}

export function createSelectionChange(id: string, selected: boolean): SelectionChange {
  return {
    id,
    type: 'select',
    selected,
  };
}
