import type { StoreApi } from 'zustand';
import {
  internalsSymbol,
  isNumeric,
  getNodePositionWithOrigin,
  type XYZPosition,
  type NodeOrigin,
} from '@xyflow/system';

import type { Edge, EdgeSelectionChange, Node, NodeSelectionChange, ReactFlowState } from '../types';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(node: Node, nodes: Node[], result: XYZPosition, nodeOrigin: NodeOrigin): XYZPosition {
  if (!node.parentNode) {
    return result;
  }

  const parentNode = nodes.find((n) => n.id === node.parentNode)!;
  const parentNodePosition = getNodePositionWithOrigin(parentNode, parentNode?.origin || nodeOrigin);

  return calculateXYZPosition(
    parentNode,
    nodes,
    {
      x: (result.x ?? 0) + parentNodePosition.x,
      y: (result.y ?? 0) + parentNodePosition.y,
      z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    },
    parentNode.origin || nodeOrigin
  );
}

export function updateAbsoluteNodePositions(nodes: Node[], nodeOrigin: NodeOrigin, parentNodes?: ParentNodes) {
  nodes.forEach((node) => {
    if (node.parentNode && !nodes.find((n) => n.id === node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes?.[node.id]) {
      const parentNode = node.parentNode ? nodes.find((n) => n.id === node.parentNode) : null;
      const { x, y, z } = calculateXYZPosition(
        node,
        nodes,
        {
          ...node.position,
          z: node[internalsSymbol]?.z ?? 0,
        },
        parentNode?.origin || nodeOrigin
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
  storeNodes: Node[],
  nodeOrigin: NodeOrigin,
  elevateNodesOnSelect: boolean
): Node[] {
  const nextNodes: Node[] = [];
  const parentNodes: ParentNodes = {};
  const selectedNodeZ: number = elevateNodesOnSelect ? 1000 : 0;

  nodes.forEach((node) => {
    const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
    const currInternals = storeNodes.find((n) => n.id === node.id);

    const updatedNode: Node = {
      width: currInternals?.width,
      height: currInternals?.height,
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y,
      },
    };

    if (node.parentNode) {
      updatedNode.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }

    Object.defineProperty(updatedNode, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: currInternals?.[internalsSymbol]?.handleBounds,
        z,
      },
    });

    nextNodes.push(updatedNode);
  });

  updateAbsoluteNodePositions(nodes, nodeOrigin, parentNodes);

  return nextNodes;
}

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
