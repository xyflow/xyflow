import {
  NodeChange,
  EdgeChange,
  NodeSelectionChange,
  EdgeSelectionChange,
  NodeLookup,
  EdgeLookup,
} from '@xyflow/system';
import type { Node, Edge } from '../types/general';

export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange[],
  nodes: NodeType[]
): NodeType[] {
  return nodes.reduce((acc, node) => {
    const change = changes.find(c => {
      // Handle different change types that may have different id structures
      if ('id' in c) {
        return c.id === node.id;
      }
      if ('item' in c && typeof c.item === 'object' && c.item && 'id' in c.item) {
        return (c.item as { id: string }).id === node.id;
      }
      return false;
    });

    if (!change) {
      acc.push(node);
      return acc;
    }

    switch (change.type) {
      case 'add':
        if ('item' in change) {
          acc.push(change.item as NodeType);
        } else {
          acc.push(node);
        }
        break;
      case 'remove':
        // Don't include removed nodes
        break;
      case 'replace':
        if ('item' in change) {
          acc.push(change.item as NodeType);
        } else {
          acc.push(node);
        }
        break;
      case 'position':
        if ('position' in change && change.position) {
          acc.push({ ...node, position: change.position, dragging: 'dragging' in change ? change.dragging : undefined });
        } else {
          acc.push(node);
        }
        break;
      case 'dimensions':
        if ('dimensions' in change && change.dimensions) {
          acc.push({ ...node, ...change.dimensions });
        } else {
          acc.push(node);
        }
        break;
      case 'select':
        if ('selected' in change) {
          acc.push({ ...node, selected: change.selected });
        } else {
          acc.push(node);
        }
        break;
      default:
        acc.push(node);
        break;
    }

    return acc;
  }, [] as NodeType[]);
}

export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange[],
  edges: EdgeType[]
): EdgeType[] {
  return edges.reduce((acc, edge) => {
    const change = changes.find(c => {
      // Handle different change types that may have different id structures
      if ('id' in c) {
        return c.id === edge.id;
      }
      if ('item' in c && typeof c.item === 'object' && c.item && 'id' in c.item) {
        return (c.item as { id: string }).id === edge.id;
      }
      return false;
    });

    if (!change) {
      acc.push(edge);
      return acc;
    }

    switch (change.type) {
      case 'add':
        if ('item' in change) {
          acc.push(change.item as EdgeType);
        } else {
          acc.push(edge);
        }
        break;
      case 'remove':
        // Don't include removed edges
        break;
      case 'replace':
        if ('item' in change) {
          acc.push(change.item as EdgeType);
        } else {
          acc.push(edge);
        }
        break;
      case 'select':
        if ('selected' in change) {
          acc.push({ ...edge, selected: change.selected });
        } else {
          acc.push(edge);
        }
        break;
      default:
        acc.push(edge);
        break;
    }

    return acc;
  }, [] as EdgeType[]);
}

export function createSelectionChange(id: string, selected: boolean): NodeSelectionChange | EdgeSelectionChange {
  return {
    id,
    type: 'select',
    selected,
  };
}

export function getSelectionChanges<T extends { id: string; selected?: boolean }>(
  lookup: Map<string, T> | NodeLookup | EdgeLookup,
  selectedIds: Set<string> = new Set()
): (NodeSelectionChange | EdgeSelectionChange)[] {
  const changes: (NodeSelectionChange | EdgeSelectionChange)[] = [];

  for (const [id, item] of lookup) {
    const isSelected = selectedIds.has(id);
    const currentlySelected = 'selected' in item ? item.selected : false;

    if (isSelected !== currentlySelected) {
      changes.push(createSelectionChange(id, isSelected));
    }
  }

  return changes;
}
