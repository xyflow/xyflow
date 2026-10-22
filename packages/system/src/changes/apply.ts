import type { Changeset } from '.';
import { EdgeBase, NodeBase } from '../types';
import type { EdgeChange, ElementChangeType, NodeChange } from './types';

export function applyNodeChanges<NodeType extends NodeBase = NodeBase>(
  nodes: NodeType[],
  nodeChanges: Changeset<NodeType, NodeChange<NodeType>>
): NodeType[] {
  return applyChanges(nodes, nodeChanges, applyNodeChange);
}

export function applyEdgeChanges<EdgeType extends EdgeBase = EdgeBase>(
  edges: EdgeType[],
  edgeChanges: Changeset<EdgeType, EdgeChange<EdgeType>>
): EdgeType[] {
  return applyChanges(edges, edgeChanges, applyEdgeChange);
}

function applyChanges<ElementType extends NodeBase | EdgeBase, ChangeType extends ElementChangeType<ElementType>>(
  previousElements: ElementType[],
  changes: Changeset<ElementType, ChangeType>,
  applyChange: (element: ElementType, change: ChangeType) => void
): ElementType[] {
  const newElements: ElementType[] = [];

  const addedElements = changes.getNewElements();
  const addedIds = new Set(addedElements.map((element) => element.id));

  let isPreviousElement: boolean | undefined;
  for (const elements of [previousElements, addedElements]) {
    isPreviousElement = !isPreviousElement;

    elementsLoop: for (const element of elements) {
      // when we loop over the addedElements we skip elements that already exist
      if (!isPreviousElement && !addedIds.has(element.id)) {
        continue;
      }

      const elementChanges = changes.getForElement(element.id);

      if (!elementChanges.length) {
        newElements.push(element);
        addedIds.delete(element.id);
        continue;
      }

      let updatedElement = { ...element };
      for (const change of elementChanges) {
        switch (change.type) {
          case 'remove':
            //remove takes prescedent
            addedIds.delete(element.id);
            continue elementsLoop;
          case 'replace':
            updatedElement = { ...change.item };
            continue;
          default:
            applyChange(updatedElement, change);
        }
      }
      newElements.push(updatedElement);
      addedIds.delete(element.id);
    }
  }

  return newElements;
}

function applyNodeChange<NodeType extends NodeBase = NodeBase>(node: NodeType, change: NodeChange<NodeType>) {
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
          ...change.dimensions,
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

    default:
      return;
  }
}

export function applyEdgeChange<EdgeType extends EdgeBase = EdgeBase>(edge: EdgeType, change: EdgeChange<EdgeType>) {
  switch (change.type) {
    case 'select': {
      edge.selected = change.selected;
      break;
    }

    default:
      return;
  }
}
