import React, { useEffect, useRef, useCallback, memo, CSSProperties, MouseEvent, WheelEvent } from 'react';

import { useStoreState, useStoreActions, useStore } from '../../store/hooks';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import useKeyPress from '../../hooks/useKeyPress';
import useD3Zoom from '../../hooks/useD3Zoom';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useElementUpdater from '../../hooks/useElementUpdater';
import useResizeHandler from '../../hooks/useResizeHandler';
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
  FlowTransform,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
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
  selectionKeyCode: number;
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  connectionLineType: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  deleteKeyCode: number;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleNodes: boolean;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  selectNodesOnDrag: boolean;
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  defaultPosition: [number, number];
  arrowHeadColor: string;
  markerEndId?: string;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  paneMoveable: boolean;
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
  connectionLineType,
  connectionLineStyle,
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
  selectNodesOnDrag,
  minZoom,
  maxZoom,
  defaultZoom,
  defaultPosition,
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
  const zoomPane = useRef<HTMLDivElement>(null);
  const rendererNode = useRef<HTMLDivElement>(null);
  const d3Initialised = useStoreState((state) => state.d3Initialised);
  const nodesSelectionActive = useStoreState((state) => state.nodesSelectionActive);
  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const setOnConnect = useStoreActions((actions) => actions.setOnConnect);
  const setOnConnectStart = useStoreActions((actions) => actions.setOnConnectStart);
  const setOnConnectStop = useStoreActions((actions) => actions.setOnConnectStop);
  const setOnConnectEnd = useStoreActions((actions) => actions.setOnConnectEnd);
  const setSnapGrid = useStoreActions((actions) => actions.setSnapGrid);
  const setNodesDraggable = useStoreActions((actions) => actions.setNodesDraggable);
  const setNodesConnectable = useStoreActions((actions) => actions.setNodesConnectable);
  const setElementsSelectable = useStoreActions((actions) => actions.setElementsSelectable);
  const setInitTransform = useStoreActions((actions) => actions.setInitTransform);
  const setMinMaxZoom = useStoreActions((actions) => actions.setMinMaxZoom);
  const fitView = useStoreActions((actions) => actions.fitView);
  const zoom = useStoreActions((actions) => actions.zoom);
  const zoomTo = useStoreActions((actions) => actions.zoomTo);
  const currentStore = useStore();

  const onZoomPaneClick = useCallback(
    (event: React.MouseEvent) => {
      onPaneClick?.(event);
      unsetNodesSelection();
    },
    [onPaneClick]
  );

  const onZoomPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      onPaneContextMenu?.(event);
    },
    [onPaneContextMenu]
  );

  const onZoomPaneScroll = useCallback(
    (event: WheelEvent) => {
      onPaneScroll?.(event);
    },
    [onPaneScroll]
  );

  useResizeHandler(rendererNode);
  useGlobalKeyHandler({ onElementsRemove, deleteKeyCode });
  useElementUpdater(elements);

  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  useD3Zoom({
    zoomPane,
    onMove,
    onMoveStart,
    onMoveEnd,
    selectionKeyPressed,
    zoomOnScroll,
    zoomOnDoubleClick,
    paneMoveable,
  });

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

      const initialTransform = {
        x: defaultPosition[0],
        y: defaultPosition[1],
        k: defaultZoom,
      };

      if (initialTransform.x !== 0 || initialTransform.y !== 0 || initialTransform.k !== 1) {
        setInitTransform(initialTransform);
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
    setSnapGrid({ snapToGrid, snapGrid });
  }, [snapToGrid, snapGrid]);

  useEffect(() => {
    setNodesDraggable(nodesDraggable);
  }, [nodesDraggable]);

  useEffect(() => {
    setNodesConnectable(nodesConnectable);
  }, [nodesConnectable]);

  useEffect(() => {
    setElementsSelectable(elementsSelectable);
  }, [elementsSelectable]);

  useEffect(() => {
    setMinMaxZoom({ minZoom, maxZoom });
  }, [minZoom, maxZoom]);

  return (
    <div className="react-flow__renderer" ref={rendererNode}>
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
      />
      <EdgeRenderer
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
        arrowHeadColor={arrowHeadColor}
        markerEndId={markerEndId}
      />
      <UserSelection selectionKeyPressed={selectionKeyPressed} />
      {nodesSelectionActive && (
        <NodesSelection
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStop={onSelectionDragStop}
        />
      )}
      <div
        className="react-flow__zoompane"
        onClick={onZoomPaneClick}
        onContextMenu={onZoomPaneContextMenu}
        onWheel={onZoomPaneScroll}
        ref={zoomPane}
      />
    </div>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
