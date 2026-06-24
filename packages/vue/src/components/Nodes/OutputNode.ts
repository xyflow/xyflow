import type { Component, FunctionalComponent } from 'vue';
import type { BuiltInNode, NodeProps } from '../../types';
import { Position } from '@xyflow/system';
import { Fragment, h } from 'vue';
import Handle from '../Handle/Handle.vue';

const OutputNode: FunctionalComponent<NodeProps<BuiltInNode>> = function ({
  targetPosition = Position.Top,
  isConnectable,
  data,
}) {
  const label = data?.label;

  return [
    h(Handle as Component, { type: 'target', position: targetPosition, isConnectable }),
    typeof label !== 'string' && label ? h(label) : h(Fragment, [label]),
  ];
};

OutputNode.props = ['targetPosition', 'isConnectable', 'data'];
OutputNode.inheritAttrs = false;
OutputNode.compatConfig = { MODE: 3 };

export default OutputNode;
