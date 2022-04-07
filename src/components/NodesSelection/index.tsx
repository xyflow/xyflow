/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */

import React, { memo, useMemo, useCallback, useRef, MouseEvent } from 'react';
import { DraggableCore, DraggableData } from 'react-draggable';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Node, ReactFlowState } from '../../types';
import { getRectOfNodes } from '../../utils/graph';

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
  selectedNodes: Array.from(s.nodeInternals)
    .filter(([_, n]) => n.selected)
    .map(([_, n]) => n),
  snapToGrid: s.snapToGrid,
  snapGrid: s.snapGrid,
  updateNodePosition: s.updateNodePosition,
});

function NodesSelection({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noPanClassName,
}: NodesSelectionProps) {
  const { transform, userSelectionActive, selectedNodes, snapToGrid, snapGrid, updateNodePosition } = useStore(
    selector,
    shallow
  );
  const [tX, tY, tScale] = transform;
  const nodeRef = useRef(null);

  const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

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
    (event: MouseEvent) => {
      onSelectionDragStart?.(event, selectedNodes);
    },
    [onSelectionDragStart, selectedNodes]
  );

  const onDrag = useCallback(
    (event: MouseEvent, data: DraggableData) => {
      updateNodePosition({
        diff: {
          x: data.deltaX,
          y: data.deltaY,
        },
        dragging: true,
      });

      onSelectionDrag?.(event, selectedNodes);
    },
    [onSelectionDrag, selectedNodes, updateNodePosition]
  );

  const onStop = useCallback(
    (event: MouseEvent) => {
      updateNodePosition({
        dragging: false,
      });

      onSelectionDragStop?.(event, selectedNodes);
    },
    [selectedNodes, onSelectionDragStop]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      onSelectionContextMenu?.(event, selectedNodes);
    },
    [onSelectionContextMenu, selectedNodes]
  );

  if (!selectedNodes?.length || userSelectionActive) {
    return null;
  }

  return (
    <div className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])} style={style}>
      <DraggableCore
        scale={tScale}
        grid={grid}
        onStart={(event) => onStart(event as MouseEvent)}
        onDrag={(event, data) => onDrag(event as MouseEvent, data)}
        onStop={(event) => onStop(event as MouseEvent)}
        nodeRef={nodeRef}
        enableUserSelectHack={false}
      >
        <div
          ref={nodeRef}
          className="react-flow__nodesselection-rect"
          onContextMenu={onContextMenu}
          style={innerStyle}
        />
      </DraggableCore>
    </div>
  );
}

export default memo(NodesSelection);
