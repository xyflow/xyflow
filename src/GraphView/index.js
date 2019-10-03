import React, { useEffect, useRef, memo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../UserSelection';
import NodesSelection from '../NodesSelection';
import useKeyPress from '../hooks/useKeyPress';
import useD3Zoom from '../hooks/useD3Zoom';
import { getDimensions } from '../utils';
import { fitView, zoomIn, zoomOut } from '../graph-utils';

const GraphView = memo(({
  nodeTypes, edgeTypes, onMove, onLoad,
  onElementClick, onNodeDragStop, connectionLineType, connectionLineStyle,
  selectionKeyCode
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

  const selectionKeyPressed = useKeyPress(selectionKeyCode);
  const updateDimensions = () => {
    const size = getDimensions(rendererNode.current);
    updateSize(size);
  };

  useEffect(() => {
    updateDimensions();
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
        onClick={() => setNodesSelection({ isActive: false })}
        ref={zoomPane}
      />
    </div>
  );
});

GraphView.displayName = 'GraphView';

export default GraphView;
