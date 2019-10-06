import React, { useEffect, useRef, memo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../../components/UserSelection';
import NodesSelection from '../../components/NodesSelection';
import useKeyPress from '../../hooks/useKeyPress';
import useD3Zoom from '../../hooks/useD3Zoom';
import useGlobalKeyHandler from '../../hooks/useGlobalKeyHandler';
import useElementUpdater from '../../hooks/useElementUpdater'
import { getDimensions } from '../../utils';
import { fitView, zoomIn, zoomOut } from '../../utils/graph';

const GraphView = memo(({
  nodeTypes, edgeTypes, onMove, onLoad,
  onElementClick, onNodeDragStop, connectionLineType, connectionLineStyle,
  selectionKeyCode, onElementsRemove, deleteKeyCode, elements,
  onConnect
}) => {
  const zoomPane = useRef();
  const rendererNode = useRef();
  const state = useStoreState(s => ({
    width: s.width,
    height: s.height,
    nodes: s.nodes,
    edges: s.edges,
    d3Initialised: s.d3Initialised,
    nodesSelectionActive: s.nodesSelectionActive
  }));
  const updateSize = useStoreActions(actions => actions.updateSize);
  const setNodesSelection = useStoreActions(actions => actions.setNodesSelection);
  const setOnConnect = useStoreActions(a => a.setOnConnect);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);

  const onZoomPaneClick = () => setNodesSelection({ isActive: false });

  const updateDimensions = () => {
    const size = getDimensions(rendererNode.current);
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
        zoomOut
      });
    }
  }, [state.d3Initialised]);

  useGlobalKeyHandler({ onElementsRemove, deleteKeyCode });
  useElementUpdater({ elements });

  return (
    <div className="react-graph__renderer" ref={rendererNode}>
      <NodeRenderer
        nodeTypes={nodeTypes}
        onElementClick={onElementClick}
        onNodeDragStop={onNodeDragStop}
      />
      <EdgeRenderer
        width={state.width}
        height={state.height}
        edgeTypes={edgeTypes}
        onElementClick={onElementClick}
        connectionLineType={connectionLineType}
        connectionLineStyle={connectionLineStyle}
      />
      {selectionKeyPressed && <UserSelection />}
      {state.nodesSelectionActive && <NodesSelection />}
      <div
        className="react-graph__zoompane"
        onClick={onZoomPaneClick}
        ref={zoomPane}
      />
    </div>
  );
});

GraphView.displayName = 'GraphView';

export default GraphView;
