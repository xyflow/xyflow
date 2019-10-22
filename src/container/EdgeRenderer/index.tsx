import React, { memo, SVGAttributes } from 'react';

import { useStoreState } from '../../store/hooks';
import ConnectionLine from '../../components/ConnectionLine/index';
import { isEdge } from '../../utils/graph';
import { XYPosition, Position, Edge, Node, ElementId, Transform, HandleElement } from '../../types';

interface EdgeRendererProps {
  width: number;
  height: number;
  edgeTypes: any;
  connectionLineStyle?: SVGAttributes<{}>;
  connectionLineType?: string;
  onElementClick?: () => void;
}

interface EdgeRendererState {
  nodes: Node[];
  edges: Edge[];
  transform: Transform;
  selectedElements: any;
  connectionSourceId: ElementId | null;
  position: XYPosition;
}

interface EdgePositions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

function getHandlePosition(position: Position, node: Node, handle: any | null = null): XYPosition {
  if (!handle) {
    switch (position) {
      case Position.Top:
        return {
          x: node.__rg.width / 2,
          y: 0,
        };
      case Position.Right:
        return {
          x: node.__rg.width,
          y: node.__rg.height / 2,
        };
      case Position.Bottom:
        return {
          x: node.__rg.width / 2,
          y: node.__rg.height,
        };
      case Position.Left:
        return {
          x: 0,
          y: node.__rg.height / 2,
        };
    }
  }

  switch (position) {
    case Position.Top:
      return {
        x: handle.x + handle.width / 2,
        y: handle.y,
      };
    case Position.Right:
      return {
        x: handle.x + handle.width,
        y: handle.y + handle.height / 2,
      };
    case Position.Bottom:
      return {
        x: handle.x + handle.width / 2,
        y: handle.y + handle.height,
      };
    case Position.Left:
      return {
        x: handle.x,
        y: handle.y + handle.height / 2,
      };
  }
}

function getHandle(bounds: HandleElement[], handleId: ElementId | null): HandleElement | null | undefined {
  let handle = null;

  if (!bounds) {
    return null;
  }

  // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find(d => d.id === handleId);
  }

  return handle;
}

function getEdgePositions(
  sourceNode: Node,
  sourceHandle: HandleElement | unknown,
  sourcePosition: Position,
  targetNode: Node,
  targetHandle: HandleElement | unknown,
  targetPosition: Position
): EdgePositions {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNode, sourceHandle);
  const sourceX = sourceNode.__rg.position.x + sourceHandlePos.x;
  const sourceY = sourceNode.__rg.position.y + sourceHandlePos.y;

  const targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);
  const targetX = targetNode.__rg.position.x + targetHandlePos.x;
  const targetY = targetNode.__rg.position.y + targetHandlePos.y;

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
  };
}

function renderEdge(edge: Edge, props: EdgeRendererProps, state: EdgeRendererState) {
  const edgeType = edge.type || 'default';

  const hasSourceHandleId = edge.source.includes('__');
  const hasTargetHandleId = edge.target.includes('__');

  const sourceId = hasSourceHandleId ? edge.source.split('__')[0] : edge.source;
  const targetId = hasTargetHandleId ? edge.target.split('__')[0] : edge.target;

  const sourceHandleId = hasSourceHandleId ? edge.source.split('__')[1] : null;
  const targetHandleId = hasTargetHandleId ? edge.target.split('__')[1] : null;

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
  const sourcePosition = sourceHandle ? sourceHandle.position : Position.Bottom;
  const targetPosition = targetHandle ? targetHandle.position : Position.Top;

  const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
    sourceNode,
    sourceHandle,
    sourcePosition,
    targetNode,
    targetHandle,
    targetPosition
  );
  const selected = state.selectedElements
    .filter(isEdge)
    .find((elm: Edge) => elm.source === sourceId && elm.target === targetId);

  return (
    <EdgeComponent
      key={edge.id}
      id={edge.id}
      type={edge.type}
      onClick={props.onElementClick}
      selected={selected}
      animated={edge.animated}
      style={edge.style}
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

const EdgeRenderer = memo(({ width, height, connectionLineStyle, connectionLineType, ...rest }: EdgeRendererProps) => {
  const state: EdgeRendererState = useStoreState(s => ({
    nodes: s.nodes,
    edges: s.edges,
    transform: s.transform,
    selectedElements: s.selectedElements,
    connectionSourceId: s.connectionSourceId,
    position: s.connectionPosition,
  }));
  if (!width) {
    return null;
  }

  const { transform, edges, nodes, connectionSourceId, position } = state;
  const transformStyle = `translate(${transform[0]},${transform[1]}) scale(${transform[2]})`;

  return (
    <svg width={width} height={height} className="react-flow__edges">
      <g transform={transformStyle}>
        {edges.map((e: Edge) =>
          renderEdge(
            e,
            {
              width,
              height,
              connectionLineStyle,
              connectionLineType,
              ...rest,
            },
            state
          )
        )}
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
