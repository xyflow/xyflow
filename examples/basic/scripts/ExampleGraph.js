import React, { PureComponent } from 'react';

import Graph, { removeElements, getOutgoers } from '../../../src';

const onNodeDragStop = node => console.log('drag stop', node);

let edgeId = 0;
const getEdgeId = () => `edge__${edgeId++}`;

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      graphLoaded: false,
      elements: [
        { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
        { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
        { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
        { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3' },
      ]
    };

    this.onElementClick = this.onElementClick.bind(this);
    this.onConnect = this.onConnect.bind(this);
  }

  onLoad(graphInstance) {
    console.log('graph loaded:', graphInstance);

    this.graphInstance = graphInstance;
    this.setState({
      graphLoaded: true
    });
  }

  onElementClick(element) {
    console.log('click', element);
    console.log('outgoers', getOutgoers(element, this.state.elements));
  }

  onElementsRemove(elementsToRemove) {
    this.setState(prevState => ({
      elements: removeElements(prevState.elements, elementsToRemove)
    }));
  }

  onConnect(params) {
    console.log('connect', params);
    this.setState(prevState => ({
      elements: prevState.elements.concat({ id: getEdgeId(), ...params })
    }));
  }

  render() {
    return (
      <Graph
        elements={this.state.elements}
        onLoad={graphInstance => this.onLoad(graphInstance)}
        onElementClick={this.onElementClick}
        onElementsRemove={elements => this.onElementsRemove(elements)}
        onConnect={this.onConnect}
        onNodeDragStop={onNodeDragStop}
        style={{ width: '100%', height: '100%' }}
        showGrid={false}
      />
    );
  }
}

export default App;
