import React, { useEffect, useContext, useRef } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import ReactSizeMe from 'react-sizeme';

import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../UserSelection';
import NodesSelection from '../NodesSelection';
import { updateTransform, updateSize, initD3, fitView, setNodesSelection } from '../state/actions';
import { useKeyPress } from '../hooks';

const d3ZoomInstance = d3Zoom.zoom().scaleExtent([0.5, 2]);

const GraphView = (props) => {
  const zoomPane = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const shiftPressed = useKeyPress('Shift');

  useEffect(() => {
    const selection = select(zoomPane.current).call(d3ZoomInstance);
    dispatch(initD3({ zoom: d3ZoomInstance, selection }));
  }, []);

  useEffect(() => {
    if (shiftPressed) {
      d3ZoomInstance.on('zoom', null);
    } else {
      d3ZoomInstance.on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
          return false;
        }

        dispatch(updateTransform(event.transform));

        props.onMove();
      });

      if (state.d3Selection) {
        // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
        const graphTransform = d3Zoom.zoomIdentity
            .translate(state.transform[0], state.transform[1])
            .scale(state.transform[2]);

        state.d3Selection.call(state.d3Zoom.transform, graphTransform);
      }
    }

  }, [shiftPressed]);

  useEffect(
    () => dispatch(updateSize(props.size)),
    [props.size.width, props.size.height]
  );

  useEffect(() => {
    if (state.d3Initialised) {
      props.onLoad({
        nodes: state.nodes,
        edges: state.edges,
        fitView: () => dispatch(fitView())
      });
    }
  }, [state.d3Initialised]);

  useEffect(() => {
    props.onChange({
      nodes: state.nodes,
      edges: state.edges,
    });
  });

  return (
    <div className="react-graph__renderer">
      <NodeRenderer nodeTypes={props.nodeTypes} />
      <EdgeRenderer
        width={state.width}
        height={state.height}
        edgeTypes={props.edgeTypes}
      />
      {shiftPressed && <UserSelection />}
      {state.nodesSelectionActive && <NodesSelection />}
      <div
        className="react-graph__zoompane"
        onClick={() => dispatch(setNodesSelection({ isActive: false }))}
        ref={zoomPane}
      />
    </div>
  );
};


export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
