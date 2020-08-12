import React, { memo, CSSProperties } from 'react';

import { useStoreState } from '../../store/hooks';
import ConnectionLine from '../../components/ConnectionLine/index';
import { isEdge } from '../../utils/graph';
import MarkerDefinitions from './MarkerDefinitions';
import { XYPosition, Position, Edge, Node, ElementId, HandleElement, Elements, ConnectionLineType } from '../../types';

interface EdgeRendererProps {
  edgeTypes: any;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  onElementClick?: (event: React.MouseEvent, element: Node | Edge) => void;
  arrowHeadColor: string;
  markerEndId?: string;
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
          x: node.__rf.width / 2,
          y: 0,
        };
      case Position.Right:
        return {
          x: node.__rf.width,
          y: node.__rf.height / 2,
        };
      case Position.Bottom:
        return {
          x: node.__rf.width / 2,
          y: node.__rf.height,
        };
      case Position.Left:
        return {
          x: 0,
          y: node.__rf.height / 2,
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
    handle = bounds.find((d) => d.id === handleId);
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
  const sourceX = sourceNode.__rf.position.x + sourceHandlePos.x;
  const sourceY = sourceNode.__rf.position.y + sourceHandlePos.y;

  const targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);
  const targetX = targetNode.__rf.position.x + targetHandlePos.x;
  const targetY = targetNode.__rf.position.y + targetHandlePos.y;

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
  };
}

function renderEdge(
  edge: Edge,
  props: EdgeRendererProps,
  nodes: Node[],
  selectedElements: Elements | null,
  elementsSelectable: boolean
) {
  const [sourceId, sourceHandleId] = edge.source.split('__');
  const [targetId, targetHandleId] = edge.target.split('__');

  const sourceNode = nodes.find((n) => n.id === sourceId);
  const targetNode = nodes.find((n) => n.id === targetId);

  if (!sourceNode) {
    throw new Error(`couldn't create edge for source id: ${sourceId}`);
  }

  if (!targetNode) {
    throw new Error(`couldn't create edge for target id: ${targetId}`);
  }

  if (!sourceNode.__rf.width || !sourceNode.__rf.height) {
    return null;
  }

  const edgeType = edge.type || 'default';
  const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
  const sourceHandle = getHandle(sourceNode.__rf.handleBounds.source, sourceHandleId);
  const targetHandle = getHandle(targetNode.__rf.handleBounds.target, targetHandleId);
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

  const isSelected = selectedElements ? selectedElements.some((elm) => isEdge(elm) && elm.id === edge.id) : false;

  return (
    <EdgeComponent
      key={edge.id}
      id={edge.id}
      className={edge.className}
      type={edge.type}
      data={edge.data}
      onClick={props.onElementClick}
      selected={isSelected}
      animated={edge.animated}
      label={edge.label}
      labelStyle={edge.labelStyle}
      labelShowBg={edge.labelShowBg}
      labelBgStyle={edge.labelBgStyle}
      labelBgPadding={edge.labelBgPadding}
      labelBgBorderRadius={edge.labelBgBorderRadius}
      style={edge.style}
      arrowHeadType={edge.arrowHeadType}
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
      elementsSelectable={elementsSelectable}
      markerEndId={props.markerEndId}
      isHidden={edge.isHidden}
    />
  );
}

const EdgeRenderer = (props: EdgeRendererProps) => {
  const [tX, tY, tScale] = useStoreState((s) => s.transform);
  const edges = useStoreState((s) => s.edges);
  const nodes = useStoreState((s) => s.nodes);
  const connectionNodeId = useStoreState((s) => s.connectionNodeId);
  const connectionHandleType = useStoreState((s) => s.connectionHandleType);
  const connectionPosition = useStoreState((s) => s.connectionPosition);
  const selectedElements = useStoreState((s) => s.selectedElements);
  const nodesConnectable = useStoreState((s) => s.nodesConnectable);
  const elementsSelectable = useStoreState((s) => s.elementsSelectable);
  const width = useStoreState((state) => state.width);
  const height = useStoreState((state) => state.height);

  const { connectionLineStyle, connectionLineType, arrowHeadColor } = props;

  if (!width) {
    return null;
  }

  const transformStyle = `translate(${tX},${tY}) scale(${tScale})`;
  const renderConnectionLine = connectionNodeId && connectionHandleType;

  return (
    <svg width={width} height={height} className="react-flow__edges">
      <MarkerDefinitions color={arrowHeadColor} />
      <g transform={transformStyle}>
        {edges.map((edge) => renderEdge(edge, props, nodes, selectedElements, elementsSelectable))}
        {renderConnectionLine && (
          <ConnectionLine
            nodes={nodes}
            connectionNodeId={connectionNodeId!}
            connectionHandleType={connectionHandleType!}
            connectionPositionX={connectionPosition.x}
            connectionPositionY={connectionPosition.y}
            transform={[tX, tY, tScale]}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={connectionLineType}
            isConnectable={nodesConnectable}
          />
        )}
      </g>
    </svg>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
