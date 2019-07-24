import React, { useEffect, useContext, useRef } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import ReactSizeMe from 'react-sizeme';

import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import UserSelection from '../UserSelection';
import NodesSelection from '../NodesSelection';
import { updateTransform, updateSize, initD3, fitView } from '../state/actions';
import { useKeyPress } from '../hooks';

const d3ZoomInstance = d3Zoom.zoom().scaleExtent([0.5, 2]);

const GraphView = (props) => {
  const zoomPane = useRef(null);
  const graphContext = useContext(GraphContext);
  const shiftPressed = useKeyPress('Shift');

  useEffect(() => {
    const selection = select(zoomPane.current).call(d3ZoomInstance);
    graphContext.dispatch(initD3({ zoom: d3ZoomInstance, selection }));
  }, []);

  useEffect(() => {
    if (shiftPressed) {
      d3ZoomInstance.on('zoom', null);
    } else {
      d3ZoomInstance.on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
          return false;
        }

        graphContext.dispatch(updateTransform(event.transform));

        props.onMove();
      });

      if (graphContext.state.d3Selection) {
        // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
        const graphTransform = d3Zoom.zoomIdentity
            .translate(graphContext.state.transform[0], graphContext.state.transform[1])
            .scale(graphContext.state.transform[2]);

        graphContext.state.d3Selection.call(graphContext.state.d3Zoom.transform, graphTransform);
      }
    }

  }, [shiftPressed]);

  useEffect(
    () => graphContext.dispatch(updateSize(props.size)),
    [props.size.width, props.size.height]
  );

  useEffect(() => {
    if (graphContext.state.d3Initialised) {
      props.onLoad({
        nodes: graphContext.state.nodes,
        edges: graphContext.state.edges,
        fitView: () => graphContext.dispatch(fitView())
      });
    }
  }, [graphContext.state.d3Initialised]);

  useEffect(() => {
    props.onChange({
      nodes: graphContext.state.nodes,
      edges: graphContext.state.edges,
    });
  });

  return (
    <div className="react-graph__renderer">
      <NodeRenderer nodeTypes={props.nodeTypes} />
      <EdgeRenderer width={graphContext.state.width} height={graphContext.state.height} />
      {shiftPressed && <UserSelection />}
      {graphContext.state.nodesSelectionActive && <NodesSelection />}
      <div
        className="react-graph__zoompane"
        ref={zoomPane}
      />
    </div>
  );
};


export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
