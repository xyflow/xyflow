import type { ComponentType } from 'react';
import type { NodeProps } from '@xyflow/system';

import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import GroupNode from '../../components/Nodes/GroupNode';
import type { NodeTypes } from '../../types';

export type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypes;

export function createNodeTypes(nodeTypes: NodeTypes): NodeTypes {
  const builtinTypes: NodeTypes = {
    input: (nodeTypes.input || InputNode) as ComponentType<NodeProps>,
    default: (nodeTypes.default || DefaultNode) as ComponentType<NodeProps>,
    output: (nodeTypes.output || OutputNode) as ComponentType<NodeProps>,
    group: (nodeTypes.group || GroupNode) as ComponentType<NodeProps>,
  };

  const userProvidedTypes = Object.keys(nodeTypes)
    .filter((k) => !['input', 'default', 'output', 'group'].includes(k))
    .reduce<NodeTypes>((res, key) => {
      res[key] = (nodeTypes[key] || DefaultNode) as ComponentType<NodeProps>;

      return res;
    }, {});

  return {
    ...builtinTypes,
    ...userProvidedTypes,
  };
}
