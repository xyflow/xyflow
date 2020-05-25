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
      x: node.__rg.position.x || node.position.x,
      y: node.__rg.position.y || node.position.y,
    };

    res[node.id] = startPosition;

    return res;
  }, startPositions);
}

export default memo(() => {
  const [offset, setOffset] = useState<XYPosition>({ x: 0, y: 0 });
  const [startPositions, setStartPositions] = useState<StartPositions>({});
  const state = useStoreState((s) => ({
    transform: s.transform,
    selectedNodesBbox: s.selectedNodesBbox,
    selectedElements: s.selectedElements,
    snapToGrid: s.snapToGrid,
    snapGrid: s.snapGrid,
    nodes: s.nodes,
  }));
  const updateNodePos = useStoreActions((a) => a.updateNodePos);
  const [tx, ty, tScale] = state.transform;
  const position = state.selectedNodesBbox;
  const grid = (state.snapToGrid ? state.snapGrid : [1, 1])! as [number, number];

  const onStart = (evt: MouseEvent) => {
    const scaledClient: XYPosition = {
      x: evt.clientX / tScale,
      y: evt.clientY / tScale,
    };
    const offsetX: number = scaledClient.x - position.x - tx;
    const offsetY: number = scaledClient.y - position.y - ty;
    const selectedNodes = state.selectedElements
      ? (state.selectedElements.filter(isNode) as Node[]).map(
          (selectedNode) => state.nodes.find((node) => node.id === selectedNode.id)! as Node
        )
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

    if (state.selectedElements) {
      (state.selectedElements.filter(isNode) as Node[]).forEach((node) => {
        const pos: XYPosition = {
          x: startPositions[node.id].x + scaledClient.x - position.x - offset.x - tx,
          y: startPositions[node.id].y + scaledClient.y - position.y - offset.y - ty,
        };

        updateNodePos({ id: node.id, pos });
      });
    }
  };

  return (
    <div
      className="react-flow__nodesselection"
      style={{
        transform: `translate(${tx}px,${ty}px) scale(${tScale})`,
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
