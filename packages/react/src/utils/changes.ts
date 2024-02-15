/* eslint-disable @typescript-eslint/no-explicit-any */
import { EdgeLookup, NodeLookup } from '@xyflow/system';
import type { Node, Edge, EdgeChange, NodeChange, NodeSelectionChange, EdgeSelectionChange } from '../types';

export function handleParentExpand(updatedElements: any[], updateItem: any) {
  for (const [index, item] of updatedElements.entries()) {
    if (item.id === updateItem.parentNode) {
      const parent = { ...item };
      parent.computed ??= {};

      const extendWidth = updateItem.position.x + updateItem.computed.width - parent.computed.width;
      const extendHeight = updateItem.position.y + updateItem.computed.height - parent.computed.height;

      if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
        parent.width = parent.width ?? parent.computed.width;
        parent.height = parent.height ?? parent.computed.height;

        if (extendWidth > 0) {
          parent.width += extendWidth;
        }

        if (extendHeight > 0) {
          parent.height += extendHeight;
        }

        if (updateItem.position.x < 0) {
          const xDiff = Math.abs(updateItem.position.x);
          parent.position.x = parent.position.x - xDiff;
          parent.width += xDiff;
          updateItem.position.x = 0;
        }

        if (updateItem.position.y < 0) {
          const yDiff = Math.abs(updateItem.position.y);
          parent.position.y = parent.position.y - yDiff;
          parent.height += yDiff;
          updateItem.position.y = 0;
        }

        parent.computed.width = parent.width;
        parent.computed.height = parent.height;

        updatedElements[index] = parent;
      }
      break;
    }
  }
}

// This function applies changes to nodes or edges that are triggered by React Flow internally.
// When you drag a node for example, React Flow will send a position change update.
// This function then applies the changes and returns the updated elements.
function applyChanges(changes: any[], elements: any[]): any[] {
  const updatedElements: any[] = [];
  // By storing a map of changes for each element, we can a quick lookup as we
  // iterate over the elements array!
  const changesMap = new Map<any, any[]>();

  for (const change of changes) {
    if (change.type === 'add') {
      updatedElements.push(change.item);
      continue;
    } else if (change.type === 'remove' || change.type === 'replace') {
      // For a 'remove' change we can safely ignore any other changes queued for
      // the same element, it's going to be removed anyway!
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);

      if (elementChanges) {
        // If we have some changes queued already, we can do a mutable update of
        // that array and save ourselves some copying.
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }

  for (const element of elements) {
    const changes = changesMap.get(element.id);

    // When there are no changes for an element we can just push it unmodified,
    // no need to copy it.
    if (!changes) {
      updatedElements.push(element);
      continue;
    }

    // If we have a 'remove' change queued, it'll be the only change in the array
    if (changes[0].type === 'remove') {
      continue;
    }

    if (changes[0].type === 'replace') {
      updatedElements.push({ ...changes[0].item });
      continue;
    }

    // For other types of changes, we want to start with a shallow copy of the
    // object so React knows this element has changed. Sequential changes will
    /// each _mutate_ this object, so there's only ever one copy.
    const updatedElement = { ...element };

    for (const change of changes) {
      applyChange(change, updatedElement, updatedElements);
    }

    updatedElements.push(updatedElement);
  }

  return updatedElements;
}

// Applies a single change to an element. This is a *mutable* update.
function applyChange(change: any, element: any, elements: any[] = []): any {
  switch (change.type) {
    case 'select': {
      element.selected = change.selected;
      break;
    }

    case 'position': {
      if (typeof change.position !== 'undefined') {
        element.position = change.position;
      }

      if (typeof change.positionAbsolute !== 'undefined') {
        element.computed ??= {};
        element.computed.positionAbsolute = change.positionAbsolute;
      }

      if (typeof change.dragging !== 'undefined') {
        element.dragging = change.dragging;
      }

      if (element.expandParent) {
        handleParentExpand(elements, element);
      }
      break;
    }

    case 'dimensions': {
      if (typeof change.dimensions !== 'undefined') {
        element.computed ??= {};
        element.computed.width = change.dimensions.width;
        element.computed.height = change.dimensions.height;

        if (change.resizing) {
          element.width = change.dimensions.width;
          element.height = change.dimensions.height;
        }
      }

      if (typeof change.resizing === 'boolean') {
        element.resizing = change.resizing;
      }

      if (element.expandParent) {
        handleParentExpand(elements, element);
      }

      break;
    }
  }
}

/**
 * Drop in function that applies node changes to an array of nodes.
 * @public
 * @remarks Various events on the <ReactFlow /> component can produce an {@link NodeChange} that describes how to update the edges of your flow in some way.
 If you don't need any custom behaviour, this util can be used to take an array of these changes and apply them to your edges.
 * @param changes - Array of changes to apply
 * @param nodes - Array of nodes to apply the changes to
 * @returns Array of updated nodes
 * @example
 *  const onNodesChange = useCallback(
      (changes) => {
        setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
      },
      [setNodes],
    );
  
    return (
      <ReactFLow nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
    );
 */
export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[]
): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}

/**
 * Drop in function that applies edge changes to an array of edges.
 * @public
 * @remarks Various events on the <ReactFlow /> component can produce an {@link EdgeChange} that describes how to update the edges of your flow in some way.
 If you don't need any custom behaviour, this util can be used to take an array of these changes and apply them to your edges.
 * @param changes - Array of changes to apply
 * @param edges - Array of edge to apply the changes to
 * @returns Array of updated edges
 * @example
 *  const onEdgesChange = useCallback(
      (changes) => {
        setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
      },
      [setEdges],
    );
  
    return (
      <ReactFlow nodes={nodes} edges={edges} onEdgesChange={onEdgesChange} />
    );
 */
export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange<EdgeType>[],
  edges: EdgeType[]
): EdgeType[] {
  return applyChanges(changes, edges) as EdgeType[];
}

export function createSelectionChange(id: string, selected: boolean): NodeSelectionChange | EdgeSelectionChange {
  return {
    id,
    type: 'select',
    selected,
  };
}

export function getSelectionChanges(
  items: any[],
  selectedIds: Set<string> = new Set(),
  mutateItem = false
): NodeSelectionChange[] | EdgeSelectionChange[] {
  const changes: NodeSelectionChange[] | EdgeSelectionChange[] = [];

  for (const item of items) {
    const willBeSelected = selectedIds.has(item.id);

    // we don't want to set all items to selected=false on the first selection
    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      if (mutateItem) {
        // this hack is needed for nodes. When the user dragged a node, it's selected.
        // When another node gets dragged, we need to deselect the previous one,
        // in order to have only one selected node at a time - the onNodesChange callback comes too late here :/
        item.selected = willBeSelected;
      }
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}

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
  lookup: NodeLookup<Node>;
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

  for (const item of items) {
    const storeItem = lookup.get(item.id);

    if (storeItem !== undefined && storeItem !== item) {
      changes.push({ id: item.id, item: item, type: 'replace' });
    }

    if (storeItem === undefined) {
      changes.push({ item: item, type: 'add' });
    }
  }

  for (const [id] of lookup) {
    const nextNode = itemsLookup.get(id);

    if (nextNode === undefined) {
      changes.push({ id, type: 'remove' });
    }
  }

  return changes;
}
