import type { EdgeChange, NodeChange } from '@xyflow/system';

import type { Edge, Node } from '../types.js';

function applyChanges<FlowElement extends Node | Edge>(
  changes: Array<NodeChange | EdgeChange>,
  elements: FlowElement[]
) {
  let updatedElements: FlowElement[] = [];
  let changesMap = new Map<string, Array<NodeChange | EdgeChange>>();
  let addItemChanges: Array<NodeChange | EdgeChange> = [];

  for (let change of changes) {
    if (change.type === 'add') {
      addItemChanges.push(change);
      continue;
    }

    if (change.type === 'remove' || change.type === 'replace') {
      changesMap.set(change.id, [change]);
      continue;
    }

    let elementChanges = changesMap.get(change.id);
    if (elementChanges) {
      elementChanges.push(change);
    } else {
      changesMap.set(change.id, [change]);
    }
  }

  for (let element of elements) {
    let elementChanges = changesMap.get(element.id);

    if (!elementChanges) {
      updatedElements.push(element);
      continue;
    }

    if (elementChanges[0]?.type === 'remove') {
      continue;
    }

    if (elementChanges[0]?.type === 'replace') {
      updatedElements.push({ ...(elementChanges[0].item as FlowElement) });
      continue;
    }

    let updatedElement = { ...element };
    for (let change of elementChanges) {
      applyChange(change, updatedElement);
    }
    updatedElements.push(updatedElement);
  }

  for (let change of addItemChanges) {
    if (change.type !== 'add') {
      continue;
    }

    let item = { ...(change.item as FlowElement) };
    if (change.index !== undefined) {
      updatedElements.splice(change.index, 0, item);
    } else {
      updatedElements.push(item);
    }
  }

  return updatedElements;
}

function applyChange(change: NodeChange | EdgeChange, element: Node | Edge) {
  switch (change.type) {
    case 'select':
      element.selected = change.selected;
      break;
    case 'position':
      if ('position' in element && change.position !== undefined) {
        element.position = change.position;
      }
      if ('dragging' in change && change.dragging !== undefined) {
        (element as Node).dragging = change.dragging;
      }
      break;
    case 'dimensions':
      if ('measured' in element && change.dimensions !== undefined) {
        (element as Node).measured = { ...change.dimensions };

        if (change.setAttributes === true || change.setAttributes === 'width') {
          (element as Node).width = change.dimensions.width;
        }

        if (change.setAttributes === true || change.setAttributes === 'height') {
          (element as Node).height = change.dimensions.height;
        }
      }
      if (typeof change.resizing === 'boolean') {
        (element as Node).resizing = change.resizing;
      }
      break;
  }
}

export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[]
): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}

export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange<EdgeType>[],
  edges: EdgeType[]
): EdgeType[] {
  return applyChanges(changes, edges) as EdgeType[];
}
