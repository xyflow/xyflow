import type { ComponentType } from 'react';

import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import GroupNode from '../../components/Nodes/GroupNode';
import wrapNode from '../../components/Nodes/wrapNode';
import { devWarn } from '../../utils';
import type { NodeTypes, NodeProps, NodeTypesWrapped, NodeOrigin, XYPosition } from '../../types';

export type CreateNodeTypes = (nodeTypes: NodeTypes) => NodeTypesWrapped;

export function createNodeTypes(nodeTypes: NodeTypes): NodeTypesWrapped {
  const standardTypes: NodeTypesWrapped = {
    input: wrapNode((nodeTypes.input || InputNode) as ComponentType<NodeProps>),
    default: wrapNode((nodeTypes.default || DefaultNode) as ComponentType<NodeProps>),
    output: wrapNode((nodeTypes.output || OutputNode) as ComponentType<NodeProps>),
    group: wrapNode((nodeTypes.group || GroupNode) as ComponentType<NodeProps>),
  };

  const wrappedTypes = {} as NodeTypesWrapped;
  const specialTypes: NodeTypesWrapped = Object.keys(nodeTypes)
    .filter((k) => !['input', 'default', 'output', 'group'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapNode((nodeTypes[key] || DefaultNode) as ComponentType<NodeProps>);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}

export const getPositionWithOrigin = ({
  x,
  y,
  width,
  height,
  origin,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  origin: NodeOrigin;
}): XYPosition => {
  if (!width || !height) {
    return { x, y };
  }

  if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
    devWarn('nodeOrigin must be between 0 and 1');
    return { x, y };
  }

  return {
    x: x - width * origin[0],
    y: y - height * origin[1],
  };
};
