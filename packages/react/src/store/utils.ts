import type { StoreApi } from 'zustand';
import type { Edge, EdgeSelectionChange, Node, NodeSelectionChange, ReactFlowState } from '../types';
import { Connection } from '@xyflow/system';

export function handleControlledSelectionChange<NodeOrEdge extends Node | Edge>(
  changes: NodeSelectionChange[] | EdgeSelectionChange[],
  items: NodeOrEdge[]
): NodeOrEdge[] {
  return items.map((item) => {
    const change = changes.find((change) => change.id === item.id);

    if (change) {
      item.selected = change.selected;
    }

    return item;
  });
}

type UpdateNodesAndEdgesParams = {
  changedNodes: NodeSelectionChange[] | null;
  changedEdges: EdgeSelectionChange[] | null;
  get: StoreApi<ReactFlowState>['getState'];
  set: StoreApi<ReactFlowState>['setState'];
};

export function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }: UpdateNodesAndEdgesParams) {
  const { nodes, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();

  if (changedNodes?.length) {
    if (hasDefaultNodes) {
      set({ nodes: handleControlledSelectionChange(changedNodes, nodes) });
    }

    onNodesChange?.(changedNodes);
  }

  if (changedEdges?.length) {
    if (hasDefaultEdges) {
      set({ edges: handleControlledSelectionChange(changedEdges, edges) });
    }

    onEdgesChange?.(changedEdges);
  }
}

export function updateConnectionLookup(lookup: Map<string, Map<string, Connection>>, edges: Edge[]) {
  lookup.clear();

  edges.forEach(({ source, target, sourceHandle = null, targetHandle = null }) => {
    if (source && target) {
      const sourceKey = `${source}-source-${sourceHandle}`;
      const targetKey = `${target}-target-${targetHandle}`;

      const prevSource = lookup.get(sourceKey) || new Map();
      const prevTarget = lookup.get(targetKey) || new Map();
      const connection = { source, target, sourceHandle, targetHandle };

      lookup.set(sourceKey, prevSource.set(`${target}-${targetHandle}`, connection));
      lookup.set(targetKey, prevTarget.set(`${source}-${sourceHandle}`, connection));
    }
  });

  return lookup;
}
