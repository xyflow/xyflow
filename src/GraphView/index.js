import React, { useEffect, useContext, useRef, memo } from 'react';

import { Provider } from '../ConnectionContext';
import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../UserSelection';
import NodesSelection from '../NodesSelection';
import { setNodesSelection } from '../state/actions';
import { updateSize, fitView, zoomIn, zoomOut } from '../state/view-actions';
import useKeyPress from '../hooks/useKeyPress';
import useD3Zoom from '../hooks/useD3Zoom';
import { getDimensions } from '../utils';

const GraphView = memo((props) => {
  const zoomPane = useRef();
  const rendererNode = useRef();
  const { state, dispatch } = useContext(GraphContext);
  const shiftPressed = useKeyPress('Shift');
  const updateDimensions = () => {
    const size = getDimensions(rendererNode.current);
    dispatch(updateSize(size));
  };

  useEffect(() => {
    updateDimensions();
    window.onresize = updateDimensions;

    return () => {
      window.onresize = null;
    };
  }, []);

  useD3Zoom(zoomPane, props.onMove, shiftPressed);

  useEffect(() => {
    if (state.d3Initialised) {
      props.onLoad({
        nodes: state.nodes,
        edges: state.edges,
        fitView: opts => dispatch(fitView(opts)),
        zoomIn: () => dispatch(zoomIn()),
        zoomOut: () => dispatch(zoomOut())
      });
    }
  }, [state.d3Initialised]);

  return (
    <div className="react-graph__renderer" ref={rendererNode}>
      <Provider onConnect={props.onConnect}>
        <NodeRenderer
          nodeTypes={props.nodeTypes}
          onElementClick={props.onElementClick}
          onNodeDragStop={props.onNodeDragStop}
        />
        <EdgeRenderer
          width={state.width}
          height={state.height}
          edgeTypes={props.edgeTypes}
          onElementClick={props.onElementClick}
          connectionLineType={props.connectionLineType}
          connectionLineStyle={props.connectionLineStyle}
        />
      </Provider>
      {shiftPressed && <UserSelection />}
      {state.nodesSelectionActive && <NodesSelection />}
      <div
        className="react-graph__zoompane"
        onClick={() => dispatch(setNodesSelection({ isActive: false }))}
        ref={zoomPane}
      />
    </div>
  );
});

GraphView.displayName = 'GraphView';

export default GraphView;
