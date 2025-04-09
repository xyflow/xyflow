import { memo } from 'react';

import { FlowRenderer } from '../FlowRenderer';
import { NodeRenderer } from '../NodeRenderer';
import { EdgeRenderer } from '../EdgeRenderer';
import { Viewport } from '../Viewport';
import { useOnInitHandler } from '../../hooks/useOnInitHandler';
import { useViewportSync } from '../../hooks/useViewportSync';
import { ConnectionLineWrapper } from '../../components/ConnectionLine';
import { useNodeOrEdgeTypesWarning } from './useNodeOrEdgeTypesWarning';
import type { Edge, Node, ReactFlowProps } from '../../types';
import { useStylesLoadedWarning } from './useStylesLoadedWarning';

export type GraphViewProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Omit<
  ReactFlowProps<NodeType, EdgeType>,
  'onSelectionChange' | 'nodes' | 'edges' | 'onMove' | 'onMoveStart' | 'onMoveEnd' | 'elevateEdgesOnSelect'
> &
  Required<
    Pick<
      ReactFlowProps<NodeType, EdgeType>,
      | 'selectionKeyCode'
      | 'deleteKeyCode'
      | 'multiSelectionKeyCode'
      | 'connectionLineType'
      | 'onlyRenderVisibleElements'
      | 'translateExtent'
      | 'minZoom'
      | 'maxZoom'
      | 'defaultMarkerColor'
      | 'noDragClassName'
      | 'noWheelClassName'
      | 'noPanClassName'
      | 'defaultViewport'
      | 'disableKeyboardA11y'
      | 'paneClickDistance'
      | 'nodeClickDistance'
    >
  > & {
    rfId: string;
  };

function GraphViewComponent<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  nodeTypes,
  edgeTypes,
  onInit,
  onNodeClick,
  onEdgeClick,
  onNodeDoubleClick,
  onEdgeDoubleClick,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeContextMenu,
  onSelectionContextMenu,
  onSelectionStart,
  onSelectionEnd,
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  connectionLineContainerStyle,
  selectionKeyCode,
  selectionOnDrag,
  selectionMode,
  multiSelectionKeyCode,
  panActivationKeyCode,
  zoomActivationKeyCode,
  deleteKeyCode,
  onlyRenderVisibleElements,
  elementsSelectable,
  defaultViewport,
  translateExtent,
  minZoom,
  maxZoom,
  preventScrolling,
  defaultMarkerColor,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  panOnDrag,
  onPaneClick,
  onPaneMouseEnter,
  onPaneMouseMove,
  onPaneMouseLeave,
  onPaneScroll,
  onPaneContextMenu,
  paneClickDistance,
  nodeClickDistance,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  reconnectRadius,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
  noDragClassName,
  noWheelClassName,
  noPanClassName,
  disableKeyboardA11y,
  nodeExtent,
  rfId,
  viewport,
  onViewportChange,
}: GraphViewProps<NodeType, EdgeType>) {
  useNodeOrEdgeTypesWarning(nodeTypes);
  useNodeOrEdgeTypesWarning(edgeTypes);
  useStylesLoadedWarning();

  useOnInitHandler(onInit);
  useViewportSync(viewport);

  return (
    <FlowRenderer<NodeType>
      onPaneClick={onPaneClick}
      onPaneMouseEnter={onPaneMouseEnter}
      onPaneMouseMove={onPaneMouseMove}
      onPaneMouseLeave={onPaneMouseLeave}
      onPaneContextMenu={onPaneContextMenu}
      onPaneScroll={onPaneScroll}
      paneClickDistance={paneClickDistance}
      deleteKeyCode={deleteKeyCode}
      selectionKeyCode={selectionKeyCode}
      selectionOnDrag={selectionOnDrag}
      selectionMode={selectionMode}
      onSelectionStart={onSelectionStart}
      onSelectionEnd={onSelectionEnd}
      multiSelectionKeyCode={multiSelectionKeyCode}
      panActivationKeyCode={panActivationKeyCode}
      zoomActivationKeyCode={zoomActivationKeyCode}
      elementsSelectable={elementsSelectable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      zoomOnDoubleClick={zoomOnDoubleClick}
      panOnScroll={panOnScroll}
      panOnScrollSpeed={panOnScrollSpeed}
      panOnScrollMode={panOnScrollMode}
      panOnDrag={panOnDrag}
      defaultViewport={defaultViewport}
      translateExtent={translateExtent}
      minZoom={minZoom}
      maxZoom={maxZoom}
      onSelectionContextMenu={onSelectionContextMenu}
      preventScrolling={preventScrolling}
      noDragClassName={noDragClassName}
      noWheelClassName={noWheelClassName}
      noPanClassName={noPanClassName}
      disableKeyboardA11y={disableKeyboardA11y}
      onViewportChange={onViewportChange}
      isControlledViewport={!!viewport}
    >
      <Viewport>
        <EdgeRenderer<EdgeType>
          edgeTypes={edgeTypes}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseMove={onEdgeMouseMove}
          onEdgeMouseLeave={onEdgeMouseLeave}
          reconnectRadius={reconnectRadius}
          defaultMarkerColor={defaultMarkerColor}
          noPanClassName={noPanClassName}
          disableKeyboardA11y={disableKeyboardA11y}
          rfId={rfId}
        />
        <ConnectionLineWrapper<NodeType>
          style={connectionLineStyle}
          type={connectionLineType}
          component={connectionLineComponent}
          containerStyle={connectionLineContainerStyle}
        />
        <div className="react-flow__edgelabel-renderer" />
        <NodeRenderer<NodeType>
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          nodeClickDistance={nodeClickDistance}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          noPanClassName={noPanClassName}
          noDragClassName={noDragClassName}
          disableKeyboardA11y={disableKeyboardA11y}
          nodeExtent={nodeExtent}
          rfId={rfId}
        />
        <div className="react-flow__viewport-portal" />
      </Viewport>
    </FlowRenderer>
  );
}

GraphViewComponent.displayName = 'GraphView';

export const GraphView = memo(GraphViewComponent) as typeof GraphViewComponent;
