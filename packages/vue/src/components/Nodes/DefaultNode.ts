import type { Component, FunctionalComponent } from 'vue';
import type { BuiltInNode, NodeProps } from '../../types';
import { Position } from '@xyflow/system';
import { Fragment, h } from 'vue';
import Handle from '../Handle/Handle.vue';

const DefaultNode: FunctionalComponent<NodeProps<BuiltInNode>> = function ({
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  isConnectable = true,
  data,
}) {
  const label = data?.label;

  return [
    h(Handle as Component, { type: 'target', position: targetPosition, isConnectable }),
    typeof label !== 'string' && label ? h(label) : h(Fragment, [label]),
    h(Handle as Component, { type: 'source', position: sourcePosition, isConnectable }),
  ];
};

DefaultNode.props = ['sourcePosition', 'targetPosition', 'isConnectable', 'data'];
DefaultNode.inheritAttrs = false;
DefaultNode.compatConfig = { MODE: 3 };

export default DefaultNode;
