import { getNodesInside } from '@xyflow/system';
import { createSelector } from 'reselect';
import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

const visibleNodeIdsSelector = createSelector(
  [
    (s: ReactFlowState) => s.nodes,
    (s: ReactFlowState) => s.width,
    (s: ReactFlowState) => s.height,
    (s: ReactFlowState) => s.transform,
    (_s: ReactFlowState, onlyRenderVisibleNodes: boolean) => onlyRenderVisibleNodes,
  ],
  (nodes, width, height, transform, onlyRenderVisible) =>
    onlyRenderVisible
      ? getNodesInside<Node>(nodes, { x: 0, y: 0, width, height }, transform, true).map((node) => node.id)
      : nodes.map((node) => node.id),
  {
    memoizeOptions: {
      resultEqualityCheck: shallow,
    },
  }
);

function useVisibleNodeIds(onlyRenderVisible: boolean) {
  const nodeIds = useStore((s: ReactFlowState) => visibleNodeIdsSelector(s, onlyRenderVisible));

  return nodeIds;
}

export default useVisibleNodeIds;
