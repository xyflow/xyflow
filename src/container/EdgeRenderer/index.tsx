import React, { memo, CSSProperties } from 'react';
import shallow from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../store';
import ConnectionLine from '../../components/ConnectionLine/index';
import MarkerDefinitions from './MarkerDefinitions';
import { getEdgePositions, getHandle } from './utils';
import {
  Position,
  Edge,
  ConnectionLineType,
  ConnectionLineComponent,
  ConnectionMode,
  OnEdgeUpdateFunc,
  ReactFlowState,
} from '../../types';
import useVisibleEdges from '../../hooks/useVisibleEdges';

interface EdgeRendererProps {
  edgeTypes: any;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  onEdgeClick?: (event: React.MouseEvent, node: Edge) => void;
  onEdgeDoubleClick?: (event: React.MouseEvent, edge: Edge) => void;
  defaultMarkerColor: string;
  onlyRenderVisibleElements: boolean;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeMouseEnter?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeMouseMove?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeMouseLeave?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeUpdateStart?: (event: React.MouseEvent, edge: Edge) => void;
  onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge) => void;
  edgeUpdaterRadius?: number;
  noPanClassName?: string;
}

const selector = (s: ReactFlowState) => ({
  connectionNodeId: s.connectionNodeId,
  connectionHandleId: s.connectionHandleId,
  connectionHandleType: s.connectionHandleType,
  connectionPosition: s.connectionPosition,
  nodesConnectable: s.nodesConnectable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals,
});

const EdgeRenderer = (props: EdgeRendererProps) => {
  const {
    connectionNodeId,
    connectionHandleId,
    connectionHandleType,
    connectionPosition,
    nodesConnectable,
    elementsSelectable,
    width,
    height,
    connectionMode,
    nodeInternals,
  } = useStore(selector, shallow);
  const edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals);

  if (!width) {
    return null;
  }

  const { connectionLineType, defaultMarkerColor, connectionLineStyle, connectionLineComponent } = props;
  const renderConnectionLine = connectionNodeId && connectionHandleType;

  return (
    <>
      {edgeTree.map(({ level, edges, isMaxLevel }) => (
        <svg
          key={level}
          style={{ zIndex: level }}
          width={width}
          height={height}
          className="react-flow__edges react-flow__container"
        >
          {isMaxLevel && <MarkerDefinitions defaultColor={defaultMarkerColor} />}
          <g>
            {edges.map((edge: Edge) => {
              const sourceNode = nodeInternals.get(edge.source);
              const targetNode = nodeInternals.get(edge.target);

              const sourceHandleId = edge.sourceHandle || null;
              const targetHandleId = edge.targetHandle || null;

              const sourceNodeX = sourceNode?.positionAbsolute?.x;
              const sourceNodeY = sourceNode?.positionAbsolute?.y;
              const sourceNodeHandleBounds = sourceNode?.handleBounds;
              const targetNodeWidth = targetNode?.width;
              const targetNodeHeight = targetNode?.height;
              const targetNodeX = targetNode?.positionAbsolute?.x;
              const targetNodeY = targetNode?.positionAbsolute?.y;
              const targetNodeHandleBounds = targetNode?.handleBounds;

              // source and target node need to be initialized
              if (!sourceNodeHandleBounds || !targetNodeHandleBounds) {
                return null;
              }

              if (
                !sourceNode?.width ||
                !sourceNode?.height ||
                typeof sourceNodeX === 'undefined' ||
                typeof sourceNodeY === 'undefined'
              ) {
                console.warn(`couldn't create edge for source id: ${edge.source}; edge id: ${edge.id}`);
                return null;
              }

              if (
                !targetNodeWidth ||
                !targetNodeHeight ||
                typeof targetNodeX === 'undefined' ||
                typeof targetNodeY === 'undefined'
              ) {
                console.warn(`couldn't create edge for target id: ${edge.target}; edge id: ${edge.id}`);
                return null;
              }

              const edgeType = edge.type || 'default';
              const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
              // when connection type is loose we can define all handles as sources
              const targetNodeHandles =
                connectionMode === ConnectionMode.Strict
                  ? targetNodeHandleBounds.target
                  : targetNodeHandleBounds.target || targetNodeHandleBounds.source;
              const sourceHandle = getHandle(sourceNodeHandleBounds.source!, sourceHandleId);
              const targetHandle = getHandle(targetNodeHandles!, targetHandleId);
              const sourcePosition = sourceHandle ? sourceHandle.position : Position.Bottom;
              const targetPosition = targetHandle ? targetHandle.position : Position.Top;

              if (!sourceHandle) {
                console.warn(`couldn't create edge for source handle id: ${sourceHandleId}; edge id: ${edge.id}`);
                return null;
              }

              if (!targetHandle) {
                console.warn(`couldn't create edge for target handle id: ${targetHandleId}; edge id: ${edge.id}`);
                return null;
              }

              const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
                { x: sourceNodeX, y: sourceNodeY, width: sourceNode?.width, height: sourceNode?.height },
                sourceHandle,
                sourcePosition,
                { x: targetNodeX, y: targetNodeY, width: targetNodeWidth, height: targetNodeHeight },
                targetHandle,
                targetPosition
              );

              return (
                <EdgeComponent
                  key={edge.id}
                  id={edge.id}
                  className={cc([edge.className, props.noPanClassName])}
                  type={edgeType}
                  data={edge.data}
                  selected={!!edge.selected}
                  animated={!!edge.animated}
                  hidden={!!edge.hidden}
                  label={edge.label}
                  labelStyle={edge.labelStyle}
                  labelShowBg={edge.labelShowBg}
                  labelBgStyle={edge.labelBgStyle}
                  labelBgPadding={edge.labelBgPadding}
                  labelBgBorderRadius={edge.labelBgBorderRadius}
                  style={edge.style}
                  source={edge.source}
                  target={edge.target}
                  sourceHandleId={sourceHandleId}
                  targetHandleId={targetHandleId}
                  markerEnd={edge.markerEnd}
                  markerStart={edge.markerStart}
                  sourceX={sourceX}
                  sourceY={sourceY}
                  targetX={targetX}
                  targetY={targetY}
                  sourcePosition={sourcePosition}
                  targetPosition={targetPosition}
                  elementsSelectable={elementsSelectable}
                  handleEdgeUpdate={typeof props.onEdgeUpdate !== 'undefined'}
                  onEdgeUpdate={props.onEdgeUpdate}
                  onContextMenu={props.onEdgeContextMenu}
                  onMouseEnter={props.onEdgeMouseEnter}
                  onMouseMove={props.onEdgeMouseMove}
                  onMouseLeave={props.onEdgeMouseLeave}
                  onClick={props.onEdgeClick}
                  edgeUpdaterRadius={props.edgeUpdaterRadius}
                  onEdgeDoubleClick={props.onEdgeDoubleClick}
                  onEdgeUpdateStart={props.onEdgeUpdateStart}
                  onEdgeUpdateEnd={props.onEdgeUpdateEnd}
                />
              );
            })}
            {renderConnectionLine && isMaxLevel && (
              <ConnectionLine
                connectionNodeId={connectionNodeId!}
                connectionHandleId={connectionHandleId}
                connectionHandleType={connectionHandleType!}
                connectionPositionX={connectionPosition.x}
                connectionPositionY={connectionPosition.y}
                connectionLineStyle={connectionLineStyle}
                connectionLineType={connectionLineType}
                isConnectable={nodesConnectable}
                CustomConnectionLineComponent={connectionLineComponent}
              />
            )}
          </g>
        </svg>
      ))}
    </>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
