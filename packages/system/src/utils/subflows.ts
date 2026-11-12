import { InternalNodeBase, NodeLookup, NodeOrigin } from '../types';
import { getNodeDimensions } from './general';

export function changeParentNode(
  nodeId: string,
  nodeLookup: NodeLookup<InternalNodeBase>,
  parentId: string | null,
  nodeOrigin: NodeOrigin,
  updateNodeCallback: (args: { nodeId: string; parentId: string | null; x: number; y: number }) => void
) {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    console.warn(`changeParent: Node "${nodeId}" does not exists`);
    return;
  }

  if (parentId === nodeId) {
    return;
  }

  const childPosition = node.internals.positionAbsolute;
  const childOrigin = node.origin ?? nodeOrigin;
  const childDimensions = getNodeDimensions(node);

  const originCorrection = {
    x: childOrigin[0] * childDimensions.width,
    y: childOrigin[1] * childDimensions.height,
  };

  if (parentId === null) {
    updateNodeCallback({
      nodeId,
      parentId,
      x: childPosition.x + originCorrection.x,
      y: childPosition.y + originCorrection.y,
    });

    return;
  }

  const parentNode = nodeLookup.get(parentId);
  if (!parentNode) {
    console.warn(`changeParent: Parent node "${parentId}" does not exists`);
    return;
  }

  const parentPosition = parentNode.internals.positionAbsolute;

  updateNodeCallback({
    nodeId,
    parentId,
    x: childPosition.x + originCorrection.x - parentPosition.x,
    y: childPosition.y + originCorrection.y - parentPosition.y,
  });
}
