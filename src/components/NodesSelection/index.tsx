import React, { useState, memo } from 'react';
import ReactDraggable from 'react-draggable';

import { useStoreState, useStoreActions } from '../../store/hooks';
import { isNode } from '../../utils/graph';
import { Node, Elements, XYPosition } from '../../types';

type StartPositions = { [key: string]: XYPosition };

function getStartPositions(elements: Elements): StartPositions {
  const startPositions: StartPositions = {};

  return (elements.filter(isNode) as Node[]).reduce((res, node) => {
    const startPosition = {
      x: node.__rg.position.x || node.position.x,
      y: node.__rg.position.y || node.position.x,
    };

    res[node.id] = startPosition;

    return res;
  }, startPositions);
}

export default memo(() => {
  const [offset, setOffset] = useState<XYPosition>({ x: 0, y: 0 });
  const [startPositions, setStartPositions] = useState<StartPositions>({});
  const state = useStoreState(s => ({
    transform: s.transform,
    selectedNodesBbox: s.selectedNodesBbox,
    selectedElements: s.selectedElements,
    snapToGrid: s.snapToGrid,
    snapGrid: s.snapGrid
  }));
  const updateNodePos = useStoreActions(a => a.updateNodePos);
  const [x, y, k] = state.transform;
  const position = state.selectedNodesBbox;
  const grid = (state.snapToGrid ? state.snapGrid : [1, 1])! as [number, number];

  const onStart = (evt: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k),
    };
    const offsetX: number = scaledClient.x - position.x - x;
    const offsetY: number = scaledClient.y - position.y - y;
    const nextStartPositions = getStartPositions(state.selectedElements);

    if (nextStartPositions) {
      setOffset({ x: offsetX, y: offsetY });
      setStartPositions(nextStartPositions);
    }
  };

  const onDrag = (evt: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k),
    };

    (state.selectedElements.filter(isNode) as Node[]).forEach(node => {
      const pos: XYPosition = {
        x:
          startPositions[node.id].x +
          scaledClient.x -
          position.x -
          offset.x -
          x,
        y:
          startPositions[node.id].y +
          scaledClient.y -
          position.y -
          offset.y -
          y,
      };

      updateNodePos({ id: node.id, pos });
    });
  };

  return (
    <div
      className="react-flow__nodesselection"
      style={{
        transform: `translate(${x}px,${y}px) scale(${k})`,
      }}
    >
      <ReactDraggable
        scale={k}
        grid={grid}
        onStart={evt => onStart(evt as MouseEvent)}
        onDrag={evt => onDrag(evt as MouseEvent)}
      >
        <div
          className="react-flow__nodesselection-rect"
          style={{
            width: state.selectedNodesBbox.width,
            height: state.selectedNodesBbox.height,
            top: state.selectedNodesBbox.y,
            left: state.selectedNodesBbox.x,
          }}
        />
      </ReactDraggable>
    </div>
  );
});
