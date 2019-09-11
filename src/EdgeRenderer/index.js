import React, { memo } from 'react';
import { useStoreState } from 'easy-peasy';

import ConnectionLine from '../ConnectionLine';
import { isEdge } from '../graph-utils';

function getHandlePosition(position, node, handle = null) {
  if (!handle) {
    switch (position) {
      case 'top': return {
        x: node.__rg.width / 2,
        y: 0
      };
      case 'right': return {
        x: node.__rg.width,
        y: node.__rg.height / 2
      };
      case 'bottom': return {
        x: node.__rg.width / 2,
        y: node.__rg.height
      };
      case 'left': return {
        x: 0,
        y: node.__rg.height / 2
      };
    }
  }

  switch (position) {
    case 'top': return {
      x: handle.x + (handle.width / 2),
      y: handle.y
    };
    case 'right': return {
      x: handle.x + handle.width,
      y: handle.y + (handle.height / 2)
    };
    case 'bottom': return {
      x: handle.x + (handle.width / 2),
      y: handle.y + handle.height
    };
    case 'left': return {
      x: handle.x,
      y: handle.y + (handle.height / 2)
    };
  }
}

function getHandle(bounds, handleId) {
  let handle = null;

  if (!bounds) {
    return null;
  }

  // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find(d => d.id === handleId);
  }

  return handle;
}

function getEdgePositions({ sourceNode, sourceHandle, sourcePosition, targetNode, targetHandle, targetPosition }) {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNode, sourceHandle)
  const sourceX = sourceNode.__rg.position.x + sourceHandlePos.x;
  const sourceY = sourceNode.__rg.position.y + sourceHandlePos.y;

  const targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);
  const targetX = targetNode.__rg.position.x + targetHandlePos.x;
  const targetY = targetNode.__rg.position.y + targetHandlePos.y;

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
  const sourceHandle = getHandle(sourceNode.__rg.handleBounds.source, sourceHandleId);
  const targetHandle = getHandle(targetNode.__rg.handleBounds.target, targetHandleId);
  const sourcePosition = sourceHandle ? sourceHandle.position : 'bottom';
  const targetPosition = targetHandle ? targetHandle.position : 'top';

  const { sourceX, sourceY, targetX, targetY } = getEdgePositions({
    sourceNode, sourceHandle, sourcePosition,
    targetNode, targetHandle, targetPosition
  });
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
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
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
