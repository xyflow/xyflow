import type {
  NodeAddChange,
  NodeChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  NodeReplaceChange,
  NodeSelectionChange
} from '@xyflow/system';
import type { Node } from '../types';

export function applyNodeChanges<NodeType extends Node = Node>(
  nodes: NodeType[],
  nodeChanges: Map<string, NodeChange<NodeType>[]>,
  nodeAdditions: NodeAddChange<NodeType>[]
): NodeType[] {
  const newNodes: NodeType[] = [];
  const newNodeIds: Set<string> = new Set();
  for (const node of nodes) {
    const changes = nodeChanges.get(node.id);

    if (!changes) {
      newNodes.push(node);
      continue;
    }

    if (changes[0].type === 'remove') {
      continue;
    }

    const updatedNode = { ...node };
    for (const change of changes) {
      applyNodeChange(updatedNode, change);
    }
    newNodes.push(updatedNode);
    newNodeIds.add(node.id);
  }

  for (const change of nodeAdditions) {
    if (newNodeIds.has(change.id)) {
      continue;
    }

    if (typeof change.index === 'number') {
      // TODO: there is probably a better way
      newNodes.splice(change.index, 0, change.item);
    } else {
      newNodes.push(change.item);
    }
  }

  return newNodes;
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

        if (change.setAttributes) {
          if (change.setAttributes === true || change.setAttributes === 'width') {
            node.width = change.dimensions.width;
          }
          if (change.setAttributes === true || change.setAttributes === 'height') {
            node.height = change.dimensions.height;
          }
        }
      }

      // if (typeof change.resizing === 'boolean') {
      //   node.resizing = change.resizing;
      // }

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

export function createSelectionChange(id: string, selected: boolean): NodeSelectionChange {
  return {
    id,
    type: 'select',
    selected
  };
}

export function getSelectionChanges(
  items: { id: string; selected?: boolean }[],
  selectedIds: Set<string> = new Set()
): NodeSelectionChange[] {
  const changes: NodeSelectionChange[] = [];

  for (const item of items) {
    const willBeSelected = selectedIds.has(item.id);

    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}

export class NodeChanges<NodeType extends Node = Node> {
  private changes: Map<string, NodeChange<NodeType>[]> = new Map();

  private additions: Map<string, NodeAddChange<NodeType>> = new Map();
  private removals: Map<string, NodeRemoveChange> = new Map();
  private replacements: Map<string, NodeReplaceChange> = new Map();
  private selections: Map<string, NodeSelectionChange> = new Map();
  private positions: Map<string, NodePositionChange> = new Map();
  private dimensions: Map<string, NodeDimensionChange> = new Map();

  addChange(change: NodeChange<NodeType>): void {
    if (change.type === 'add' && typeof change.index === 'number') {
      this.additions.set(change.id, change);
    } else {
      this.changes.set(change.id, [...(this.changes.get(change.id) || []), change]);
    }
  }

  getByType(type: NodeChange<NodeType>['type']): NodeChange<NodeType>[] {
    return this.changes.get(type) || [];
  }

  apply(nodes: NodeType[]): NodeType[] {
    return applyNodeChanges(nodes, this.changes);
  }
}
