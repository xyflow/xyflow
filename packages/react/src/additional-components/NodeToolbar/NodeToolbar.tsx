import { useCallback, CSSProperties } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { getNodesBounds, Rect, Position, internalsSymbol, getNodeToolbarTransform } from '@xyflow/system';

import { Node, ReactFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { NodeToolbarPortal } from './NodeToolbarPortal';
import type { NodeToolbarProps } from './types';

const nodeEqualityFn = (a?: Node, b?: Node) =>
  a?.computed?.positionAbsolute?.x !== b?.computed?.positionAbsolute?.x ||
  a?.computed?.positionAbsolute?.y !== b?.computed?.positionAbsolute?.y ||
  a?.computed?.width !== b?.computed?.width ||
  a?.computed?.height !== b?.computed?.height ||
  a?.selected !== b?.selected ||
  a?.[internalsSymbol]?.z !== b?.[internalsSymbol]?.z;

const nodesEqualityFn = (a: Node[], b: Node[]) => {
  if (a.length !== b.length) {
    return false;
  }

  return !a.some((node, i) => nodeEqualityFn(node, b[i]));
};

const storeSelector = (state: ReactFlowState) => ({
  viewport: {
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2],
  },
  nodeOrigin: state.nodeOrigin,
  selectedNodesCount: state.nodes.filter((node) => node.selected).length,
});

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

  const nodesSelector = useCallback(
    (state: ReactFlowState): Node[] => {
      const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId || ''];

      return nodeIds.reduce<Node[]>((acc, id) => {
        const node = state.nodeLookup.get(id);
        if (node) {
          acc.push(node);
        }
        return acc;
      }, []);
    },
    [nodeId, contextNodeId]
  );
  const nodes = useStore(nodesSelector, nodesEqualityFn);
  const { viewport, nodeOrigin, selectedNodesCount } = useStore(storeSelector, shallow);

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  const isActive =
    typeof isVisible === 'boolean' ? isVisible : nodes.length === 1 && nodes[0].selected && selectedNodesCount === 1;

  if (!isActive || !nodes.length) {
    return null;
  }

  const nodeRect: Rect = getNodesBounds(nodes, { nodeOrigin });
  const zIndex: number = Math.max(...nodes.map((node) => (node[internalsSymbol]?.z || 1) + 1));

  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    transform: getNodeToolbarTransform(nodeRect, viewport, position, offset, align),
    zIndex,
    ...style,
  };

  return (
    <NodeToolbarPortal>
      <div
        style={wrapperStyle}
        className={cc(['react-flow__node-toolbar', className])}
        {...rest}
        data-id={nodes.reduce((acc, node) => `${acc}${node.id} `, '').trim()}
      >
        {children}
      </div>
    </NodeToolbarPortal>
  );
}
