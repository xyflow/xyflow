import React, { useEffect, useContext, useRef } from 'react';
import styled from '@emotion/styled';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';
import ReactSizeMe from 'react-sizeme';

import { GraphContext } from '../GraphContext';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';

const GraphViewWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const ZoomNode = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

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

  return (
    <GraphViewWrapper>
      <NodeRenderer />
      <EdgeRenderer width={graphContext.width} height={graphContext.height} />
      <ZoomNode ref={zoomNode} />
    </GraphViewWrapper>
  );
};


export default ReactSizeMe.withSize({ monitorHeight: true })(GraphView);
