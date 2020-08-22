/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { useState, MouseEvent } from 'react';
import ReactDraggable from 'react-draggable';

import { useStoreState, useStoreActions } from '../../store/hooks';
import { isNode } from '../../utils/graph';
import { Node, XYPosition } from '../../types';

type StartPositions = { [key: string]: XYPosition };

function getStartPositions(nodes: Node[]): StartPositions {
  const startPositions: StartPositions = {};

  return nodes.reduce((res, node) => {
    const startPosition = {
      x: node.__rf.position.x || node.position.x,
      y: node.__rf.position.y || node.position.y,
    };

    res[node.id] = startPosition;

    return res;
  }, startPositions);
}

export interface NodesSelectionProps {
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
}

export default ({ onSelectionDragStart, onSelectionDrag, onSelectionDragStop }: NodesSelectionProps) => {
  const [offset, setOffset] = useState<XYPosition>({ x: 0, y: 0 });
  const [startPositions, setStartPositions] = useState<StartPositions>({});

  const [tX, tY, tScale] = useStoreState((state) => state.transform);
  const selectedNodesBbox = useStoreState((state) => state.selectedNodesBbox);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const snapToGrid = useStoreState((state) => state.snapToGrid);
  const snapGrid = useStoreState((state) => state.snapGrid);
  const nodes = useStoreState((state) => state.nodes);

  const updateNodePos = useStoreActions((actions) => actions.updateNodePos);

  const grid = (snapToGrid ? snapGrid : [1, 1])! as [number, number];

  if (!selectedElements) {
    return null;
  }

  const onStart = (event: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: event.clientX / tScale,
      y: event.clientY / tScale,
    };
    const offsetX: number = scaledClient.x - selectedNodesBbox.x - tX;
    const offsetY: number = scaledClient.y - selectedNodesBbox.y - tY;
    const selectedNodes = selectedElements
      ? selectedElements
          .filter(isNode)
          .map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node)
      : [];

    const nextStartPositions = getStartPositions(selectedNodes);

    if (onSelectionDragStart) {
      onSelectionDragStart(event, selectedNodes);
    }

    if (nextStartPositions) {
      setOffset({ x: offsetX, y: offsetY });
      setStartPositions(nextStartPositions);
    }
  };

  const onDrag = (event: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: event.clientX / tScale,
      y: event.clientY / tScale,
    };

    if (selectedElements) {
      const selectedNodes = selectedElements ? selectedElements.filter(isNode) : [];

      if (onSelectionDrag) {
        const selectionNodes = selectedNodes.map(
          (selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node
        );

        onSelectionDrag(event, selectionNodes);
      }

      selectedNodes.forEach((node) => {
        const pos: XYPosition = {
          x: startPositions[node.id].x + scaledClient.x - selectedNodesBbox.x - offset.x - tX,
          y: startPositions[node.id].y + scaledClient.y - selectedNodesBbox.y - offset.y - tY,
        };

        updateNodePos({ id: node.id, pos });
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
        onDrag={(event) => onDrag(event as MouseEvent)}
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
