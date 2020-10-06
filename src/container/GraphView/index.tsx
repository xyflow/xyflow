import React, { useEffect, useRef, memo, CSSProperties, MouseEvent, WheelEvent } from 'react';

import { useStoreState, useStoreActions, useStore } from '../../store/hooks';
import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import useElementUpdater from '../../hooks/useElementUpdater';
import { onLoadProject, onLoadGetElements } from '../../utils/graph';
import {
  Elements,
  NodeTypesType,
  EdgeTypesType,
  OnLoadFunc,
  Node,
  Edge,
  Connection,
  ConnectionLineType,
  ConnectionLineComponent,
  FlowTransform,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  TranslateExtent,
} from '../../types';

export interface GraphViewProps {
  elements: Elements;
  onElementClick?: (event: MouseEvent, element: Node | Edge) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (event: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (event: MouseEvent, node: Node) => void;
  onNodeDragStart?: (event: MouseEvent, node: Node) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node) => void;
  onConnect?: (connection: Connection | Edge) => void;
  onConnectStart?: OnConnectStartFunc;
  onConnectStop?: OnConnectStopFunc;
  onConnectEnd?: OnConnectEndFunc;
  onLoad?: OnLoadFunc;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
  onSelectionDragStart?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: MouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: Node[]) => void;
  selectionKeyCode: number;
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  deleteKeyCode: number;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleNodes: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom: number;
  defaultPosition: [number, number];
  translateExtent?: TranslateExtent;
  arrowHeadColor: string;
  markerEndId?: string;
  zoomOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  paneMoveable?: boolean;
}

const GraphView = ({
  nodeTypes,
  edgeTypes,
  onMove,
  onMoveStart,
  onMoveEnd,
  onLoad,
  onElementClick,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeContextMenu,
  onNodeDragStart,
  onNodeDragStop,
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  selectionKeyCode,
  onElementsRemove,
  deleteKeyCode,
  elements,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  snapToGrid,
  snapGrid,
  onlyRenderVisibleNodes,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  selectNodesOnDrag = true,
  minZoom,
  maxZoom,
  defaultZoom,
  defaultPosition,
  translateExtent,
  arrowHeadColor,
  markerEndId,
  zoomOnScroll,
  zoomOnDoubleClick,
  paneMoveable,
  onPaneClick,
  onPaneScroll,
  onPaneContextMenu,
}: GraphViewProps) => {
  const isInitialised = useRef<boolean>(false);
  const d3Initialised = useStoreState((state) => state.d3Initialised);
  const setOnConnect = useStoreActions((actions) => actions.setOnConnect);
  const setOnConnectStart = useStoreActions((actions) => actions.setOnConnectStart);
  const setOnConnectStop = useStoreActions((actions) => actions.setOnConnectStop);
  const setOnConnectEnd = useStoreActions((actions) => actions.setOnConnectEnd);
  const setSnapGrid = useStoreActions((actions) => actions.setSnapGrid);
  const setSnapToGrid = useStoreActions((actions) => actions.setSnapToGrid);
  const setNodesDraggable = useStoreActions((actions) => actions.setNodesDraggable);
  const setNodesConnectable = useStoreActions((actions) => actions.setNodesConnectable);
  const setElementsSelectable = useStoreActions((actions) => actions.setElementsSelectable);
  const setInitTransform = useStoreActions((actions) => actions.setInitTransform);
  const setMinZoom = useStoreActions((actions) => actions.setMinZoom);
  const setMaxZoom = useStoreActions((actions) => actions.setMaxZoom);
  const setTranslateExtent = useStoreActions((actions) => actions.setTranslateExtent);
  const fitView = useStoreActions((actions) => actions.fitView);
  const zoom = useStoreActions((actions) => actions.zoom);
  const zoomTo = useStoreActions((actions) => actions.zoomTo);
  const currentStore = useStore();

  useElementUpdater(elements);

  useEffect(() => {
    if (!isInitialised.current && d3Initialised) {
      if (onLoad) {
        onLoad({
          fitView: (params = { padding: 0.1 }) => fitView(params),
          zoomIn: () => zoom(0.2),
          zoomOut: () => zoom(-0.2),
          zoomTo: (zoomLevel) => zoomTo(zoomLevel),
          project: onLoadProject(currentStore),
          getElements: onLoadGetElements(currentStore),
          setTransform: (transform: FlowTransform) =>
            setInitTransform({ x: transform.x, y: transform.y, k: transform.zoom }),
        });
      }

      isInitialised.current = true;
    }
  }, [d3Initialised, onLoad]);

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

  return (
    <FlowRenderer
      onPaneClick={onPaneClick}
      onPaneContextMenu={onPaneContextMenu}
      onPaneScroll={onPaneScroll}
      onElementsRemove={onElementsRemove}
      deleteKeyCode={deleteKeyCode}
      selectionKeyCode={selectionKeyCode}
      onMove={onMove}
      onMoveStart={onMoveStart}
      onMoveEnd={onMoveEnd}
      zoomOnScroll={zoomOnScroll}
      zoomOnDoubleClick={zoomOnDoubleClick}
      paneMoveable={paneMoveable}
      defaultPosition={defaultPosition}
      defaultZoom={defaultZoom}
      translateExtent={translateExtent}
      onSelectionDragStart={onSelectionDragStart}
      onSelectionDrag={onSelectionDrag}
      onSelectionDragStop={onSelectionDragStop}
      onSelectionContextMenu={onSelectionContextMenu}
    >
      <NodeRenderer
        nodeTypes={nodeTypes}
        onElementClick={onElementClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseMove={onNodeMouseMove}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDragStop={onNodeDragStop}
        onNodeDragStart={onNodeDragStart}
        onlyRenderVisibleNodes={onlyRenderVisibleNodes}
        selectNodesOnDrag={selectNodesOnDrag}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
      />
      <EdgeRenderer
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
        arrowHeadColor={arrowHeadColor}
        markerEndId={markerEndId}
        connectionLineComponent={connectionLineComponent}
      />
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
