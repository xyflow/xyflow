import type { XYPosition } from '@xyflow/system';

import { InputNode } from '../Nodes/InputNode';
import { DefaultNode } from '../Nodes/DefaultNode';
import { GroupNode } from '../Nodes/GroupNode';
import { OutputNode } from '../Nodes/OutputNode';
import type { InternalNode, Node, NodeTypes } from '../../types';
import { JSX } from 'solid-js';

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
  width: JSX.CSSProperties['width'];
  height: JSX.CSSProperties['height'];
} {
  if (node.internals.handleBounds === undefined) {
    const numberWidth = node.width ?? node.initialWidth;
    const width = numberWidth ? `${numberWidth}px` : node.style?.width;

    const numberHeight = node.height ?? node.initialHeight;
    const height = numberHeight ? `${numberHeight}px` : node.style?.height;

    return {
      width,
      height,
    };
  }

  const width = node.width ?? node.style?.width;
  const height = node.height ?? node.style?.height;

  return {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };
}
