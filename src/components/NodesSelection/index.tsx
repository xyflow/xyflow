/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import React, { memo, useMemo, useCallback, useRef, MouseEvent } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Node, ReactFlowState } from '../../types';
import { getRectOfNodes } from '../../utils/graph';
import useDragNode from '../../hooks/useDragNode';

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
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
});

function NodesSelection({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noPanClassName,
}: NodesSelectionProps) {
  const { transform, userSelectionActive, selectedNodes } = useStore(selector, shallow);
  const [tX, tY, tScale] = transform;
  const nodeRef = useRef(null);
  const selectedNodesBbox = useMemo(() => getRectOfNodes(selectedNodes), [selectedNodes]);

  const onStart = useCallback(
    (event: MouseEvent, _: Node, nodes: Node[]) => onSelectionDragStart?.(event, nodes),
    [onSelectionDragStart]
  );

  const onDrag = useCallback(
    (event: MouseEvent, _: Node, nodes: Node[]) => onSelectionDrag?.(event, nodes),
    [onSelectionDrag]
  );

  const onStop = useCallback(
    (event: MouseEvent, _: Node, nodes: Node[]) => onSelectionDragStop?.(event, nodes),
    [onSelectionDragStop]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => onSelectionContextMenu?.(event, selectedNodes),
    [onSelectionContextMenu, selectedNodes]
  );

  useDragNode({
    onStart,
    onDrag,
    onStop,
    nodeRef,
  });

  if (!selectedNodes?.length || userSelectionActive) {
    return null;
  }

  return (
    <div
      className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])}
      style={{
        transform: `translate(${tX}px,${tY}px) scale(${tScale})`,
      }}
    >
      <div
        ref={nodeRef}
        className="react-flow__nodesselection-rect"
        onContextMenu={onContextMenu}
        style={{
          width: selectedNodesBbox.width,
          height: selectedNodesBbox.height,
          top: selectedNodesBbox.y,
          left: selectedNodesBbox.x,
        }}
      />
    </div>
  );
}

export default memo(NodesSelection);
