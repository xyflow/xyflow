import React, { memo } from 'react';

import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import Viewport from '../Viewport';
import useOnInitHandler from '../../hooks/useOnInitHandler';
import { NodeTypesWrapped, EdgeTypesWrapped, ConnectionLineType, KeyCode, ReactFlowProps } from '../../types';

export interface GraphViewProps
  extends Omit<ReactFlowProps, 'onSelectionChange' | 'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'> {
  nodeTypes: NodeTypesWrapped;
  edgeTypes: EdgeTypesWrapped;
  selectionKeyCode: KeyCode | null;
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
  connectionLineType: ConnectionLineType;
  onlyRenderVisibleElements: boolean;
  defaultZoom: number;
  defaultPosition: [number, number];
  defaultMarkerColor: string;
  selectNodesOnDrag: boolean;
  noDragClassName: string;
  noWheelClassName: string;
  noPanClassName: string;
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
  panOnDrag,
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
  noWheelClassName,
  noPanClassName,
  elevateEdgesOnSelect,
  id,
}: GraphViewProps) => {
  useOnInitHandler(onInit);

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
      panOnDrag={panOnDrag}
      defaultPosition={defaultPosition}
      defaultZoom={defaultZoom}
      onSelectionContextMenu={onSelectionContextMenu}
      preventScrolling={preventScrolling}
      noDragClassName={noDragClassName}
      noWheelClassName={noWheelClassName}
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
          rfId={id}
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
        />
      </Viewport>
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
