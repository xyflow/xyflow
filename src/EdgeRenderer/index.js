import React, { memo, useContext } from 'react';

import { GraphContext } from '../GraphContext';
import ConnectionLine from '../ConnectionLine';

function renderEdge(e, props, graphContext) {
  const edgeType = e.type || 'default';
  const sourceNode = graphContext.state.nodes.find(n => n.id === e.source);
  const targetNode = graphContext.state.nodes.find(n => n.id === e.target);

  if (!sourceNode) {
    throw new Error(`couldn't create edge for source id: ${e.source}`);
  }

  if (!targetNode) {
    throw new Error(`couldn't create edge for target id: ${e.target}`);
  }

  const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
  const hasSourceHandle = !!sourceNode.__rg.handleBounds.source;
  const hasTargetHandle = !!sourceNode.__rg.handleBounds.target;


  return (
    <EdgeComponent
      key={e.id}
      id={e.id}
      type={e.type}
      onClick={props.onElementClick}
      selectedElements={graphContext.state.selectedElements}
      dispatch={graphContext.dispatch}
      animated={e.animated}
      style={e.style}
      source={e.source}
      target={e.target}
      sourceNodeX={sourceNode.__rg.position.x}
      sourceNodeY={sourceNode.__rg.position.y}
      sourceNodeWidth={sourceNode.__rg.width}
      sourceNodeHeight={sourceNode.__rg.height}
      targetNodeX={targetNode.__rg.position.x}
      targetNodeY={targetNode.__rg.position.y}
      targetNodeWidth={targetNode.__rg.width}
      targetNodeHeight={targetNode.__rg.height}
      hasSourceHandle={hasSourceHandle}
      hasTargetHandle={hasTargetHandle}
      sourceHandleX={sourceNode.__rg.handleBounds.source.x}
      sourceHandleY={sourceNode.__rg.handleBounds.source.y}
      sourceHandleWidth={sourceNode.__rg.handleBounds.source.width}
      sourceHandleHeight={sourceNode.__rg.handleBounds.source.height}
      targetHandleX={targetNode.__rg.handleBounds.target.x}
      targetHandleY={targetNode.__rg.handleBounds.target.y}
      targetHandleWidth={targetNode.__rg.handleBounds.target.width}
      targetHandleHeight={targetNode.__rg.handleBounds.target.height}
    />
  );
}

const EdgeRenderer = memo((props) => {
  const graphContext = useContext(GraphContext);
  const {
    width, height, connectionLineStyle, connectionLineType
  } = props;

  if (!width) {
    return null;
  }

  const { transform, edges, nodes, connectionSourceId, connectionPosition } = graphContext.state;
  const transformStyle = `translate(${transform[0]},${transform[1]}) scale(${transform[2]})`;

  return (
    <svg
      width={width}
      height={height}
      className="react-graph__edges"
    >
      <g transform={transformStyle}>
        {edges.map(e => renderEdge(e, props, graphContext))}
        {connectionSourceId && (
          <ConnectionLine
            nodes={nodes}
            connectionSourceId={connectionSourceId}
            connectionPosition={connectionPosition}
            transform={transform}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={connectionLineType}
          />
        )}
      </g>
    </svg>
  );
});

export default EdgeRenderer;
