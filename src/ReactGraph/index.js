import React, { PureComponent } from 'react';
import isEqual from 'lodash.isequal';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

import { parseElements, isNode, isEdge } from '../graph-utils';
import GraphView from '../GraphView';
import GlobalKeyHandler from '../GlobalKeyHandler';
import { Provider } from '../GraphContext';

import DefaultNode from '../NodeRenderer/NodeTypes/DefaultNode';
import InputNode from '../NodeRenderer/NodeTypes/InputNode';
import OutputNode from '../NodeRenderer/NodeTypes/OutputNode';
import { createNodeTypes } from '../NodeRenderer/utils';

import BezierEdge from '../EdgeRenderer/EdgeTypes/BezierEdge';
import StraightEdge from '../EdgeRenderer/EdgeTypes/StraightEdge';
import { createEdgeTypes } from '../EdgeRenderer/utils';

import '../style.css';

class ReactGraph extends PureComponent {
  constructor(props) {
    super(props);

    this.nodeTypes = createNodeTypes(props.nodeTypes);
    this.edgeTypes = createEdgeTypes(props.edgeTypes);

    this.state = {
      nodes: [],
      edges: []
    };
  }

  componentDidMount() {
    this.updateElements(this.props.elements);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.elements, this.props.elements)) {
      this.updateElements(this.props.elements);
    }
  }

  updateElements(elements) {
    const parsedElements = elements.map(parseElements);

    this.setState({
      nodes: parsedElements.filter(isNode),
      edges: parsedElements.filter(isEdge),
    });
  }

  render() {
    const {
      style, onElementClick, children, onLoad,
      onMove, onChange, onElementsRemove, onConnect, onNodeDragStop,
      connectionLineType, connectionLineStyle
    } = this.props;

    return (
      <div style={style} className="react-graph">
        <Provider nodes={this.state.nodes} edges={this.state.edges} onConnect={onConnect}>
          <GraphView
            onLoad={onLoad}
            onMove={onMove}
            onChange={onChange}
            onElementClick={onElementClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={this.nodeTypes}
            edgeTypes={this.edgeTypes}
            connectionLineType={connectionLineType}
            connectionLineStyle={connectionLineStyle}
          />
          <GlobalKeyHandler
            onElementsRemove={onElementsRemove}
          />
          {children}
        </Provider>
      </div>
    );
  }
}

ReactGraph.defaultProps = {
  onElementClick: () => {},
  onElementsRemove: () => {},
  onNodeDragStop: () => {},
  onConnect: () => {},
	onLoad: () => {},
  onMove: () => {},
  onChange: () => {},
  nodeTypes: {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode
  },
  edgeTypes: {
    default: BezierEdge,
    straight: StraightEdge
  },
  connectionLineType: 'bezier',
  connectionLineStyle: {}
};

export default ReactGraph;
