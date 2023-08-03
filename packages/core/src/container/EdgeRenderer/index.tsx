import { memo, ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import useVisibleEdges from '../../hooks/useVisibleEdges';
import MarkerDefinitions from './MarkerDefinitions';
import { getEdgePositions, getHandle, getNodeData } from './utils';

import { GraphViewProps } from '../GraphView';
import { ConnectionMode, Position } from '../../types';
import type { Edge, EdgeTypesWrapped, ReactFlowState } from '../../types';
import { errorMessages } from '../../contants';

type EdgeRendererProps = Pick<
  GraphViewProps,
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
  edgeTypes: EdgeTypesWrapped;
  elevateEdgesOnSelect: boolean;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => ({
  nodesConnectable: s.nodesConnectable,
  edgesFocusable: s.edgesFocusable,
  edgesUpdatable: s.edgesUpdatable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals,
  onError: s.onError,
});

const EdgeRenderer = ({
  defaultMarkerColor,
  onlyRenderVisibleElements,
  elevateEdgesOnSelect,
  rfId,
  edgeTypes,
  noPanClassName,
  onEdgeUpdate,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  onEdgeClick,
  edgeUpdaterRadius,
  onEdgeDoubleClick,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  children,
}: EdgeRendererProps) => {
  const { edgesFocusable, edgesUpdatable, elementsSelectable, width, height, connectionMode, nodeInternals, onError } =
    useStore(selector, shallow);
  const edgeTree = useVisibleEdges(onlyRenderVisibleElements, nodeInternals, elevateEdgesOnSelect);

  if (!width) {
    return null;
  }

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
          {isMaxLevel && <MarkerDefinitions defaultColor={defaultMarkerColor} rfId={rfId} />}
          <g>
            {edges.map((edge: Edge) => {
              const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
              const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));

              if (!sourceIsValid || !targetIsValid) {
                return null;
              }

              let edgeType = edge.type || 'default';

              if (!edgeTypes[edgeType]) {
                onError?.('011', errorMessages['error011'](edgeType));
                edgeType = 'default';
              }

              const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
              // when connection type is loose we can define all handles as sources and connect source -> source
              const targetNodeHandles =
                connectionMode === ConnectionMode.Strict
                  ? targetHandleBounds!.target
                  : (targetHandleBounds!.target ?? []).concat(targetHandleBounds!.source ?? []);
              const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle);
              const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle);
              const sourcePosition = sourceHandle?.position || Position.Bottom;
              const targetPosition = targetHandle?.position || Position.Top;
              const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
              const isUpdatable =
                typeof onEdgeUpdate !== 'undefined' &&
                (edge.updatable || (edgesUpdatable && typeof edge.updatable === 'undefined'));

              if (!sourceHandle || !targetHandle) {
                onError?.('008', errorMessages['error008'](sourceHandle, edge));

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
                  className={cc([edge.className, noPanClassName])}
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
                  onEdgeUpdate={onEdgeUpdate}
                  onContextMenu={onEdgeContextMenu}
                  onMouseEnter={onEdgeMouseEnter}
                  onMouseMove={onEdgeMouseMove}
                  onMouseLeave={onEdgeMouseLeave}
                  onClick={onEdgeClick}
                  edgeUpdaterRadius={edgeUpdaterRadius}
                  onEdgeDoubleClick={onEdgeDoubleClick}
                  onEdgeUpdateStart={onEdgeUpdateStart}
                  onEdgeUpdateEnd={onEdgeUpdateEnd}
                  rfId={rfId}
                  ariaLabel={edge.ariaLabel}
                  isFocusable={isFocusable}
                  isUpdatable={isUpdatable}
                  pathOptions={'pathOptions' in edge ? edge.pathOptions : undefined}
                  interactionWidth={edge.interactionWidth}
                />
              );
            })}
          </g>
        </svg>
      ))}
      {children}
    </>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
