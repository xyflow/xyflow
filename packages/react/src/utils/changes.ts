/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EdgeLookup, NodeLookup, EdgeChange, NodeChange, addChange, replaceChange, removeChange } from '@xyflow/system';
import type { Node, Edge, InternalNode } from '../types';

/**
 * This function is used to find the changes between two sets of elements.
 * It is used to determine which nodes or edges have been added, removed or replaced.
 *
 * @internal
 * @param params.items = the next set of elements (nodes or edges)
 * @param params.lookup = a lookup map of the current store elements
 * @returns an array of changes
 */
export function getElementsDiffChanges({
  items,
  lookup,
}: {
  items: Node[] | undefined;
  lookup: NodeLookup<InternalNode<Node>>;
}): NodeChange[];
export function getElementsDiffChanges({
  items,
  lookup,
}: {
  items: Edge[] | undefined;
  lookup: EdgeLookup;
}): EdgeChange[];
export function getElementsDiffChanges({
  items = [],
  lookup,
}: {
  items: any[] | undefined;
  lookup: Map<string, any>;
}): any[] {
  const changes: any[] = [];
  const itemsLookup = new Map<string, any>(items.map((item) => [item.id, item]));

  for (const [, item] of items.entries()) {
    const lookupItem = lookup.get(item.id);
    const storeItem = lookupItem?.internals?.userNode ?? lookupItem;

    if (storeItem !== undefined && storeItem !== item) {
      changes.push(replaceChange({ ...item }));
    }

    if (storeItem === undefined) {
      changes.push(addChange({ ...item }));
    }
  }

  for (const [id] of lookup) {
    const nextNode = itemsLookup.get(id);

    if (nextNode === undefined) {
      changes.push(removeChange(id));
    }
  }

  return changes;
}
