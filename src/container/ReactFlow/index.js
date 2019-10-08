import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
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
  connectionLineStyle, deleteKeyCode, selectionKeyCode,
  showBackground, backgroundGap, backgroundType, backgroundColor
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
          backgroundColor={backgroundColor}
          backgroundGap={backgroundGap}
          showBackground={showBackground}
          backgroundType={backgroundType}
        />
        {children}
      </StoreProvider>
    </div>
  );
};

ReactFlow.displayName = 'ReactFlow';

ReactFlow.propTypes = {
  onElementClick: PropTypes.func,
  onElementsRemove: PropTypes.func,
  onNodeDragStop: PropTypes.func,
  onConnect: PropTypes.func,
	onLoad: PropTypes.func,
  onMove: PropTypes.func,
  nodeTypes: PropTypes.object,
  edgeTypes: PropTypes.object,
  connectionLineType: PropTypes.string,
  connectionLineStyle: PropTypes.object,
  deleteKeyCode: PropTypes.number,
  selectionKeyCode: PropTypes.number,
  gridColor: PropTypes.string,
  gridGap: PropTypes.number,
  showBackground: PropTypes.bool,
  backgroundType: PropTypes.oneOf(['grid'])
};

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
  backgroundColor: '#999',
  backgroundGap: 24,
  showBackground: true,
  backgroundType: 'grid'
};

export default ReactFlow;
