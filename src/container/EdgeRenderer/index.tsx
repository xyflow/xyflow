import React, { memo, CSSProperties } from 'react';

import { useStoreState } from '../../store/hooks';
import ConnectionLine from '../../components/ConnectionLine/index';
import { isEdge } from '../../utils/graph';
import MarkerDefinitions from './MarkerDefinitions';
import { getHandlePosition, getHandle } from './utils';
import {
  Position,
  Edge,
  Node,
  HandleElement,
  Elements,
  ConnectionLineType,
  ConnectionLineComponent,
} from '../../types';

interface EdgeRendererProps {
  edgeTypes: any;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  onElementClick?: (event: React.MouseEvent, element: Node | Edge) => void;
  arrowHeadColor: string;
  markerEndId?: string;
  connectionLineComponent?: ConnectionLineComponent;
}

interface EdgePositions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
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
  visibleNodes: Node[],
  nodes: Node[],
  selectedElements: Elements | null,
  elementsSelectable: boolean
) {
  const sourceHandleId = edge.sourceHandle || null;
  const targetHandleId = edge.targetHandle || null;

  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  const renderEdge = visibleNodes.some((n) => n.id === edge.source || n.id == edge.target);

  if (!renderEdge) {
    return null;
  }

  if (!sourceNode) {
    console.warn(`couldn't create edge for source id: ${edge.source}`);
    return null;
  }

  if (!targetNode) {
    console.warn(`couldn't create edge for target id: ${edge.target}`);
    return null;
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

  if (!sourceHandle) {
    console.warn(`couldn't create edge for source handle id: ${sourceHandleId}`);
    return null;
  }

  if (!targetHandle) {
    console.warn(`couldn't create edge for source handle id: ${targetHandleId}`);
    return null;
  }

  const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
    sourceNode,
    sourceHandle,
    sourcePosition,
    targetNode,
    targetHandle,
    targetPosition
  );

  const isSelected = selectedElements?.some((elm) => isEdge(elm) && elm.id === edge.id) || false;

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
      source={edge.source}
      target={edge.target}
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
  const [tX, tY, tScale] = useStoreState((state) => state.transform);
  const edges = useStoreState((state) => state.edges);
  const connectionNodeId = useStoreState((state) => state.connectionNodeId);
  const connectionHandleId = useStoreState((state) => state.connectionHandleId);
  const connectionHandleType = useStoreState((state) => state.connectionHandleType);
  const connectionPosition = useStoreState((state) => state.connectionPosition);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const nodesConnectable = useStoreState((state) => state.nodesConnectable);
  const elementsSelectable = useStoreState((state) => state.elementsSelectable);
  const width = useStoreState((state) => state.width);
  const height = useStoreState((state) => state.height);
  const visibleNodes = useStoreState((state) => state.visibleNodes);
  const nodes = useStoreState((state) => state.nodes);

  const { connectionLineType, arrowHeadColor, connectionLineStyle, connectionLineComponent } = props;

  if (!width) {
    return null;
  }

  const transformStyle = `translate(${tX},${tY}) scale(${tScale})`;
  const renderConnectionLine = connectionNodeId && connectionHandleType;

  return (
    <svg width={width} height={height} className="react-flow__edges">
      <MarkerDefinitions color={arrowHeadColor} />
      <g transform={transformStyle}>
        {edges.map((edge: Edge) => renderEdge(edge, props, visibleNodes, nodes, selectedElements, elementsSelectable))}
        {renderConnectionLine && (
          <ConnectionLine
            nodes={visibleNodes}
            connectionNodeId={connectionNodeId!}
            connectionHandleId={connectionHandleId}
            connectionHandleType={connectionHandleType!}
            connectionPositionX={connectionPosition.x}
            connectionPositionY={connectionPosition.y}
            transform={[tX, tY, tScale]}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={connectionLineType}
            isConnectable={nodesConnectable}
            CustomConnectionLineComponent={connectionLineComponent}
          />
        )}
      </g>
    </svg>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
