import type { XYPosition } from '@xyflow/system';

import { InputNode } from '../Nodes/InputNode';
import { DefaultNode } from '../Nodes/DefaultNode';
import { GroupNode } from '../Nodes/GroupNode';
import { OutputNode } from '../Nodes/OutputNode';
import type { InternalNode, Node, NodeTypes } from '../../types';

export const arrowKeyDiffs: Record<string, XYPosition> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export const builtinNodeTypes: NodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
  group: GroupNode,
};

export function getNodeInlineStyleDimensions<NodeType extends Node = Node>(
  node: InternalNode<NodeType>
): {
  width: number | string | undefined;
  height: number | string | undefined;
} {
  if (node.internals.handleBounds === undefined) {
    return {
      width: node.width ?? node.initialWidth ?? node.style?.width,
      height: node.height ?? node.initialHeight ?? node.style?.height,
    };
  }

  return {
    width: node.width ?? node.style?.width,
    height: node.height ?? node.style?.height,
  };
}
