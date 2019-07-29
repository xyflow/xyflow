import React, { PureComponent } from 'react';

import { Consumer } from '../GraphContext';

class EdgeRenderer extends PureComponent {
  renderEdge(e, nodes, onElementClick) {
    const edgeType = e.type || 'default';
    const sourceNode = nodes.find(n => n.id === e.source);
    const targetNode = nodes.find(n => n.id === e.target);

    if (!sourceNode) {
      throw new Error(`couldn't create edge for source id: ${e.source}`);
    }

    if (!targetNode) {
      throw new Error(`couldn't create edge for target id: ${e.target}`);
    }

    const EdgeComponent = this.props.edgeTypes[edgeType] || this.props.edgeTypes.default;

    return (
      <EdgeComponent
        key={`${e.source}-${e.target}`}
        sourceNode={sourceNode}
        targetNode={targetNode}
        onClick={onElementClick}
        {...e}
      />
    );
  }

  render() {
    const { width, height } = this.props;

    if (!width) {
      return null;
    }

    return (
      <Consumer>
        {({ state, onElementClick }) => (
          <svg
            width={width}
            height={height}
            className="react-graph__edges"
          >
            <g
              transform={`translate(${state.transform[0]},${state.transform[1]}) scale(${state.transform[2]})`}
            >
              {state.edges.map(e => this.renderEdge(e, state.nodes, onElementClick))}
            </g>
          </svg>
        )}
      </Consumer>
    );
  }
}

export default EdgeRenderer;
