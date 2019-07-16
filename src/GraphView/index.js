import React, { useEffect, useContext, useRef } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import ReactSizeMe from 'react-sizeme';

import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import { updateTransform, updateSize, initD3, fitView } from '../state/actions';

const GraphView = (props) => {
  const zoomNode = useRef(null);
  const graphContext = useContext(GraphContext);

  useEffect(() => {
    const zoom = d3Zoom.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomNode.current) {
          return false;
        }

        graphContext.dispatch(updateTransform(event.transform));

        props.onMove();
      });

    const selection = select(zoomNode.current).call(zoom);

    graphContext.dispatch(initD3({ zoom, selection }));
  }, []);

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
  })

  return (
    <div className="react-graph__renderer">
      <NodeRenderer />
      <EdgeRenderer width={graphContext.state.width} height={graphContext.state.height} />
      <div className="react-graph__zoomnode" ref={zoomNode} />
    </div>
  );
};


export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
