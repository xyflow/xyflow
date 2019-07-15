import React, { PureComponent } from 'react';

import { Consumer } from '../GraphContext';
import DefaultNode from './NodeTypes/DefaultNode';
import InputNode from './NodeTypes/InputNode';
import OutputNode from './NodeTypes/OutputNode';

class NodeRenderer extends PureComponent {

  renderNode(d, onNodeClick) {
    const nodeType = d.data.type || 'default';
    const NodeComponent = this.props.nodeTypes[nodeType] || DefaultNode;

    return (
      <NodeComponent
        key={d.data.id}
        position={d.position}
        data={d.data}
        style={d.style || {}}
        onNodeClick={onNodeClick}
      />
    );
  }

  render() {
    return (
      <Consumer>
        {({ transform, nodes, onNodeClick }) => (
          <div
            className="react-graph__nodes"
            style={{
              transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.k})`
            }}
          >
            {nodes.map(d => this.renderNode(d, onNodeClick))}
          </div>
        )}
      </Consumer>
    );
  }
}

NodeRenderer.defaultProps = {
  nodeTypes: {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode
  }
};

export default NodeRenderer;
