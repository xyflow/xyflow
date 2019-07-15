import React, { PureComponent } from 'react';

import { separateElements } from './graph-utils';
import GraphView from './GraphView';
import { Provider } from './GraphContext';

import './style.css';

class ReactGraph extends PureComponent {
  render() {
    const {
      style, onNodeClick, children, onLoad, onMove, onChange, elements
		} = this.props;

    return (
      <div style={style} className="react-graph">
        <Provider {...separateElements(elements)} onNodeClick={onNodeClick}>
          <GraphView
            onLoad={onLoad}
            onMove={onMove}
            onChange={onChange}
          />
          {children}
        </Provider>
      </div>
    );
  }
}

ReactGraph.defaultProps = {
	onNodeClick: () => {},
	onLoad: () => {},
  onMove: () => {},
  onChange: () => {}
};

export default ReactGraph;
