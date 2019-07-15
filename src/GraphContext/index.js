import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { zoomIdentity } from 'd3-zoom';
import { getBoundingBox } from '../graph-utils';

export const GraphContext = createContext({});

export const Provider = (props) => {
  const {
    nodes: initNodes,
    edges: initEdges,
    onNodeClick,
    children
  } = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [d3ZoomState, initD3ZoomState] = useState({
    zoom: null, selection: null, initialised: false
  });
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  const updateNodeData = (nodeId, updateData) => {
    const updatedNodes = nodes.map((n) => {
      if (n.data.id === nodeId) {
        n.data = {
          ...n.data,
          ...updateData
        };
      }

      return n;
    });

    setNodes(updatedNodes);
  };

  const updateNodePos = (nodeId, pos) => {
    const updatedNodes = nodes.map((n) => {
      if (n.data.id === nodeId) {
        n.position = pos;
      }

      return n;
    });

    setNodes(updatedNodes);
  };

  const updateTransform = (nextTransform) => {
    setTransform({
      k: Math.round(nextTransform.k * 1000) / 1000,
      x: nextTransform.x,
      y: nextTransform.y
    });
  };

  const fitView = () => {
    const bounds = getBoundingBox(nodes);
    const k = Math.min(width, height) / Math.max(bounds.width, bounds.height);
    const boundsCenterX = bounds.x + (bounds.width / 2);
    const boundsCenterY = bounds.y + (bounds.height / 2);
    const translate = [(width / 2) - (boundsCenterX * k), (height / 2) - (boundsCenterY * k)];
    const initialTransform = zoomIdentity.translate(translate[0], translate[1]).scale(k);

    d3ZoomState.selection.call(d3ZoomState.zoom.transform, initialTransform);
  };

  const updateSize = (size) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  const graphContext = {
    width,
    height,
    updateSize,
    d3ZoomState,
    initD3ZoomState,
    nodes,
    setNodes,
    edges,
    setEdges,
    updateNodeData,
    updateNodePos,
    transform,
    updateTransform,
    onNodeClick,
    fitView
  };

  return (
    <GraphContext.Provider
      value={graphContext}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const { Consumer } = GraphContext;

Provider.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object),
  edges: PropTypes.arrayOf(PropTypes.object)
};

Provider.defaultProps = {
  nodes: [],
  edges: []
};
