import React, { useEffect, useRef, memo } from 'react';

import { useStoreApi } from '../../store';
import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import { onLoadProject, onLoadGetElements, onLoadToObject } from '../../utils/graph';
import useZoomPanHelper from '../../hooks/useZoomPanHelper';

import { ReactFlowProps } from '../ReactFlow';

import { NodeTypesType, EdgeTypesType, ConnectionLineType, KeyCode } from '../../types';

export interface GraphViewProps extends Omit<ReactFlowProps, 'onSelectionChange'> {
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  selectionKeyCode: KeyCode;
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
  connectionLineType: ConnectionLineType;
  onlyRenderVisibleElements: boolean;
  defaultZoom: number;
  defaultPosition: [number, number];
  arrowHeadColor: string;
  selectNodesOnDrag: boolean;
}

const GraphView = ({
  nodes,
  edges,
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
  arrowHeadColor,
  markerEndId,
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
}: GraphViewProps) => {
  const isInitialized = useRef<boolean>(false);
  const store = useStoreApi();
  const { zoomIn, zoomOut, zoomTo, transform, fitView, initialized } = useZoomPanHelper();

  useEffect(() => {
    if (!isInitialized.current && initialized) {
      if (onLoad) {
        onLoad({
          fitView: (params = { padding: 0.1 }) => fitView(params),
          zoomIn,
          zoomOut,
          zoomTo,
          setTransform: transform,
          project: onLoadProject(store.getState),
          getElements: onLoadGetElements(store.getState),
          toObject: onLoadToObject(store.getState),
        });
      }

      isInitialized.current = true;
    }
  }, [onLoad, zoomIn, zoomOut, zoomTo, transform, fitView, initialized]);

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
    >
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
        nodes={nodes}
      />
      <EdgeRenderer
        edgeTypes={edgeTypes}
        onEdgeClick={onEdgeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
        connectionLineComponent={connectionLineComponent}
        arrowHeadColor={arrowHeadColor}
        markerEndId={markerEndId}
        onEdgeUpdate={onEdgeUpdate}
        onlyRenderVisibleElements={onlyRenderVisibleElements}
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseMove={onEdgeMouseMove}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        edgeUpdaterRadius={edgeUpdaterRadius}
        nodes={nodes}
        edges={edges}
      />
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
