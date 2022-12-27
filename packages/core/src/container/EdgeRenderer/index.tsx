import { memo } from 'react';
import shallow from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import useVisibleEdges from '../../hooks/useVisibleEdges';
import ConnectionLine from '../../components/ConnectionLine/index';
import MarkerDefinitions from './MarkerDefinitions';
import { getEdgePositions, getHandle, getNodeData } from './utils';

import { GraphViewProps } from '../GraphView';
import { devWarn } from '../../utils';
import { ConnectionMode, Position } from '../../types';
import type { Edge, ReactFlowState } from '../../types';

type EdgeRendererProps = Pick<
  GraphViewProps,
  | 'edgeTypes'
  | 'connectionLineType'
  | 'connectionLineType'
  | 'connectionLineStyle'
  | 'connectionLineComponent'
  | 'connectionLineContainerStyle'
  | 'connectionLineContainerStyle'
  | 'onEdgeClick'
  | 'onEdgeDoubleClick'
  | 'defaultMarkerColor'
  | 'onlyRenderVisibleElements'
  | 'onEdgeUpdate'
  | 'onEdgeContextMenu'
  | 'onEdgeMouseEnter'
  | 'onEdgeMouseMove'
  | 'onEdgeMouseLeave'
  | 'onEdgeUpdateStart'
  | 'onEdgeUpdateEnd'
  | 'edgeUpdaterRadius'
  | 'noPanClassName'
  | 'elevateEdgesOnSelect'
  | 'rfId'
  | 'disableKeyboardA11y'
> & {
  elevateEdgesOnSelect: boolean;
};

const selector = (s: ReactFlowState) => ({
  connectionNodeId: s.connectionNodeId,
  connectionHandleType: s.connectionHandleType,
  nodesConnectable: s.nodesConnectable,
  edgesFocusable: s.edgesFocusable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals,
});

const EdgeRenderer = (props: EdgeRendererProps) => {
  const {
    connectionNodeId,
    connectionHandleType,
    nodesConnectable,
    edgesFocusable,
    elementsSelectable,
    width,
    height,
    connectionMode,
    nodeInternals,
  } = useStore(selector, shallow);
  const edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals, props.elevateEdgesOnSelect);

  if (!width) {
    return null;
  }

  const {
    connectionLineType,
    defaultMarkerColor,
    connectionLineStyle,
    connectionLineComponent,
    connectionLineContainerStyle,
  } = props;
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
          {isMaxLevel && <MarkerDefinitions defaultColor={defaultMarkerColor} rfId={props.rfId} />}
          <g>
            {edges.map((edge: Edge) => {
              const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source)!);
              const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target)!);

              if (!sourceIsValid || !targetIsValid) {
                return null;
              }

              let edgeType = edge.type || 'default';

              if (!props.edgeTypes[edgeType]) {
                devWarn(
                  `Edge type "${edgeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`
                );

                edgeType = 'default';
              }

              const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
              // when connection type is loose we can define all handles as sources
              const targetNodeHandles =
                connectionMode === ConnectionMode.Strict
                  ? targetHandleBounds!.target
                  : targetHandleBounds!.target || targetHandleBounds!.source;
              const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle || null);
              const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle || null);
              const sourcePosition = sourceHandle?.position || Position.Bottom;
              const targetPosition = targetHandle?.position || Position.Top;
              const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));

              if (!sourceHandle || !targetHandle) {
                devWarn(
                  `Couldn't create edge for ${!sourceHandle ? 'source' : 'target'} handle id: ${
                    !sourceHandle ? edge.sourceHandle : edge.targetHandle
                  }; edge id: ${edge.id}. Help: https://reactflow.dev/error#800`
                );

                return null;
              }

              const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
                sourceNodeRect,
                sourceHandle,
                sourcePosition,
                targetNodeRect,
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
                  sourceHandleId={edge.sourceHandle}
                  targetHandleId={edge.targetHandle}
                  markerEnd={edge.markerEnd}
                  markerStart={edge.markerStart}
                  sourceX={sourceX}
                  sourceY={sourceY}
                  targetX={targetX}
                  targetY={targetY}
                  sourcePosition={sourcePosition}
                  targetPosition={targetPosition}
                  elementsSelectable={elementsSelectable}
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
                  rfId={props.rfId}
                  ariaLabel={edge.ariaLabel}
                  isFocusable={isFocusable}
                  pathOptions={'pathOptions' in edge ? edge.pathOptions : undefined}
                  interactionWidth={edge.interactionWidth}
                />
              );
            })}
          </g>
        </svg>
      ))}
      {renderConnectionLine && (
        <svg
          style={connectionLineContainerStyle}
          width={width}
          height={height}
          className="react-flow__edges react-flow__connectionline react-flow__container"
        >
          <ConnectionLine
            connectionNodeId={connectionNodeId!}
            connectionHandleType={connectionHandleType!}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={connectionLineType}
            isConnectable={nodesConnectable}
            CustomConnectionLineComponent={connectionLineComponent}
          />
        </svg>
      )}
    </>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
