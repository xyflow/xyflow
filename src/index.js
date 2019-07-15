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
  render() {
    const {
      style, onNodeClick, children, onLoad, onMove, elements
		} = this.props;

    return (
      <GraphWrapper style={style}>
        <Provider {...separateElements(elements)} onNodeClick={onNodeClick}>
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
