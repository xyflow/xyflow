/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import React, { memo, useCallback, useRef, MouseEvent } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Node, ReactFlowState } from '../../types';
import { getRectOfNodes } from '../../utils/graph';
import useDrag from '../../hooks/useDrag';

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
  noPanClassName?: string;
}

const selector = (s: ReactFlowState) => ({
  transform: s.transform,
  userSelectionActive: s.userSelectionActive,
});

const bboxSelector = (s: ReactFlowState) => {
  const selectedNodes = Array.from(s.nodeInternals.values()).filter((n) => n.selected);
  return getRectOfNodes(selectedNodes);
};

function useGetMemoizedHandler(handler?: (event: MouseEvent, nodes: Node[]) => void) {
  return useCallback((event: MouseEvent, _: Node, nodes: Node[]) => handler?.(event, nodes), [handler]);
}

function NodesSelection({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noPanClassName,
}: NodesSelectionProps) {
  const store = useStoreApi();
  const { transform, userSelectionActive } = useStore(selector, shallow);
  const { width, height, x: left, y: top } = useStore(bboxSelector, shallow);
  const nodeRef = useRef(null);

  // it's important that these handlers are memoized to avoid multiple creation of d3 drag handler
  const onStart = useGetMemoizedHandler(onSelectionDragStart);
  const onDrag = useGetMemoizedHandler(onSelectionDrag);
  const onStop = useGetMemoizedHandler(onSelectionDragStop);

  useDrag({
    onStart,
    onDrag,
    onStop,
    nodeRef,
  });

  if (userSelectionActive || !width || !height) {
    return null;
  }

  const onContextMenu = onSelectionContextMenu
    ? (event: MouseEvent) => {
        const selectedNodes = Array.from(store.getState().nodeInternals.values()).filter((n) => n.selected);
        onSelectionContextMenu(event, selectedNodes);
      }
    : undefined;

  return (
    <div
      className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])}
      style={{
        transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
      }}
    >
      <div
        ref={nodeRef}
        className="react-flow__nodesselection-rect"
        onContextMenu={onContextMenu}
        style={{
          width,
          height,
          top,
          left,
        }}
      />
    </div>
  );
}

export default memo(NodesSelection);
