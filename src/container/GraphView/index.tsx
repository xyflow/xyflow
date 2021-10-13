import React, { useEffect, useRef, memo } from 'react';

import { useStore, useStoreApi } from '../../store';
import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import { onLoadProject, onLoadGetElements, onLoadToObject } from '../../utils/graph';
import useZoomPanHelper from '../../hooks/useZoomPanHelper';

import { ReactFlowProps } from '../ReactFlow';

import { NodeTypesType, EdgeTypesType, ConnectionLineType, KeyCode, ReactFlowState } from '../../types';

export interface GraphViewProps extends Omit<ReactFlowProps, 'onSelectionChange' | 'nodes' | 'edges'> {
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  selectionKeyCode: KeyCode;
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
  connectionLineType: ConnectionLineType;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleElements: boolean;
  defaultZoom: number;
  defaultPosition: [number, number];
  arrowHeadColor: string;
  selectNodesOnDrag: boolean;
}

const selector = (s: ReactFlowState) => ({
  setOnConnect: s.setOnConnect,
  setOnConnectStart: s.setOnConnectStart,
  setOnConnectStop: s.setOnConnectStop,
  setOnConnectEnd: s.setOnConnectEnd,
  setSnapGrid: s.setSnapGrid,
  setSnapToGrid: s.setSnapToGrid,
  setNodesDraggable: s.setNodesDraggable,
  setNodesConnectable: s.setNodesConnectable,
  setElementsSelectable: s.setElementsSelectable,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  setConnectionMode: s.setConnectionMode,
  setOnNodesChange: s.setOnNodesChange,
  setOnEdgesChange: s.setOnEdgesChange,
});

const GraphView = ({
  nodeTypes,
  edgeTypes,
  onMove,
  onMoveStart,
  onMoveEnd,
  onLoad,
  onElementClick,
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
  connectionMode,
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  selectionKeyCode,
  multiSelectionKeyCode,
  zoomActivationKeyCode,
  deleteKeyCode,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  snapToGrid,
  snapGrid,
  onlyRenderVisibleElements,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  selectNodesOnDrag,
  minZoom,
  maxZoom,
  defaultZoom,
  defaultPosition,
  translateExtent,
  preventScrolling,
  nodeExtent,
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
  onNodesChange,
  onEdgesChange,
}: GraphViewProps) => {
  const isInitialized = useRef<boolean>(false);
  const store = useStoreApi();

  const {
    setOnConnect,
    setOnConnectStart,
    setOnConnectStop,
    setOnConnectEnd,
    setSnapGrid,
    setSnapToGrid,
    setNodesDraggable,
    setNodesConnectable,
    setElementsSelectable,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    setConnectionMode,
    setOnNodesChange,
    setOnEdgesChange,
  } = useStore(selector);

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

  useEffect(() => {
    if (onConnect) {
      setOnConnect(onConnect);
    }
  }, [onConnect]);

  useEffect(() => {
    if (onConnectStart) {
      setOnConnectStart(onConnectStart);
    }
  }, [onConnectStart]);

  useEffect(() => {
    if (onConnectStop) {
      setOnConnectStop(onConnectStop);
    }
  }, [onConnectStop]);

  useEffect(() => {
    if (onConnectEnd) {
      setOnConnectEnd(onConnectEnd);
    }
  }, [onConnectEnd]);

  useEffect(() => {
    if (typeof snapToGrid !== 'undefined') {
      setSnapToGrid(snapToGrid);
    }
  }, [snapToGrid]);

  useEffect(() => {
    if (typeof snapGrid !== 'undefined') {
      setSnapGrid(snapGrid);
    }
  }, [snapGrid]);

  useEffect(() => {
    if (typeof nodesDraggable !== 'undefined') {
      setNodesDraggable(nodesDraggable);
    }
  }, [nodesDraggable]);

  useEffect(() => {
    if (typeof nodesConnectable !== 'undefined') {
      setNodesConnectable(nodesConnectable);
    }
  }, [nodesConnectable]);

  useEffect(() => {
    if (typeof elementsSelectable !== 'undefined') {
      setElementsSelectable(elementsSelectable);
    }
  }, [elementsSelectable]);

  useEffect(() => {
    if (typeof minZoom !== 'undefined') {
      setMinZoom(minZoom);
    }
  }, [minZoom]);

  useEffect(() => {
    if (typeof maxZoom !== 'undefined') {
      setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    if (typeof translateExtent !== 'undefined') {
      setTranslateExtent(translateExtent);
    }
  }, [translateExtent]);

  useEffect(() => {
    if (typeof nodeExtent !== 'undefined') {
      setNodeExtent(nodeExtent);
    }
  }, [nodeExtent]);

  useEffect(() => {
    if (typeof connectionMode !== 'undefined') {
      setConnectionMode(connectionMode);
    }
  }, [connectionMode]);

  useEffect(() => {
    if (typeof onNodesChange !== 'undefined') {
      setOnNodesChange(onNodesChange);
    }
  }, [onNodesChange]);

  useEffect(() => {
    if (typeof onEdgesChange !== 'undefined') {
      setOnEdgesChange(onEdgesChange);
    }
  }, [onEdgesChange]);

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
      translateExtent={translateExtent}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
      preventScrolling={preventScrolling}
    >
      <NodeRenderer
        nodeTypes={nodeTypes}
        onElementClick={onElementClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseMove={onNodeMouseMove}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onNodeDrag={onNodeDrag}
        onNodeDragStart={onNodeDragStart}
        selectNodesOnDrag={selectNodesOnDrag}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        onlyRenderVisibleElements={onlyRenderVisibleElements}
      />
      <EdgeRenderer
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
        connectionLineComponent={connectionLineComponent}
        connectionMode={connectionMode}
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
      />
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
