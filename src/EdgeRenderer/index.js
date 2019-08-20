import React, { memo } from 'react';
import { useStoreState } from 'easy-peasy';

import ConnectionLine from '../ConnectionLine';
import { isEdge } from '../graph-utils';

function getEdgePositions(sourceNode, targetNode) {
  const hasSourceHandle = !!sourceNode.__rg.handleBounds.source;
  const hasTargetHandle = !!targetNode.__rg.handleBounds.target;

  const sourceHandleX = hasSourceHandle ?
    sourceNode.__rg.handleBounds.source.x + (sourceNode.__rg.handleBounds.source.width / 2) :
    sourceNode.__rg.width / 2;

  const sourceHandleY = hasSourceHandle ?
    sourceNode.__rg.handleBounds.source.y + (sourceNode.__rg.handleBounds.source.height / 2) :
    sourceNode.__rg.height;

  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetHandleX = hasTargetHandle ?
    targetNode.__rg.handleBounds.target.x + (targetNode.__rg.handleBounds.target.width / 2) :
    targetNode.__rg.width / 2;

  const targetHandleY = hasTargetHandle ?
    targetNode.__rg.handleBounds.target.y + (targetNode.__rg.handleBounds.target.height / 2) :
    0;

  const targetX = targetNode.__rg.position.x + targetHandleX;
  const targetY = targetNode.__rg.position.y + targetHandleY;

  return {
    sourceX, sourceY, targetX, targetY
  };
}

function renderEdge(e, props, state) {
  const edgeType = e.type || 'default';
  const sourceNode = state.nodes.find(n => n.id === e.source);
  const targetNode = state.nodes.find(n => n.id === e.target);

  if (!sourceNode) {
    throw new Error(`couldn't create edge for source id: ${e.source}`);
  }

  if (!targetNode) {
    throw new Error(`couldn't create edge for target id: ${e.target}`);
  }

  const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
  const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNode, targetNode);
  const selected = state.selectedElements
    .filter(isEdge)
    .find(elm => elm.source === e.source && elm.target === e.target);

  return (
    <EdgeComponent
      key={e.id}
      id={e.id}
      type={e.type}
      onClick={props.onElementClick}
      selected={selected}
      animated={e.animated}
      style={e.style}
      source={e.source}
      target={e.target}
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
