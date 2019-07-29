import React, { PureComponent } from 'react';

import Graph, { isEdge, removeElements, getOutgoers, SourceHandle, TargetHandle } from '../src';
// import Graph from '../dist/ReactGraph';

const SpecialNode = ({ data, onChange, styles }) => (
  <div
    style={{ background: '#FFCC00', padding: 10, borderRadius: 2, ...styles }}
  >
    <TargetHandle style={{ left: 10, background: '#999' }} />
    <div>I am <strong>special</strong>!<br />{data.label}</div>
    <select onChange={(e) => onChange(e.target.value, data)}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <SourceHandle style={{ left: 10, background: '#999' }} />
  </div>
);

class App extends PureComponent {
  constructor() {
    super();

    const onChange = (id, d) => {
      this.setState(prevState => (
        {elements: prevState.elements.map(e => {
          if (isEdge(e)) {
            return e;
          }

          return {
            ...e,
            data: {
              ...e.data,
              label: '6' === e.id ? `option ${id} selected` : e.data.label
            }
          };
        })}
      ));
    }

    this.state = {
      graphLoaded: false,
      elements: [
        { id: '1', type: 'input', data: { label: 'Tests' }, position: { x: 250, y: 5 } },
        { id: '2', data: { label: 'This is a node This is a node This is a node This is a node' }, position: { x: 100, y: 100 } },
        { id: '3', data: { label: 'I bring my own style' }, position: { x: 100, y: 200 }, style: { background: '#eee', color: '#222', border: '1px solid #bbb' } },
        { id: '4', type: 'output', data: { label: 'nody nodes' }, position: { x: 50, y: 300 } },
        { id: '5', type: 'default', data: { label: 'Another node'}, position: { x: 400, y: 300 } },
        { id: '6', type: 'special', onChange, data: { label: 'no option selected' }, position: { x: 425, y: 375 } },
        { id: '7', type: 'output', data: { label: 'output' }, position: { x: 250, y: 500 } },
        { source: '1', target: '2', animated: true },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '3', target: '5' },
        { source: '5', target: '6', type: 'straight', animated: true, style: { stroke: '#FFCC00' } },
        { source: '6', target: '7', style: { stroke: '#FFCC00' }},
      ]
    };
  }

  onLoad(graphInstance) {
    console.log('graph loaded:', graphInstance);
    window.rg = graphInstance;

    this.graphInstance = graphInstance;
    this.graphInstance.fitView({ padding: 0.1 });
    this.setState({
      graphLoaded: true
    });
  }

  onChange(elements) {
    if (!this.graphInstance) {
      return false;
    }
    // console.log('graph changed', elements);
  }

  onFitView() {
    this.graphInstance.fitView();
  }

  onAdd() {
    this.setState(prevState => ({
      ...prevState,
      elements: prevState.elements.concat({
        id: prevState.elements.length + 1,
        data: { label: 'Added node' },
        position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      })
    }));
  }

  onElementClick(element) {
    console.log('click', element);
    console.log('outgoers', getOutgoers(element, this.state.elements));
  }

  onZoomIn() {
    this.graphInstance.zoomIn();
  }

  onZoomOut() {
    this.graphInstance.zoomOut();
  }

  onElementsRemove(elementsToRemove) {
    this.setState(prevState => ({
      elements: removeElements(prevState.elements, elementsToRemove)
    }));
  }

  render() {
    return (
      <Graph
        elements={this.state.elements}
        onElementClick={element => this.onElementClick(element)}
        onElementsRemove={elements => this.onElementsRemove(elements)}
        onConnect={params => console.log(params)}
        style={{ width: '100%', height: '100%' }}
        onLoad={graphInstance => this.onLoad(graphInstance)}
        onChange={(elements) => this.onChange(elements)}
        nodeTypes={{
          special: SpecialNode
        }}
      >
        <button
          type="button"
          onClick={() => this.onAdd()}
          style={{ position: 'absolute', right: '10px', bottom: '10px', zIndex: 4 }}
        >
          add
        </button>
        {this.state.graphLoaded && (
          <div className="controls">
            <button
              type="button"
              onClick={() => this.onFitView()}
            >
              fit
            </button>
            <button
              type="button"
              onClick={() => this.onZoomIn()}
            >
              zoom in
            </button>
            <button
              type="button"
              onClick={() => this.onZoomOut()}
            >
              zoom out
            </button>
          </div>
        )}
      </Graph>
    );
  }
}

export default App;
