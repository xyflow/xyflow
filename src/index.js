import React, { PureComponent } from 'react';
import isEqual from 'lodash.isequal';
import styled from '@emotion/styled';

import { separateElements } from './graph-utils';
import GraphView from './GraphView';
import { Provider } from './GraphContext';

const GraphWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

class ReactGraph extends PureComponent {
  constructor(props) {
    super();

    const { elements } = props;

    this.state = {
      ...separateElements(elements)
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { elements } = this.props;
    const { nodes, edges } = separateElements(elements);
    const nodesChanged = !isEqual(nodes, prevState.nodes);
    const edgesChanged = !isEqual(edges, prevState.edges);

    if (!nodesChanged && !edgesChanged) {
      return false;
    }

    if (nodesChanged) {
      this.setState({ nodes });
    }

    if (edgesChanged) {
      this.setState({ edges });
    }
  }

  render() {
    const {
      style, onNodeClick, children, onLoad, onMove
    } = this.props;
    const { nodes, edges } = this.state;

    return (
      <GraphWrapper style={style}>
        <Provider nodes={nodes} edges={edges} onNodeClick={onNodeClick}>
          <GraphView onLoad={onLoad} onMove={onMove} />
          {children}
        </Provider>
      </GraphWrapper>
    );
  }
}

ReactGraph.defaultProps = {
	onNodeClick: () => {},
	onLoad: () => {},
	onMove: () => {}
};

export default ReactGraph;
