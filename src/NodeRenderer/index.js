import React, { PureComponent } from 'react';
import styled from '@emotion/styled';

import { Consumer } from '../GraphContext';
import DefaultNode from './NodeTypes/DefaultNode';
import InputNode from './NodeTypes/InputNode';
import OutputNode from './NodeTypes/OutputNode';

const Nodes = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  pointer-events: none;
  transform-origin: 0 0;
`;

class NodeRenderer extends PureComponent {

  renderNode(d, onNodeClick) {
    const nodeType = d.data.type || 'default';
    const NodeComponent = this.props.nodeTypes[nodeType];

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
          <Nodes
            style={{
              transform: `translate(${transform.x}px,${transform.y}px) scale(${transform.k})`
            }}
          >
            {nodes.map(d => this.renderNode(d, onNodeClick))}
          </Nodes>
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
