import React, { memo } from 'react';
import { useStoreState } from 'easy-peasy';

import { isNode } from '../../utils/graph';

function renderNode(d, props, state) {
  const nodeType = d.type || 'default';

  if (!props.nodeTypes[nodeType]) {
    console.warn(`No node type found for type "${nodeType}". Using fallback type "default".`);
  }

  const NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes.default;
  const selected = state.selectedElements
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
      transform={state.transform}
      selected={selected}
      style={d.style}
    />
  );
}

const NodeRenderer = memo((props) => {
  const state = useStoreState(s => ({
    nodes: s.nodes,
    transform: s.transform,
    selectedElements: s.selectedElements
  }));

  const { transform, nodes } = state;
  const transformStyle = { transform : `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})` };

  return (
    <div
      className="react-graph__nodes"
      style={transformStyle}
    >
      {nodes.map(d => renderNode(d, props, state))}
    </div>
  );
});

NodeRenderer.displayName = 'NodeRenderer';
NodeRenderer.whyDidYouRender = false;

export default NodeRenderer;
