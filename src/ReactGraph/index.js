import React, { useMemo, memo } from 'react';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

import GraphView from '../GraphView';
import GlobalKeyHandler from '../GlobalKeyHandler';
import { Provider } from '../GraphContext';

import DefaultNode from '../NodeRenderer/NodeTypes/DefaultNode';
import InputNode from '../NodeRenderer/NodeTypes/InputNode';
import OutputNode from '../NodeRenderer/NodeTypes/OutputNode';
import { createNodeTypes } from '../NodeRenderer/utils';

import BezierEdge from '../EdgeRenderer/EdgeTypes/BezierEdge';
import StraightEdge from '../EdgeRenderer/EdgeTypes/StraightEdge';
import StepEdge from '../EdgeRenderer/EdgeTypes/StepEdge';
import { createEdgeTypes } from '../EdgeRenderer/utils';

import '../style.css';

const ReactGraph = (props) => {
  const nodeTypes = useMemo(() => createNodeTypes(props.nodeTypes), []);
  const edgeTypes = useMemo(() => createEdgeTypes(props.edgeTypes), []);

  const {
    style, onElementClick, elements, children,
    onLoad, onMove, onElementsRemove, onConnect,
    onNodeDragStop, connectionLineType, connectionLineStyle
  } = props;

  return (
    <div style={style} className="react-graph">
      <Provider elements={elements}>
        <GraphView
          onLoad={onLoad}
          onMove={onMove}
          onElementClick={onElementClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          onConnect={onConnect}
        />
        <GlobalKeyHandler
          onElementsRemove={onElementsRemove}
        />
        {children}
      </Provider>
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
  connectionLineStyle: {}
};

export default ReactGraph;
