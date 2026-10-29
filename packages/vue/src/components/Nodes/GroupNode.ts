import type { FunctionalComponent } from 'vue';
import type { BuiltInNode, NodeProps } from '../../types';

// A group node renders nothing — it's just a styled container (the `.vue-flow__node-group` class).
const GroupNode: FunctionalComponent<NodeProps<BuiltInNode>> = function () {
  return null;
};

GroupNode.props = ['sourcePosition', 'targetPosition', 'isConnectable', 'data'];
GroupNode.inheritAttrs = false;
GroupNode.compatConfig = { MODE: 3 };

export default GroupNode;
