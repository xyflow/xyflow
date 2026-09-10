import { useCallback, CSSProperties } from 'react';
import cc from 'classcat';
import { Position, getNodeToolbarTransform } from '@xyflow/system';

import { InternalNode, ReactFlowState } from '../../types';
import { useReactFlowStore, useShallow } from '../../hooks/useReactFlowStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { NodeToolbarPortal } from './NodeToolbarPortal';
import type { NodeToolbarProps } from './types';
import { useReactFlow } from '../../hooks/useReactFlow';

const storeSelector = (state: ReactFlowState) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2],
  selectedNodesCount: state.nodes.filter((node) => node.selected).length,
});

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

  const nodesSelector = useCallback(
    (state: ReactFlowState): InternalNode[] => {
      const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId || ''];

      const internalNodes: InternalNode[] = [];
      for (const id of nodeIds) {
        const node = state.nodeLookup.get(id);
        if (node) {
          internalNodes.push(node);
        }
      }

      return internalNodes;
    },
    [nodeId, contextNodeId]
  );
  const nodes = useReactFlowStore(useShallow(nodesSelector));
  const { x, y, zoom, selectedNodesCount } = useReactFlowStore(useShallow(storeSelector));

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
