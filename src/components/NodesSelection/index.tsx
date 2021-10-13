/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { useMemo, useCallback, useRef, MouseEvent } from 'react';
import ReactDraggable, { DraggableData } from 'react-draggable';

import { useStore } from '../../store';
import { Node, ReactFlowState } from '../../types';

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
}

const selector = (s: ReactFlowState) => ({
  transform: s.transform,
  selectedNodesBbox: s.selectedNodesBbox,
  selectionActive: s.selectionActive,
  selectedNodes: s.nodes.filter((n) => n.selected),
  snapToGrid: s.snapToGrid,
  snapGrid: s.snapGrid,
  updateNodePosDiff: s.updateNodePosDiff,
});

export default ({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
}: NodesSelectionProps) => {
  const { transform, selectedNodesBbox, selectionActive, selectedNodes, snapToGrid, snapGrid, updateNodePosDiff } =
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

      updateNodePosDiff({
        diff: {
          x: data.deltaX,
          y: data.deltaY,
        },
        isDragging: true,
      });
    },
    [onSelectionDrag, selectedNodes, updateNodePosDiff]
  );

  const onStop = useCallback(
    (event: MouseEvent) => {
      updateNodePosDiff({
        isDragging: false,
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
    <div className="react-flow__nodesselection" style={style}>
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
