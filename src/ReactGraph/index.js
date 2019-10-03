import React, { useMemo } from 'react';
import { StoreProvider } from 'easy-peasy';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

import GraphView from '../GraphView';
import GlobalKeyHandler from '../GlobalKeyHandler';

import DefaultNode from '../NodeRenderer/NodeTypes/DefaultNode';
import InputNode from '../NodeRenderer/NodeTypes/InputNode';
import OutputNode from '../NodeRenderer/NodeTypes/OutputNode';
import { createNodeTypes } from '../NodeRenderer/utils';

import BezierEdge from '../EdgeRenderer/EdgeTypes/BezierEdge';
import StraightEdge from '../EdgeRenderer/EdgeTypes/StraightEdge';
import StepEdge from '../EdgeRenderer/EdgeTypes/StepEdge';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import store from '../store';
import ElementUpdater from './ElementUpdater';

import '../style.css';

const ReactGraph = ({
  style, onElementClick, elements, children,
  nodeTypes, edgeTypes, onLoad, onMove, onElementsRemove,
  onConnect, onNodeDragStop, connectionLineType, connectionLineStyle,
  deleteKey
}) => {
  const nodeTypesParsed = useMemo(() => createNodeTypes(nodeTypes), []);
  const edgeTypesParsed = useMemo(() => createEdgeTypes(edgeTypes), []);

  return (
    <div style={style} className="react-graph">
      <StoreProvider store={store}>
        <ElementUpdater elements={elements} onConnect={onConnect} />
        <GraphView
          onLoad={onLoad}
          onMove={onMove}
          onElementClick={onElementClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypesParsed}
          edgeTypes={edgeTypesParsed}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
        />
        <GlobalKeyHandler
          onElementsRemove={onElementsRemove}
          deleteKey={deleteKey}
        />
        {children}
      </StoreProvider>
    </div>
  );
};

ReactGraph.displayName = 'ReactGraph';

ReactGraph.defaultProps = {
  onElementClick: () => {},
  onElementsRemove: () => {},
  onNodeDragStop: () => {},
  onConnect: () => {},
	onLoad: () => {},
  onMove: () => {},
  nodeTypes: {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode
  },
  edgeTypes: {
    default: BezierEdge,
    straight: StraightEdge,
    step: StepEdge
  },
  connectionLineType: 'bezier',
  connectionLineStyle: {},
  deleteKey: 'Backspace'
};

export default ReactGraph;
