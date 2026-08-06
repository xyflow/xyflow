import type { Changeset } from '.';
import type { Edge, Node } from '../types';
import type { EdgeChange, ElementChangeType, NodeChange } from './types';

export function applyNodeChanges<NodeType extends Node = Node>(
  nodes: NodeType[],
  nodeChanges: Changeset<NodeType, NodeChange<NodeType>>
): NodeType[] {
  return applyChanges(nodes, nodeChanges, applyNodeChange);
}

export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  edges: EdgeType[],
  edgeChanges: Changeset<EdgeType, EdgeChange<EdgeType>>
): EdgeType[] {
  return applyChanges(edges, edgeChanges, applyEdgeChange);
}

function applyChanges<
  ElementType extends Node | Edge,
  ChangeType extends ElementChangeType<ElementType>
>(
  elements: ElementType[],
  changes: Changeset<ElementType, ChangeType>,
  applyChange: (element: ElementType, change: ChangeType) => void
): ElementType[] {
  const newElements: ElementType[] = [];
  for (const element of elements) {
    const elementChanges = changes.getForElement(element.id);

    if (!elementChanges.length) {
      newElements.push(element);
      continue;
    }

    // we expect remove to be at the beginning
    if (elementChanges[0].type === 'remove') {
      continue;
    }

    const updatedElement = { ...element };
    for (const change of elementChanges) {
      applyChange(updatedElement, change);
    }
    newElements.push(updatedElement);
  }

  for (const change of changes.getByType('add')) {
    newElements.push(change.item);
  }

  return newElements;
}

function applyNodeChange<NodeType extends Node = Node>(
  node: NodeType,
  change: NodeChange<NodeType>
) {
  switch (change.type) {
    case 'select': {
      node.selected = change.selected;
      break;
    }

    case 'position': {
      if (typeof change.position !== 'undefined') {
        node.position = change.position;
      }

      if (typeof change.dragging !== 'undefined') {
        node.dragging = change.dragging;
      }

      break;
    }

    case 'dimensions': {
      if (typeof change.dimensions !== 'undefined') {
        node.measured = {
          ...change.dimensions
        };

        if (change.setAttributes === true || change.setAttributes === 'width') {
          node.width = change.dimensions.width;
        }
        if (change.setAttributes === true || change.setAttributes === 'height') {
          node.height = change.dimensions.height;
        }
      }

      if (typeof change.resizing === 'boolean') {
        node.resizing = change.resizing;
      }

      break;
    }

    case 'replace': {
      Object.assign(node, change.item);
      break;
    }

    default:
      return;
  }
}

export function applyEdgeChange<EdgeType extends Edge = Edge>(
  edge: EdgeType,
  change: EdgeChange<EdgeType>
) {
  switch (change.type) {
    case 'select': {
      edge.selected = change.selected;
      break;
    }

    case 'replace': {
      Object.assign(edge, change.item);
      break;
    }

    default:
      return;
  }
}
