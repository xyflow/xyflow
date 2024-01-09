import type { ComponentType } from 'react';
import type { NodeProps, XYPosition } from '@xyflow/system';

import { InputNode } from '../Nodes/InputNode';
import { DefaultNode } from '../Nodes/DefaultNode';
import { GroupNode } from '../Nodes/GroupNode';
import { OutputNode } from '../Nodes/OutputNode';
import type { NodeTypes } from '../../types';

export const arrowKeyDiffs: Record<string, XYPosition> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export const builtinNodeTypes: NodeTypes = {
  input: InputNode as ComponentType<NodeProps>,
  default: DefaultNode as ComponentType<NodeProps>,
  output: OutputNode as ComponentType<NodeProps>,
  group: GroupNode as ComponentType<NodeProps>,
};
