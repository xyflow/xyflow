import React, { PureComponent } from 'react';

import Edge from './Edge';
import { Consumer } from '../GraphContext';

function renderEdge(e, nodes) {
  const sourceNode = nodes.find(n => n.data.id === e.data.source);
  const targetNode = nodes.find(n => n.data.id === e.data.target);

  if (!sourceNode) {
    throw new Error(`couldn't create edge for source id: ${e.data.source}`);
  }

  if (!targetNode) {
    throw new Error(`couldn't create edge for source id: ${e.data.target}`);
  }

  return (
    <Edge
      key={`${e.data.source}-${e.data.target}`}
      sourceNode={sourceNode}
      targetNode={targetNode}
    />
  );
}

class EdgeRenderer extends PureComponent {
  render() {
    const { width, height } = this.props;

    if (!width) {
      return null;
    }

    return (
      <Consumer>
        {({ transform, edges, nodes }) => (
          <svg
            width={width}
            height={height}
            style={{ pointerEvents: 'none' }}
          >
            <g
              transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
            >
              {edges.map(e => renderEdge(e, nodes))}
            </g>
          </svg>
        )}
      </Consumer>
    );
  }
}

export default EdgeRenderer;
