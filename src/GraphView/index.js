import React, { useEffect, useContext, useRef, memo } from 'react';
import ReactSizeMe from 'react-sizeme';

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

const GraphView = memo((props) => {
  const zoomPane = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const shiftPressed = useKeyPress('Shift');

  useD3Zoom(zoomPane, props.onMove, shiftPressed);

  useEffect(
    () => dispatch(updateSize(props.size)),
    [props.size.width, props.size.height]
  );

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
    <div className="react-graph__renderer">
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

export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
