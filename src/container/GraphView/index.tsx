import React, { useEffect, useRef, useCallback, memo, CSSProperties, MouseEvent } from 'react';

import { useStoreState, useStoreActions } from '../../store/hooks';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import useKeyPress from '../../hooks/useKeyPress';
import useD3Zoom from '../../hooks/useD3Zoom';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useElementUpdater from '../../hooks/useElementUpdater';
import useResizeHandler from '../../hooks/useResizeHandler';
import { project, getElements } from '../../utils/graph';
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
} from '../../types';

export interface GraphViewProps {
  elements: Elements;
  onElementClick?: (evt: MouseEvent, element: Node | Edge) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeMouseEnter?: (evt: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (evt: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (evt: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (evt: MouseEvent, node: Node) => void;
  onNodeDragStart?: (evt: MouseEvent, node: Node) => void;
  onNodeDragStop?: (evt: MouseEvent, node: Node) => void;
  onConnect?: (connection: Connection | Edge) => void;
  onConnectStart?: OnConnectStartFunc;
  onConnectStop?: OnConnectStopFunc;
  onLoad?: OnLoadFunc;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  onPaneClick?: (evt: MouseEvent) => void;
  onPaneContextMenu?: (evt: MouseEvent) => void;
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
  connectionLineType,
  connectionLineStyle,
  selectionKeyCode,
  onElementsRemove,
  deleteKeyCode,
  elements,
  onConnect,
  onConnectStart,
  onConnectStop,
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
  const setSnapGrid = useStoreActions((actions) => actions.setSnapGrid);
  const setNodesDraggable = useStoreActions((actions) => actions.setNodesDraggable);
  const setNodesConnectable = useStoreActions((actions) => actions.setNodesConnectable);
  const setElementsSelectable = useStoreActions((actions) => actions.setElementsSelectable);
  const setInitTransform = useStoreActions((actions) => actions.setInitTransform);
  const setMinMaxZoom = useStoreActions((actions) => actions.setMinMaxZoom);
  const fitView = useStoreActions((actions) => actions.fitView);
  const zoom = useStoreActions((actions) => actions.zoom);

  const onZoomPaneClick = useCallback(
    (evt: React.MouseEvent) => {
      onPaneClick?.(evt);
      unsetNodesSelection();
    },
    [onPaneClick]
  );

  const onZoomPaneContextMenu = useCallback(
    (evt: React.MouseEvent) => {
      onPaneContextMenu?.(evt);
    },
    [onPaneContextMenu]
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
          project,
          getElements,
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
      {nodesSelectionActive && <NodesSelection />}
      <div
        className="react-flow__zoompane"
        onClick={onZoomPaneClick}
        onContextMenu={onZoomPaneContextMenu}
        ref={zoomPane}
      />
    </div>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
