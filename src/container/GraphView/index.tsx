import React, { useEffect, useRef, memo, CSSProperties, MouseEvent } from 'react';
import { ResizeObserver } from 'resize-observer';

import { useStoreState, useStoreActions } from '../../store/hooks';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import useKeyPress from '../../hooks/useKeyPress';
import useD3Zoom from '../../hooks/useD3Zoom';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useElementUpdater from '../../hooks/useElementUpdater';
import { getDimensions } from '../../utils';
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
} from '../../types';

export interface GraphViewProps {
  elements: Elements;
  onElementClick?: (element: Node | Edge) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeMouseEnter?: (evt: MouseEvent, node: Node) => void;
  onNodeMouseMove?: (evt: MouseEvent, node: Node) => void;
  onNodeMouseLeave?: (evt: MouseEvent, node: Node) => void;
  onNodeContextMenu?: (evt: MouseEvent, node: Node) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  onConnect?: (connection: Connection | Edge) => void;
  onLoad?: OnLoadFunc;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  onZoomPaneClick?: () => void;
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
  onZoomPaneClick,
}: GraphViewProps) => {
  const zoomPane = useRef<HTMLDivElement>(null);
  const rendererNode = useRef<HTMLDivElement>(null);
  const width = useStoreState((s) => s.width);
  const height = useStoreState((s) => s.height);
  const d3Initialised = useStoreState((s) => s.d3Initialised);
  const nodesSelectionActive = useStoreState((s) => s.nodesSelectionActive);
  const updateSize = useStoreActions((actions) => actions.updateSize);
  const setNodesSelection = useStoreActions((actions) => actions.setNodesSelection);
  const setOnConnect = useStoreActions((a) => a.setOnConnect);
  const setSnapGrid = useStoreActions((actions) => actions.setSnapGrid);
  const setNodesDraggable = useStoreActions((actions) => actions.setNodesDraggable);
  const setNodesConnectable = useStoreActions((actions) => actions.setNodesConnectable);
  const setElementsSelectable = useStoreActions((actions) => actions.setElementsSelectable);
  const setInitTransform = useStoreActions((actions) => actions.setInitTransform);
  const setMinMaxZoom = useStoreActions((actions) => actions.setMinMaxZoom);
  const fitView = useStoreActions((actions) => actions.fitView);
  const zoom = useStoreActions((actions) => actions.zoom);

  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  const handleZoomPaneClick = () => {
    onZoomPaneClick?.();
    setNodesSelection({ isActive: false });
  };

  const updateDimensions = () => {
    if (!rendererNode.current) {
      return;
    }

    const size = getDimensions(rendererNode.current);

    if (size.height === 0 || size.width === 0) {
      throw new Error('The React Flow parent container needs a width and a height to render the graph.');
    }

    updateSize(size);
  };

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    updateDimensions();
    window.onresize = updateDimensions;

    if (rendererNode.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let _ of entries) {
          updateDimensions();
        }
      });

      resizeObserver.observe(rendererNode.current);
    }

    return () => {
      window.onresize = null;

      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current!);
      }
    };
  }, []);

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
    if (d3Initialised && onLoad) {
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

    if (d3Initialised) {
      const initialTransform = {
        x: defaultPosition[0],
        y: defaultPosition[1],
        k: defaultZoom,
      };

      if (initialTransform.x !== 0 || initialTransform.y !== 0 || initialTransform.k !== 1) {
        setInitTransform(initialTransform);
      }
    }
  }, [d3Initialised, onLoad]);

  useEffect(() => {
    if (onConnect) {
      setOnConnect(onConnect);
    }
  }, [onConnect]);

  useEffect(() => {
    setSnapGrid({ snapToGrid, snapGrid });
  }, [snapToGrid]);

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

  useGlobalKeyHandler({ onElementsRemove, deleteKeyCode });
  useElementUpdater(elements);

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
        width={width}
        height={height}
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
        arrowHeadColor={arrowHeadColor}
        markerEndId={markerEndId}
      />
      <UserSelection selectionKeyPressed={selectionKeyPressed} />
      {nodesSelectionActive && <NodesSelection />}
      <div className="react-flow__zoompane" onClick={handleZoomPaneClick} ref={zoomPane} />
    </div>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
