import React, { memo } from 'react';

import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import Viewport from '../Viewport';
import { ReactFlowProps } from '../ReactFlow';
import useOnLoadHandler from '../../hooks/useOnLoadHandler';
import { NodeTypesType, EdgeTypesType, ConnectionLineType, KeyCode } from '../../types';

export interface GraphViewProps extends Omit<ReactFlowProps, 'onSelectionChange' | 'nodes' | 'edges'> {
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  selectionKeyCode: KeyCode;
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
  connectionLineType: ConnectionLineType;
  onlyRenderVisibleElements: boolean;
  defaultZoom: number;
  defaultPosition: [number, number];
  defaultMarkerColor: string;
  selectNodesOnDrag: boolean;
}

const GraphView = ({
  nodeTypes,
  edgeTypes,
  onMove,
  onMoveStart,
  onMoveEnd,
  onLoad,
  onNodeClick,
  onEdgeClick,
  onNodeDoubleClick,
  onEdgeDoubleClick,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeContextMenu,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragStop,
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  selectionKeyCode,
  multiSelectionKeyCode,
  zoomActivationKeyCode,
  deleteKeyCode,
  onlyRenderVisibleElements,
  elementsSelectable,
  selectNodesOnDrag,
  defaultZoom,
  defaultPosition,
  preventScrolling,
  defaultMarkerColor,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  paneMoveable,
  onPaneClick,
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
  noZoomClassName,
  noPanClassName,
}: GraphViewProps) => {
  useOnLoadHandler(onLoad);

  return (
    <FlowRenderer
      onPaneClick={onPaneClick}
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
      paneMoveable={paneMoveable}
      defaultPosition={defaultPosition}
      defaultZoom={defaultZoom}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      preventScrolling={preventScrolling}
      noDragClassName={noDragClassName}
      noZoomClassName={noZoomClassName}
      noPanClassName={noPanClassName}
    >
      <Viewport>
        <EdgeRenderer
          edgeTypes={edgeTypes}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          connectionLineComponent={connectionLineComponent}
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
        />
        <NodeRenderer
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onNodeDrag={onNodeDrag}
          onNodeDragStart={onNodeDragStart}
          selectNodesOnDrag={selectNodesOnDrag}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          noPanClassName={noPanClassName}
        />
      </Viewport>
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
