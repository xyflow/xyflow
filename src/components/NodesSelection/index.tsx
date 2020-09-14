/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { useMemo, useCallback, useRef, MouseEvent } from 'react';
import ReactDraggable, { DraggableData } from 'react-draggable';

import { useStoreState, useStoreActions } from '../../store/hooks';
import { isNode } from '../../utils/graph';
import { Node } from '../../types';

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
}

export default ({
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
}: NodesSelectionProps) => {
  const [tX, tY, tScale] = useStoreState((state) => state.transform);
  const selectedNodesBbox = useStoreState((state) => state.selectedNodesBbox);
  const selectionActive = useStoreState((state) => state.selectionActive);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const snapToGrid = useStoreState((state) => state.snapToGrid);
  const snapGrid = useStoreState((state) => state.snapGrid);
  const nodes = useStoreState((state) => state.nodes);

  const updateNodePosDiff = useStoreActions((actions) => actions.updateNodePosDiff);

  const nodeRef = useRef(null);

  const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

  const selectedNodes = useMemo(
    () =>
      selectedElements
        ? selectedElements
            .filter(isNode)
            .map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node)
        : [],
    [selectedElements]
  );

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

      selectedNodes?.forEach((node) => {
        updateNodePosDiff({
          id: node.id,
          diff: {
            x: data.deltaX,
            y: data.deltaY,
          },
        });
      });
    },
    [onSelectionDrag, selectedNodes, updateNodePosDiff]
  );

  const onStop = useCallback(
    (event: MouseEvent) => {
      selectedNodes?.forEach((node) => {
        updateNodePosDiff({
          id: node.id,
          isDragging: false,
        });
      });

      onSelectionDragStop?.(event, selectedNodes);
    },
    [selectedNodes, onSelectionDragStop]
  );

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      const selectedNodes = selectedElements
        ? selectedElements.filter(isNode).map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)!)
        : [];

      onSelectionContextMenu?.(event, selectedNodes);
    },
    [onSelectionContextMenu]
  );

  if (!selectedElements || selectionActive) {
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
