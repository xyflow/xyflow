import type { Component, FunctionalComponent } from 'vue';
import type { BuiltInNode, NodeProps } from '../../types';
import { Position } from '@xyflow/system';
import { Fragment, h } from 'vue';
import Handle from '../Handle/Handle.vue';

const InputNode: FunctionalComponent<NodeProps<BuiltInNode>> = function ({
  sourcePosition = Position.Bottom,
  isConnectable = true,
  data,
}) {
  const label = data?.label;

  return [
    typeof label !== 'string' && label ? h(label) : h(Fragment, [label]),
    h(Handle as Component, { type: 'source', position: sourcePosition, isConnectable }),
  ];
};

InputNode.props = ['sourcePosition', 'isConnectable', 'data'];
InputNode.inheritAttrs = false;
InputNode.compatConfig = { MODE: 3 };

export default InputNode;
