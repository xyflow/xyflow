/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { useMemo, useCallback, useRef, MouseEvent } from 'react';
import ReactDraggable, { DraggableData } from 'react-draggable';
import cc from 'classcat';

import { useStore } from '../../store';
import { Node, ReactFlowState } from '../../types';

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
  selectionActive: s.selectionActive,
  selectedNodes: Array.from(s.nodeInternals)
    .filter(([_, n]) => n.selected)
    .map(([_, n]) => n),
  snapToGrid: s.snapToGrid,
  snapGrid: s.snapGrid,
  updateNodePosition: s.updateNodePosition,
});

export default ({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  noPanClassName,
}: NodesSelectionProps) => {
  const { transform, selectedNodesBbox, selectionActive, selectedNodes, snapToGrid, snapGrid, updateNodePosition } =
    useStore(selector);
  const [tX, tY, tScale] = transform;
  const nodeRef = useRef(null);

  const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

  const style = useMemo(
    () => ({
      transform: `translate(${tX}px,${tY}px) scale(${tScale})`,
    }),
    [tX, tY, tScale]
  );

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
      if (onSelectionDrag) {
        onSelectionDrag(event, selectedNodes);
      }

      updateNodePosition({
        diff: {
          x: data.deltaX,
          y: data.deltaY,
        },
        dragging: true,
      });
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

  if (!selectedNodes || selectionActive) {
    return null;
  }

  return (
    <div className={cc(['react-flow__nodesselection', 'react-flow__container', noPanClassName])} style={style}>
      <ReactDraggable
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
      </ReactDraggable>
    </div>
  );
};
