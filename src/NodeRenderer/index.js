import React, { PureComponent } from 'react';

import { Consumer } from '../GraphContext';
import DefaultNode from './NodeTypes/DefaultNode';
import InputNode from './NodeTypes/InputNode';
import OutputNode from './NodeTypes/OutputNode';

class NodeRenderer extends PureComponent {

  renderNode(d, onNodeClick) {
    const nodeType = d.data.type || 'default';
    let NodeComponent = null;

    switch (nodeType) {
      case 'input': {
        NodeComponent = this.props.nodeTypes.input || InputNode; break;
      }
      case 'default': {
        NodeComponent = this.props.nodeTypes.default || DefaultNode; break;
      }
      case 'output': {
        NodeComponent = this.props.nodeTypes.output || OutputNode; break;
      }
      default: {
        NodeComponent = this.props.nodeTypes[nodeType] || DefaultNode;
      }
    }

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
        {({ onNodeClick, state }) => (
          <div
            className="react-graph__nodes"
            style={{
              transform: `translate(${state.transform[0]}px,${state.transform[1]}px) scale(${state.transform[2]})`
            }}
          >
            {state.nodes.map(d => this.renderNode(d, onNodeClick))}
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
