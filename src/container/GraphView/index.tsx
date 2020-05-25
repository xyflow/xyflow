import React, { useEffect, useRef, memo, CSSProperties } from 'react';
import classnames from 'classnames';

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
import { fitView, zoomIn, zoomOut, project } from '../../utils/graph';
import { Elements, NodeTypesType, EdgeTypesType, OnLoadFunc, Node, Edge, Connection } from '../../types';

export interface GraphViewProps {
  elements: Elements;
  onElementClick?: (element: Node | Edge) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeDragStart?: (node: Node) => void;
  onNodeDragStop?: (node: Node) => void;
  onConnect?: (connection: Connection | Edge) => void;
  onLoad?: OnLoadFunc;
  onMove?: () => void;
  selectionKeyCode: number;
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  connectionLineType: string;
  connectionLineStyle: CSSProperties;
  deleteKeyCode: number;
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
    isInteractive,
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
      window.onresize = updateDimensions;

      if (onConnect) {
        setOnConnect(onConnect);
      }

      return () => {
        window.onresize = null;
      };
    }, []);

    useD3Zoom({ zoomPane, onMove, selectionKeyPressed });

    useEffect(() => {
      if (d3Initialised && onLoad) {
        onLoad({
          fitView,
          zoomIn,
          zoomOut,
          project,
        });
      }
    }, [d3Initialised, onLoad]);

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
        <NodeRenderer
          nodeTypes={nodeTypes}
          onElementClick={onElementClick}
          onNodeDragStop={onNodeDragStop}
          onNodeDragStart={onNodeDragStart}
          onlyRenderVisibleNodes={onlyRenderVisibleNodes}
        />
        <EdgeRenderer
          width={width}
          height={height}
          edgeTypes={edgeTypes}
          onElementClick={onElementClick}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
        />
        {selectionKeyPressed && <UserSelection isInteractive={isInteractive} />}
        {nodesSelectionActive && <NodesSelection />}
        <div className="react-flow__zoompane" onClick={onZoomPaneClick} ref={zoomPane} />
      </div>
    );
  }
);

GraphView.displayName = 'GraphView';

export default GraphView;
