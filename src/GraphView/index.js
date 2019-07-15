import React, { useEffect, useContext, useRef } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import ReactSizeMe from 'react-sizeme';

import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';

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

        graphContext.updateTransform(event.transform);

        props.onMove();
      });

    const selection = select(zoomNode.current).call(zoom);

    graphContext.initD3ZoomState({ zoom, selection, initialised: true });
  }, []);

  useEffect(
    () => graphContext.updateSize(props.size),
    [props.size.width, props.size.height]
  );

  useEffect(() => {
    if (graphContext.d3ZoomState.initialised) {
      props.onLoad({
        nodes: graphContext.nodes,
        edges: graphContext.edges,
        fitView: graphContext.fitView
      });
    }
  }, [graphContext.d3ZoomState.initialised]);

  useEffect(() => {
    props.onChange({
      nodes: graphContext.nodes,
      edges: graphContext.edges,
    });
  })

  return (
    <div className="react-graph__renderer">
      <NodeRenderer />
      <EdgeRenderer width={graphContext.width} height={graphContext.height} />
      <div className="react-graph__zoomnode" ref={zoomNode} />
    </div>
  );
};


export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
