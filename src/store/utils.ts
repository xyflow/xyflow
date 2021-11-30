import {
  CoordinateExtent,
  Node,
  NodeDimensionChange,
  NodeInternals,
  NodeInternalsItem,
  XYPosition,
  XYZPosition,
} from '../types';
import { clampPosition, isNumeric } from '../utils';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
  node: NodeInternalsItem,
  nodeInternals: NodeInternals,
  parentNodes: ParentNodes,
  result: XYZPosition
): XYZPosition {
  if (!node.parentNode) {
    return result;
  }
  const parentNode = nodeInternals.get(node.parentNode)!;

  return calculateXYZPosition(parentNode, nodeInternals, parentNodes, {
    x: (result.x ?? 0) + (parentNode.position?.x ?? 0),
    y: (result.y ?? 0) + (parentNode.position?.y ?? 0),
    z: parentNode.z > node.z ? parentNode.z : node.z,
  });
}

// function createTree(items: Node[]): any {
//   const rootItems = [];
//   const lookup: Record<any, any> = {};

//   for (const item of items) {
//     const parentId = item.parentNode;

//     if (!lookup[item.id]) {
//       lookup[item.id] = { childNodes: [], z: 0 };
//     }

//     lookup[item.id] = {
//       node: item,
//       childNodes: lookup[item.id].childNodes,
//       z: lookup[item.id].z,
//     };

//     const treeItem = lookup[item.id];

//     if (!parentId) {
//       rootItems.push(treeItem);
//     } else {
//       if (!lookup[parentId]) {
//         lookup[parentId] = { childNodes: [], z: 0 };
//       }

//       lookup[parentId].childNodes.push({ ...treeItem, z: lookup[parentId].z + 1 });
//     }
//   }

//   console.log(lookup);

//   return rootItems;
// }

export function createNodeInternals(nodes: Node[], nodeInternals: NodeInternals): NodeInternals {
  const nextNodeInternals = new Map<string, NodeInternalsItem>();
  const parentNodes: ParentNodes = {};

  nodes.forEach((node) => {
    const z = isNumeric(node.zIndex) ? node.zIndex : node.dragging || node.selected ? 1000 : 0;
    const internals: NodeInternalsItem = {
      ...nodeInternals.get(node.id),
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y,
      },
      z,
    };
    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }
    nextNodeInternals.set(node.id, internals);
  });

  nextNodeInternals.forEach((node) => {
    if (node.parentNode && !nextNodeInternals.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes[node.id]) {
      const { x, y, z } = calculateXYZPosition(node, nextNodeInternals, parentNodes, {
        ...node.position,
        z: node.z,
      });

      node.positionAbsolute = {
        x,
        y,
      };

      node.z = z;

      if (parentNodes[node.id]) {
        node.isParent = true;
      }
    }
  });

  return nextNodeInternals;
}

export function isParentSelected(node: NodeInternalsItem, nodeInternals: NodeInternals): boolean {
  if (!node.parentNode) {
    return false;
  }

  const parentNode = nodeInternals.get(node.parentNode);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeInternals);
}

type CreatePostiionChangeParams = {
  node: NodeInternalsItem;
  nodeExtent: CoordinateExtent;
  nodeInternals: NodeInternals;
  diff?: XYPosition;
  dragging?: boolean;
};

export function createPositionChange({
  node,
  diff,
  dragging,
  nodeExtent,
  nodeInternals,
}: CreatePostiionChangeParams): NodeDimensionChange {
  const change: NodeDimensionChange = {
    id: node.id,
    type: 'dimensions',
    dragging: !!dragging,
  };

  if (diff) {
    const nextPosition = { x: node.position.x + diff.x, y: node.position.y + diff.y };
    let currentExtent = nodeExtent || node.extent;

    if (node.extent === 'parent' && node.parentNode && node.width && node.height) {
      const parent = nodeInternals.get(node.parentNode);
      currentExtent =
        parent?.width && parent?.height
          ? [
              [0, 0],
              [parent.width - node.width, parent.height - node.height],
            ]
          : currentExtent;
    }

    change.position = currentExtent ? clampPosition(nextPosition, currentExtent) : nextPosition;
  }

  return change;
}
