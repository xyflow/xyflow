/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { MouseEvent } from 'react';
import ReactDraggable, { DraggableData } from 'react-draggable';

import { useStoreState, useStoreActions } from '../../store/hooks';
import { isNode } from '../../utils/graph';
import { Node } from '../../types';

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
}

export default ({ onSelectionDragStart, onSelectionDrag, onSelectionDragStop }: NodesSelectionProps) => {
  const [tX, tY, tScale] = useStoreState((state) => state.transform);
  const selectedNodesBbox = useStoreState((state) => state.selectedNodesBbox);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const snapToGrid = useStoreState((state) => state.snapToGrid);
  const snapGrid = useStoreState((state) => state.snapGrid);
  const nodes = useStoreState((state) => state.nodes);

  const updateNodePosDiff = useStoreActions((actions) => actions.updateNodePosDiff);

  const grid = (snapToGrid ? snapGrid : [1, 1])! as [number, number];

  if (!selectedElements) {
    return null;
  }

  const onStart = (event: MouseEvent) => {
    const selectedNodes = selectedElements
      ? selectedElements
          .filter(isNode)
          .map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node)
      : [];

    if (onSelectionDragStart) {
      onSelectionDragStart(event, selectedNodes);
    }
  };

  const onDrag = (event: MouseEvent, data: DraggableData) => {
    if (selectedElements) {
      const selectedNodes = selectedElements ? selectedElements.filter(isNode) : [];

      if (onSelectionDrag) {
        const selectionNodes = selectedNodes.map(
          (selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node
        );

        onSelectionDrag(event, selectionNodes);
      }

      selectedNodes.forEach((node) => {
        updateNodePosDiff({
          id: node.id,
          diff: {
            x: data.deltaX,
            y: data.deltaY,
          },
        });
      });
    }
  };

  const onStop = (event: MouseEvent) => {
    if (selectedElements && onSelectionDragStop) {
      const selectedNodes = selectedElements
        ? selectedElements.filter(isNode).map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)!)
        : [];

      onSelectionDragStop(event, selectedNodes);
    }
  };

  return (
    <div
      className="react-flow__nodesselection"
      style={{
        transform: `translate(${tX}px,${tY}px) scale(${tScale})`,
      }}
    >
      <ReactDraggable
        scale={tScale}
        grid={grid}
        onStart={(event) => onStart(event as MouseEvent)}
        onDrag={(event, data) => onDrag(event as MouseEvent, data)}
        onStop={(event) => onStop(event as MouseEvent)}
      >
        <div
          className="react-flow__nodesselection-rect"
          style={{
            width: selectedNodesBbox.width,
            height: selectedNodesBbox.height,
            top: selectedNodesBbox.y,
            left: selectedNodesBbox.x,
          }}
        />
      </ReactDraggable>
    </div>
  );
};
