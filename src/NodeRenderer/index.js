import React, { PureComponent } from 'react';

import { Consumer } from '../GraphContext';

class NodeRenderer extends PureComponent {

  renderNode(d, onElementClick) {
    const nodeType = d.type || 'default';
    if (!this.props.nodeTypes[nodeType]) {
      console.warn(`No node type found for type "${nodeType}". Using fallback type "default".`);
    }

    const NodeComponent = this.props.nodeTypes[nodeType] || this.props.nodeTypes.default;

    return (
      <NodeComponent
        key={d.id}
        onClick={onElementClick}
        {...d}
      />
    );
  }

  render() {
    return (
      <Consumer>
        {({ onElementClick, state }) => (
          <div
            className="react-graph__nodes"
            style={{
              transform: `translate(${state.transform[0]}px,${state.transform[1]}px) scale(${state.transform[2]})`
            }}
          >
            {state.nodes.map(d => this.renderNode(d, onElementClick))}
          </div>
        )}
      </Consumer>
    );
  }
}

export default NodeRenderer;
