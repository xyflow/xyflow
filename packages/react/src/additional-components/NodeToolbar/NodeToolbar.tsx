import { CSSProperties } from 'react';
import cc from 'classcat';
import { Position, getNodeToolbarTransform } from '@xyflow/system';

import { NodesStore } from '../../types';
import { useNodesStore } from '../../hooks/useReactFlowStore';
import { useInternalNodes } from '../../hooks/useNodes';
import { useNodeId } from '../../contexts/NodeIdContext';
import { NodeToolbarPortal } from './NodeToolbarPortal';
import type { NodeToolbarProps } from './types';
import { useReactFlow } from '../../hooks/useReactFlow';
import { useViewport } from '../../hooks/useViewport';

const storeSelector = (state: NodesStore) => state.nodes.filter((node) => node.selected).length;

/**
 * This component can render a toolbar or tooltip to one side of a custom node. This
 * toolbar doesn't scale with the viewport so that the content is always visible.
 *
 * @public
 * @example
 * ```jsx
 *import { memo } from 'react';
 *import { Handle, Position, NodeToolbar } from '@xyflow/react';
 *
 *function CustomNode({ data }) {
 *  return (
 *    <>
 *      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition}>
 *        <button>delete</button>
 *        <button>copy</button>
 *        <button>expand</button>
 *      </NodeToolbar>
 *
 *      <div style={{ padding: '10px 20px' }}>
 *        {data.label}
 *      </div>
 *
 *      <Handle type="target" position={Position.Left} />
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *
 *export default memo(CustomNode);
 *```
 * @remarks By default, the toolbar is only visible when a node is selected. If multiple
 * nodes are selected it will not be visible to prevent overlapping toolbars or
 * clutter. You can override this behavior by setting the `isVisible` prop to `true`.
 */
export function NodeToolbar({
  nodeId,
  children,
  className,
  style,
  isVisible,
  position = Position.Top,
  offset = 10,
  align = 'center',
  ...rest
}: NodeToolbarProps) {
  const contextNodeId = useNodeId();
  const { getNodesBounds } = useReactFlow();

  const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId || ''];
  const nodes = useInternalNodes(nodeIds);
  const selectedNodesCount = useNodesStore(storeSelector);
  const { x, y, zoom } = useViewport();

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  const isActive =
    typeof isVisible === 'boolean' ? isVisible : nodes.length === 1 && nodes[0].selected && selectedNodesCount === 1;

  if (!isActive || !nodes.length) {
    return null;
  }

  const nodeRect = getNodesBounds(nodes);
  const zIndex = Math.max(...nodes.map((node) => node.internals.z + 1));

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    transform: getNodeToolbarTransform(nodeRect, { x, y, zoom }, position, offset, align),
    zIndex,
    ...style,
  };

  return (
    <NodeToolbarPortal>
      <div
        style={wrapperStyle}
        className={cc(['react-flow__node-toolbar', className])}
        {...rest}
        // @todo: check if we could only do this for non-prod envs
        data-id={nodes.reduce((acc, node) => `${acc}${node.id} `, '').trim()}
      >
        {children}
      </div>
    </NodeToolbarPortal>
  );
}
