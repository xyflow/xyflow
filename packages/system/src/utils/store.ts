import { internalsSymbol } from '../constants';
import { BaseNode, NodeOrigin, XYZPosition } from '../types';
import { isNumeric } from './general';
import { getNodePositionWithOrigin } from './graph';

type ParentNodes = Record<string, boolean>;

export function updateAbsolutePositions<NodeType extends BaseNode>(
  nodes: NodeType[],
  nodeOrigin: NodeOrigin = [0, 0],
  parentNodes?: ParentNodes
) {
  return nodes.map((node) => {
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

    return node;
  });
}

type UpdateNodesOptions<NodeType extends BaseNode> = {
  nodeOrigin?: NodeOrigin;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
};

const defaultOptions = {
  nodeOrigin: [0, 0] as NodeOrigin,
  elevateNodesOnSelect: true,
  defaults: {},
};

export function updateNodes<NodeType extends BaseNode>(
  nodes: NodeType[],
  storeNodes: NodeType[],
  options: UpdateNodesOptions<NodeType> = defaultOptions
): NodeType[] {
  const parentNodes: ParentNodes = {};
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  const nextNodes = nodes.map((n) => {
    const node: NodeType = {
      ...options.defaults,
      ...n,
      positionAbsolute: n.position,
    };
    const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
    const currInternals = n?.[internalsSymbol] || storeNodes.find((n) => n.id === node.id)?.[internalsSymbol];

    if (node.parentNode) {
      parentNodes[node.parentNode] = true;
    }

    Object.defineProperty(node, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: currInternals?.handleBounds,
        z,
      },
    });

    return node;
  });

  const nodesWithPositions = updateAbsolutePositions(nextNodes, options.nodeOrigin, parentNodes);

  return nodesWithPositions;
}

function calculateXYZPosition<NodeType extends BaseNode>(
  node: NodeType,
  nodes: NodeType[],
  result: XYZPosition,
  nodeOrigin: NodeOrigin
): XYZPosition {
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
