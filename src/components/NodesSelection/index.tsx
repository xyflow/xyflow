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
import useDrag, { UseDragData, UseDragEvent } from '../../hooks/useDrag';

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
  noPanClassName?: string;
}
// @TODO: work with nodeInternals instead of converting it to an array
const selector = (s: ReactFlowState) => ({
  transform: s.transform,
  selectedNodesBbox: s.selectedNodesBbox,
  userSelectionActive: s.userSelectionActive,
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
  updateNodePosition: s.updateNodePosition,
});

function NodesSelection({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noPanClassName,
}: NodesSelectionProps) {
  const { transform, userSelectionActive, selectedNodes, updateNodePosition } = useStore(selector, shallow);
  const [tX, tY, tScale] = transform;
  const nodeRef = useRef(null);

  const style = useMemo(
    () => ({
      transform: `translate(${tX}px,${tY}px) scale(${tScale})`,
    }),
    [tX, tY, tScale]
  );

  const selectedNodesBbox = useMemo(() => getRectOfNodes(selectedNodes), [selectedNodes]);

  const innerStyle = useMemo(
    () => ({
      width: selectedNodesBbox.width,
      height: selectedNodesBbox.height,
      top: selectedNodesBbox.y,
      left: selectedNodesBbox.x,
    }),
    [selectedNodesBbox]
  );

  const onStart = useCallback(
    (event: UseDragEvent) => {
      onSelectionDragStart?.(event.sourceEvent, selectedNodes);
    },
    [onSelectionDragStart, selectedNodes]
  );

  const onDrag = useCallback(
    (event: UseDragEvent, data: UseDragData) => {
      updateNodePosition({
        diff: {
          x: data.dx,
          y: data.dy,
        },
      });

      onSelectionDrag?.(event.sourceEvent, selectedNodes);
    },
    [onSelectionDrag, selectedNodes, updateNodePosition]
  );

  const onStop = useCallback(
    (event: UseDragEvent) => {
      onSelectionDragStop?.(event.sourceEvent, selectedNodes);
    },
    [selectedNodes, onSelectionDragStop]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      onSelectionContextMenu?.(event, selectedNodes);
    },
    [onSelectionContextMenu, selectedNodes]
  );

  useDrag({
    onStart,
    onDrag,
    onStop,
    nodeRef,
  });

  if (!selectedNodes?.length || userSelectionActive) {
    return null;
  }

  return (
    <div className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])} style={style}>
      <div ref={nodeRef} className="react-flow__nodesselection-rect" onContextMenu={onContextMenu} style={innerStyle} />
    </div>
  );
}

export default memo(NodesSelection);
