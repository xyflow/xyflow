import React, { memo, useContext } from 'react';

import { GraphContext } from '../GraphContext';
import { isNode } from '../graph-utils';

function renderNode(d, props, graphContext) {
  const nodeType = d.type || 'default';

  if (!props.nodeTypes[nodeType]) {
    console.warn(`No node type found for type "${nodeType}". Using fallback type "default".`);
  }

  const NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes.default;
  const selected = graphContext.state.selectedElements
    .filter(isNode)
    .map(e => e.id)
    .includes(d.id);

  return (
    <NodeComponent
      key={d.id}
      id={d.id}
      type={d.type}
      data={d.data}
      xPos={d.__rg.position.x}
      yPos={d.__rg.position.y}
      onClick={props.onElementClick}
      onNodeDragStop={props.onNodeDragStop}
      dispatch={graphContext.dispatch}
      transform={graphContext.state.transform}
      getNodeById={graphContext.getNodeById}
      selected={selected}
      style={d.style}
    />
  );
}

const NodeRenderer = memo((props) => {
  const graphContext = useContext(GraphContext);
  const { transform, nodes } = graphContext.state;
  const transformStyle = { transform : `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})` };

  return (
    <div
      className="react-graph__nodes"
      style={transformStyle}
    >
      {nodes.map(d => renderNode(d, props, graphContext))}
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';
NodeRenderer.whyDidYouRender = false;

export default NodeRenderer;
