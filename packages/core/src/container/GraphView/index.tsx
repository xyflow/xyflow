import { memo } from 'react';

import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import ViewportWrapper from '../Viewport';
import useOnInitHandler from '../../hooks/useOnInitHandler';
import {
  NodeTypesWrapped,
  EdgeTypesWrapped,
  ConnectionLineType,
  KeyCode,
  ReactFlowProps,
  Viewport,
  CoordinateExtent,
} from '../../types';

export interface GraphViewProps
  extends Omit<ReactFlowProps, 'onSelectionChange' | 'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'> {
  nodeTypes: NodeTypesWrapped;
  edgeTypes: EdgeTypesWrapped;
  selectionKeyCode: KeyCode | null;
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
  connectionLineType: ConnectionLineType;
  onlyRenderVisibleElements: boolean;
  translateExtent: CoordinateExtent;
  minZoom: number;
  maxZoom: number;
  defaultMarkerColor: string;
  selectNodesOnDrag: boolean;
  noDragClassName: string;
  noWheelClassName: string;
  noPanClassName: string;
  defaultViewport: Viewport;
  rfId: string;
  disableKeyboardA11y: boolean;
}

const GraphView = ({
  nodeTypes,
  edgeTypes,
  onMove,
  onMoveStart,
  onMoveEnd,
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
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  connectionLineContainerStyle,
  selectionKeyCode,
  multiSelectionKeyCode,
  zoomActivationKeyCode,
  deleteKeyCode,
  onlyRenderVisibleElements,
  elementsSelectable,
  selectNodesOnDrag,
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
  onEdgeUpdate,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  edgeUpdaterRadius,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  noDragClassName,
  noWheelClassName,
  noPanClassName,
  elevateEdgesOnSelect,
  disableKeyboardA11y,
  rfId,
}: GraphViewProps) => {
  useOnInitHandler(onInit);

  return (
    <FlowRenderer
      onPaneClick={onPaneClick}
      onPaneMouseEnter={onPaneMouseEnter}
      onPaneMouseMove={onPaneMouseMove}
      onPaneMouseLeave={onPaneMouseLeave}
      onPaneContextMenu={onPaneContextMenu}
      onPaneScroll={onPaneScroll}
      deleteKeyCode={deleteKeyCode}
      selectionKeyCode={selectionKeyCode}
      multiSelectionKeyCode={multiSelectionKeyCode}
      zoomActivationKeyCode={zoomActivationKeyCode}
      elementsSelectable={elementsSelectable}
      onMove={onMove}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
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
    >
      <ViewportWrapper>
        <EdgeRenderer
          edgeTypes={edgeTypes}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          connectionLineComponent={connectionLineComponent}
          connectionLineContainerStyle={connectionLineContainerStyle}
          onEdgeUpdate={onEdgeUpdate}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseMove={onEdgeMouseMove}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          edgeUpdaterRadius={edgeUpdaterRadius}
          defaultMarkerColor={defaultMarkerColor}
          noPanClassName={noPanClassName}
          elevateEdgesOnSelect={!!elevateEdgesOnSelect}
          disableKeyboardA11y={disableKeyboardA11y}
          rfId={rfId}
        />
        <NodeRenderer
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          selectNodesOnDrag={selectNodesOnDrag}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          noPanClassName={noPanClassName}
          noDragClassName={noDragClassName}
          disableKeyboardA11y={disableKeyboardA11y}
          rfId={rfId}
        />
      </ViewportWrapper>
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
