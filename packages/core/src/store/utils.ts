import type { StoreApi } from 'zustand';
import { internalsSymbol, type XYZPosition, type NodeOrigin } from '@reactflow/system';
import { isNumeric, getNodePositionWithOrigin } from '@reactflow/utils';

import type { Edge, EdgeSelectionChange, Node, NodeInternals, NodeSelectionChange, ReactFlowState } from '../types';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
  node: Node,
  nodeInternals: NodeInternals,
  result: XYZPosition,
  nodeOrigin: NodeOrigin
): XYZPosition {
  if (!node.parentNode) {
    return result;
  }
  const parentNode = nodeInternals.get(node.parentNode)!;
  const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);

  return calculateXYZPosition(
    parentNode,
    nodeInternals,
    {
      x: (result.x ?? 0) + parentNodePosition.x,
      y: (result.y ?? 0) + parentNodePosition.y,
      z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    },
    nodeOrigin
  );
}

export function updateAbsoluteNodePositions(
  nodeInternals: NodeInternals,
  nodeOrigin: NodeOrigin,
  parentNodes?: ParentNodes
) {
  nodeInternals.forEach((node) => {
    if (node.parentNode && !nodeInternals.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes?.[node.id]) {
      const { x, y, z } = calculateXYZPosition(
        node,
        nodeInternals,
        {
          ...node.position,
          z: node[internalsSymbol]?.z ?? 0,
        },
        nodeOrigin
      );

      node.positionAbsolute = {
        x,
        y,
      };

      node[internalsSymbol]!.z = z;

      if (parentNodes?.[node.id]) {
        node[internalsSymbol]!.isParent = true;
      }
    }
  });
}

export function createNodeInternals(
  nodes: Node[],
  nodeInternals: NodeInternals,
  nodeOrigin: NodeOrigin,
  elevateNodesOnSelect: boolean
): NodeInternals {
  const nextNodeInternals = new Map<string, Node>();
  const parentNodes: ParentNodes = {};
  const selectedNodeZ: number = elevateNodesOnSelect ? 1000 : 0;

  nodes.forEach((node) => {
    const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
    const currInternals = nodeInternals.get(node.id);

    const internals: Node = {
      width: currInternals?.width,
      height: currInternals?.height,
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y,
      },
    };

    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }

    Object.defineProperty(internals, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: currInternals?.[internalsSymbol]?.handleBounds,
        z,
      },
    });

    nextNodeInternals.set(node.id, internals);
  });

  updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);

  return nextNodeInternals;
}

export function handleControlledNodeSelectionChange(nodeChanges: NodeSelectionChange[], nodeInternals: NodeInternals) {
  nodeChanges.forEach((change) => {
    const node = nodeInternals.get(change.id);
    if (node) {
      nodeInternals.set(node.id, {
        ...node,
        [internalsSymbol]: node[internalsSymbol],
        selected: change.selected,
      });
    }
  });

  return new Map(nodeInternals);
}

export function handleControlledEdgeSelectionChange(edgeChanges: EdgeSelectionChange[], edges: Edge[]) {
  return edges.map((e) => {
    const change = edgeChanges.find((change) => change.id === e.id);
    if (change) {
      e.selected = change.selected;
    }
    return e;
  });
}

type UpdateNodesAndEdgesParams = {
  changedNodes: NodeSelectionChange[] | null;
  changedEdges: EdgeSelectionChange[] | null;
  get: StoreApi<ReactFlowState>['getState'];
  set: StoreApi<ReactFlowState>['setState'];
};

export function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }: UpdateNodesAndEdgesParams) {
  const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();

  if (changedNodes?.length) {
    if (hasDefaultNodes) {
      set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
    }

    onNodesChange?.(changedNodes);
  }

  if (changedEdges?.length) {
    if (hasDefaultEdges) {
      set({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
    }

    onEdgesChange?.(changedEdges);
  }
}
