/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */

import React, { useState, memo } from 'react';
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

export default memo(() => {
  const [offset, setOffset] = useState<XYPosition>({ x: 0, y: 0 });
  const [startPositions, setStartPositions] = useState<StartPositions>({});
  const [tX, tY, tScale] = useStoreState((s) => s.transform);
  const selectedNodesBbox = useStoreState((s) => s.selectedNodesBbox);
  const selectedElements = useStoreState((s) => s.selectedElements);
  const snapToGrid = useStoreState((s) => s.snapToGrid);
  const snapGrid = useStoreState((s) => s.snapGrid);
  const nodes = useStoreState((s) => s.nodes);

  const updateNodePos = useStoreActions((a) => a.updateNodePos);
  const position = selectedNodesBbox;
  const grid = (snapToGrid ? snapGrid : [1, 1])! as [number, number];

  const onStart = (evt: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: evt.clientX / tScale,
      y: evt.clientY / tScale,
    };
    const offsetX: number = scaledClient.x - position.x - tX;
    const offsetY: number = scaledClient.y - position.y - tY;
    const selectedNodes = selectedElements
      ? selectedElements
          .filter(isNode)
          .map((selectedNode) => nodes.find((node) => node.id === selectedNode.id)! as Node)
      : [];

    const nextStartPositions = getStartPositions(selectedNodes);

    if (nextStartPositions) {
      setOffset({ x: offsetX, y: offsetY });
      setStartPositions(nextStartPositions);
    }
  };

  const onDrag = (evt: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: evt.clientX / tScale,
      y: evt.clientY / tScale,
    };

    if (selectedElements) {
      selectedElements.filter(isNode).forEach((node) => {
        const pos: XYPosition = {
          x: startPositions[node.id].x + scaledClient.x - position.x - offset.x - tX,
          y: startPositions[node.id].y + scaledClient.y - position.y - offset.y - tY,
        };

        updateNodePos({ id: node.id, pos });
      });
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
        onStart={(evt) => onStart(evt as MouseEvent)}
        onDrag={(evt) => onDrag(evt as MouseEvent)}
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
});
