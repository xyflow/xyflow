import React, { PureComponent } from 'react';

import Graph, { isEdge, removeElements, getOutgoers, MiniMap } from '../../../src';

import SpecialNode from './SpecialNode';
import InputNode from './InputNode';

const onNodeDragStop = node => console.log('drag stop', node);

class App extends PureComponent {
  constructor() {
    super();

    const onChange = (option, d) => {
      this.setState(prevState => (
        {elements: prevState.elements.map(e => {
          if (isEdge(e) || e.id !== '6') {
            return e;
          }

          return {
            ...e,
            data: {
              ...e.data,
              label: `Option ${option} selected.`
            }
          };
        })}
      ));
    }

    const onChangeInput = (input, d) => {
      this.setState(prevState => (
        {elements: prevState.elements.map(e => {
          if (isEdge(e) || e.id !== '8') {
            return e;
          }

          if (e.id === '8') {
            return {
              ...e,
              data: {
                ...e.data,
                input: input || 'write something'
              }
            };
          }
        })}
      ));
    }

    this.state = {
      graphLoaded: false,
      elements: [
        { id: '1', type: 'input', data: { label: '1 Tests' }, position: { x: 250, y: 5 } },
        { id: '2', data: { label: '2 This is a node This is a node This is a node This is a node' }, position: { x: 100, y: 100 } },
        { id: '3', data: { label: '3 I bring my own style' }, position: { x: 100, y: 200 }, style: { background: '#eee', color: '#222', border: '1px solid #bbb' } },
        { id: '4', type: 'output', data: { label: '4 nody nodes' }, position: { x: 50, y: 300 } },
        { id: '5', type: 'default', data: { label: '5 Another node'}, position: { x: 400, y: 300 } },
        { id: '6', type: 'special', data: { onChange, label: '6 no option selected' }, position: { x: 425, y: 375 } },
        { id: '7', type: 'output', data: { label: '7 output' }, position: { x: 250, y: 500 } },
        { id: '8', type: 'text', data: { onChange: onChangeInput, input: 'write something' }, position: { x: 350, y: 100 } },
        { id: '9', type: 'text', data: { label: 'right' }, position: { x: 600, y: 100 } },
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-8', source: '1', target: '8', animated: true },
        { id: 'e8-9', source: '8', target: '9', animated: true },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4', type: 'step' },
        { id: 'e3-5', source: '3', target: '5' },
        { id: 'e5-6b', source: '5', target: '6__b' },
        { id: 'e5-6a', source: '5', target: '6__a', type: 'step', animated: true, style: { stroke: '#FFCC00' } },
        { id: 'e6-7', source: '6', target: '7', style: { stroke: '#FFCC00' }},
      ]
    };

    this.onElementClick = this.onElementClick.bind(this);
    this.onConnect = this.onConnect.bind(this);
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

  onFitView() {
    this.graphInstance.fitView();
  }

  onAdd() {
    this.setState(prevState => ({
      ...prevState,
      elements: prevState.elements.concat({
        id: (prevState.elements.length + 1).toString(),
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

  onConnect(params) {
    console.log('connect', params);
    this.setState(prevState => ({
      elements: prevState.elements.concat(params)
    }));
  }

  render() {
    return (
      <Graph
        elements={this.state.elements}
        onElementClick={this.onElementClick}
        onElementsRemove={elements => this.onElementsRemove(elements)}
        onConnect={this.onConnect}
        onNodeDragStop={onNodeDragStop}
        style={{ width: '100%', height: '100%' }}
        onLoad={graphInstance => this.onLoad(graphInstance)}
        nodeTypes={{
          special: SpecialNode,
          text: InputNode
        }}
        connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
        connectionLineType="bezier"
      >
        <MiniMap
          style={{ position: 'absolute', right: 10, bottom: 10 }}
          nodeColor={n => {
            if (n.type === 'input') return 'blue';
            if (n.type === 'output') return 'green';
            if (n.type === 'default') return 'red';

            return '#FFCC00';
          }}
        />
        <button
          type="button"
          onClick={() => this.onAdd()}
          style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}
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
