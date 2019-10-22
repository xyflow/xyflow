import React, { PureComponent } from 'react';

import Graph, { removeElements, addEdge, getOutgoers, MiniMap } from 'react-flow';

const onNodeDragStop = node => console.log('drag stop', node);

class App extends PureComponent {
  constructor() {
    super();

    this.state = {
      graphLoaded: false,
      elements: []
    };
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
      elements: removeElements(elementsToRemove, prevState.elements)
    }));
  }

  onConnect(params) {
    console.log('connect', params);
    this.setState(prevState => ({
      elements: addEdge(params, prevState.elements)
    }));
  }

  onAdd() {
    this.setState((prevState) => {
      const nodeId =  (prevState.elements.length + 1).toString();

      return {
        ...prevState,
        elements: prevState.elements.concat({
          id: nodeId,
          data: { label: `Node: ${nodeId}` },
          position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
        })
      };
    });
  }

  render() {
    return (
      <Graph
        elements={this.state.elements}
        onLoad={graphInstance => this.onLoad(graphInstance)}
        onElementClick={element => this.onElementClick(element)}
        onElementsRemove={elements => this.onElementsRemove(elements)}
        onConnect={params => this.onConnect(params)}
        onNodeDragStop={onNodeDragStop}
        style={{ width: '100%', height: '100%' }}
        backgroundType="lines"
      >
      <MiniMap />
      <button
        type="button"
        onClick={() => this.onAdd()}
        style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
      >
        add
      </button>
      </Graph>
    );
  }
}

export default App;
