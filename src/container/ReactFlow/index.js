import React, { useMemo } from 'react';
import { StoreProvider } from 'easy-peasy';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

import GraphView from '../GraphView';

import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import { createNodeTypes } from '../NodeRenderer/utils';

import BezierEdge from '../../components/Edges/BezierEdge';
import StraightEdge from '../../components/Edges/StraightEdge';
import StepEdge from '../../components/Edges/StepEdge';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import store from '../../store';

import '../../style.css';

const ReactFlow = ({
  style, onElementClick, elements, children,
  nodeTypes, edgeTypes, onLoad, onMove,
  onElementsRemove, onConnect, onNodeDragStop, connectionLineType,
  connectionLineStyle, deleteKeyCode, selectionKeyCode, gridColor,
  showGrid, gridGap
}) => {
  const nodeTypesParsed = useMemo(() => createNodeTypes(nodeTypes), []);
  const edgeTypesParsed = useMemo(() => createEdgeTypes(edgeTypes), []);

  return (
    <div style={style} className="react-flow">
      <StoreProvider store={store}>
        <GraphView
          onLoad={onLoad}
          onMove={onMove}
          onElementClick={onElementClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypesParsed}
          edgeTypes={edgeTypesParsed}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          selectionKeyCode={selectionKeyCode}
          onElementsRemove={onElementsRemove}
          deleteKeyCode={deleteKeyCode}
          elements={elements}
          onConnect={onConnect}
          gridColor={gridColor}
          gridGap={gridGap}
          showGrid={showGrid}
        />
        {children}
      </StoreProvider>
    </div>
  );
};

ReactFlow.displayName = 'ReactFlow';

ReactFlow.defaultProps = {
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
  deleteKeyCode: 8,
  selectionKeyCode: 16,
  gridColor: '#999',
  gridGap: 24,
  showGrid: true
};

export default ReactFlow;
