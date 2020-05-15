import React, { useEffect, useRef, memo, CSSProperties } from 'react';
import classnames from 'classnames';

import { useStoreState, useStoreActions } from '../../store/hooks';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import BackgroundGrid from '../../components/BackgroundGrid';
import useKeyPress from '../../hooks/useKeyPress';
import useD3Zoom from '../../hooks/useD3Zoom';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useElementUpdater from '../../hooks/useElementUpdater';
import { getDimensions } from '../../utils';
import { fitView, zoomIn, zoomOut } from '../../utils/graph';
import { Elements, NodeTypesType, EdgeTypesType, GridType, OnLoadFunc, Node, Edge, Connection } from '../../types';

export interface GraphViewProps {
  elements: Elements;
  onElementClick: (element: Node | Edge) => void;
  onElementsRemove: (elements: Elements) => void;
  onNodeDragStop: (node: Node) => void;
  onConnect: (connection: Connection | Edge) => void;
  onLoad: OnLoadFunc;
  onMove: () => void;
  selectionKeyCode: number;
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  connectionLineType: string;
  connectionLineStyle: CSSProperties;
  deleteKeyCode: number;
  showBackground: boolean;
  backgroundGap: number;
  backgroundColor: string;
  backgroundType: GridType;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleNodes: boolean;
  isInteractive: boolean;
}

const GraphView = memo(
  ({
    nodeTypes,
    edgeTypes,
    onMove,
    onLoad,
    onElementClick,
    onNodeDragStop,
    connectionLineType,
    connectionLineStyle,
    selectionKeyCode,
    onElementsRemove,
    deleteKeyCode,
    elements,
    showBackground,
    backgroundGap,
    backgroundColor,
    backgroundType,
    onConnect,
    snapToGrid,
    snapGrid,
    onlyRenderVisibleNodes,
    isInteractive,
  }: GraphViewProps) => {
    const zoomPane = useRef<HTMLDivElement>(null);
    const rendererNode = useRef<HTMLDivElement>(null);
    const state = useStoreState((s) => ({
      width: s.width,
      height: s.height,
      nodes: s.nodes,
      edges: s.edges,
      d3Initialised: s.d3Initialised,
      nodesSelectionActive: s.nodesSelectionActive,
    }));
    const updateSize = useStoreActions((actions) => actions.updateSize);
    const setNodesSelection = useStoreActions((actions) => actions.setNodesSelection);
    const setOnConnect = useStoreActions((a) => a.setOnConnect);
    const setSnapGrid = useStoreActions((actions) => actions.setSnapGrid);
    const setInteractive = useStoreActions((actions) => actions.setInteractive);
    const selectionKeyPressed = useKeyPress(selectionKeyCode);
    const rendererClasses = classnames('react-flow__renderer', { 'is-interactive': isInteractive });

    const onZoomPaneClick = () => setNodesSelection({ isActive: false });

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
      updateDimensions();
      setOnConnect(onConnect);
      window.onresize = updateDimensions;

      return () => {
        window.onresize = null;
      };
    }, []);

    useD3Zoom(zoomPane, onMove, selectionKeyPressed);

    useEffect(() => {
      if (state.d3Initialised) {
        onLoad({
          fitView,
          zoomIn,
          zoomOut,
        });
      }
    }, [state.d3Initialised]);

    useEffect(() => {
      setSnapGrid({ snapToGrid, snapGrid });
    }, [snapToGrid]);

    useEffect(() => {
      setInteractive(isInteractive);
    }, [isInteractive]);

    useGlobalKeyHandler({ onElementsRemove, deleteKeyCode });
    useElementUpdater(elements);

    return (
      <div className={rendererClasses} ref={rendererNode}>
        {showBackground && (
          <BackgroundGrid gap={backgroundGap} color={backgroundColor} backgroundType={backgroundType} />
        )}
        <NodeRenderer
          nodeTypes={nodeTypes}
          onElementClick={onElementClick}
          onNodeDragStop={onNodeDragStop}
          onlyRenderVisibleNodes={onlyRenderVisibleNodes}
        />
        <EdgeRenderer
          width={state.width}
          height={state.height}
          edgeTypes={edgeTypes}
          onElementClick={onElementClick}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
        />
        {selectionKeyPressed && <UserSelection isInteractive={isInteractive} />}
        {state.nodesSelectionActive && <NodesSelection />}
        <div className="react-flow__zoompane" onClick={onZoomPaneClick} ref={zoomPane} />
      </div>
    );
  }
);

GraphView.displayName = 'GraphView';

export default GraphView;
