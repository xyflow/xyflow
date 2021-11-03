import React, { useEffect, useRef, memo } from 'react';

import { useStoreApi, useStore } from '../../store';
import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import { onLoadProject, onLoadGetNodes, onLoadGetEdges, onLoadToObject } from '../../utils/graph';
import useZoomPanHelper from '../../hooks/useZoomPanHelper';

import { ReactFlowProps } from '../ReactFlow';

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
}: GraphViewProps) => {
  const isInitialized = useRef<boolean>(false);
  const store = useStoreApi();
  const { zoomIn, zoomOut, zoomTo, transform: setTransform, fitView, initialized } = useZoomPanHelper();
  const transform = useStore((s) => s.transform);

  useEffect(() => {
    if (!isInitialized.current && initialized) {
      if (onLoad) {
        onLoad({
          fitView: (params = { padding: 0.1 }) => fitView(params),
          zoomIn,
          zoomOut,
          zoomTo,
          setTransform: setTransform,
          project: onLoadProject(store.getState),
          getNodes: onLoadGetNodes(store.getState),
          getEdges: onLoadGetEdges(store.getState),
          toObject: onLoadToObject(store.getState),
        });
      }

      isInitialized.current = true;
    }
  }, [onLoad, zoomIn, zoomOut, zoomTo, transform, fitView, initialized]);

  const transformStyle = {
    transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
    transformOrigin: '0 0',
  };

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
      <div className="react-flow__container" style={{ zIndex: 2, ...transformStyle }}>
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
        />
      </div>
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
