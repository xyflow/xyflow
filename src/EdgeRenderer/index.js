import React, { memo } from 'react';
import { useStoreState } from 'easy-peasy';

import ConnectionLine from '../ConnectionLine';
import { isEdge } from '../graph-utils';

function getEdgePositions({ sourceNode, targetNode, sourceHandleId, targetHandleId }) {
  const hasSourceHandle = !!sourceNode.__rg.handleBounds.source;
  const hasTargetHandle = !!targetNode.__rg.handleBounds.target;

  let sourceHandle = null;
  let targetHandle = null;

  if (hasSourceHandle) {
    // there is no sourceHandleId when there are no multiple handles/ handles with ids
    // so we just pick the first one
    if (sourceNode.__rg.handleBounds.source.length === 1 || !sourceHandleId) {
      sourceHandle = sourceNode.__rg.handleBounds.source[0];
    } else if (sourceHandleId) {
      sourceHandle = sourceNode.__rg.handleBounds.source.find(d => d.id === sourceHandleId);
    }
  }

  if (hasTargetHandle) {
    if (targetNode.__rg.handleBounds.target.length === 1 || !targetHandleId) {
      targetHandle = targetNode.__rg.handleBounds.target[0];
    } else if (targetHandleId) {
      targetHandle = targetNode.__rg.handleBounds.target.find(d => d.id === targetHandleId);
    }
  }

  const sourceHandleX = hasSourceHandle ?
    sourceHandle.x + (sourceHandle.width / 2) :
    sourceNode.__rg.width / 2;

  const sourceHandleY = hasSourceHandle ?
    sourceHandle.y + (sourceHandle.height / 2) :
    sourceNode.__rg.height;

  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetHandleX = hasTargetHandle ?
    targetHandle.x + (targetHandle.width / 2) :
    targetNode.__rg.width / 2;

  const targetHandleY = hasTargetHandle ?
    targetHandle.y + (targetHandle.height / 2) :
    0;

  const targetX = targetNode.__rg.position.x + targetHandleX;
  const targetY = targetNode.__rg.position.y + targetHandleY;

  return {
    sourceX, sourceY, targetX, targetY
  };
}

function renderEdge(e, props, state) {
  const edgeType = e.type || 'default';

  const hasSourceHandleId = e.source.includes('__');
  const hasTargetHandleId = e.target.includes('__');

  const sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
  const targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;

  const sourceHandleId = hasSourceHandleId ? e.source.split('__')[1] : null;
  const targetHandleId = hasTargetHandleId ? e.target.split('__')[1] : null;

  const sourceNode = state.nodes.find(n => n.id === sourceId);
  const targetNode = state.nodes.find(n => n.id === targetId);

  if (!sourceNode) {
    throw new Error(`couldn't create edge for source id: ${sourceId}`);
  }

  if (!targetNode) {
    throw new Error(`couldn't create edge for target id: ${targetId}`);
  }

  const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
  const { sourceX, sourceY, targetX, targetY } = getEdgePositions({ sourceNode, targetNode, sourceHandleId, targetHandleId });
  const selected = state.selectedElements
    .filter(isEdge)
    .find(elm => elm.source === sourceId && elm.target === targetId);

  return (
    <EdgeComponent
      key={e.id}
      id={e.id}
      type={e.type}
      onClick={props.onElementClick}
      selected={selected}
      animated={e.animated}
      style={e.style}
      source={sourceId}
      target={targetId}
      sourceHandleId={sourceHandleId}
      targetHandleId={targetHandleId}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
    />
  );
}

const EdgeRenderer = memo((props) => {
  const state = useStoreState(s => ({
    nodes: s.nodes,
    edges: s.edges,
    transform: s.transform,
    selectedElements: s.selectedElements,
    connectionSourceId: s.connectionSourceId,
    position: s.connectionPosition
  }));
  const {
    width, height, connectionLineStyle, connectionLineType
  } = props;

  if (!width) {
    return null;
  }

  const { transform, edges, nodes, connectionSourceId, position } = state;
  const transformStyle = `translate(${transform[0]},${transform[1]}) scale(${transform[2]})`;

  return (
    <svg
      width={width}
      height={height}
      className="react-graph__edges"
    >
      <g transform={transformStyle}>
        {edges.map(e => renderEdge(e, props, state))}
        {connectionSourceId && (
          <ConnectionLine
            nodes={nodes}
            connectionSourceId={connectionSourceId}
            connectionPositionX={position.x}
            connectionPositionY={position.y}
            transform={transform}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={connectionLineType}
          />
        )}
      </g>
    </svg>
  );
});

EdgeRenderer.displayName = 'EdgeRenderer';

export default EdgeRenderer;
