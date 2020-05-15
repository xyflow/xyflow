import React, { useMemo, CSSProperties, HTMLAttributes } from 'react';
import { StoreProvider } from 'easy-peasy';

const nodeEnv: string = process.env.NODE_ENV as string;

if (nodeEnv !== 'production') {
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
import { Elements, NodeTypesType, EdgeTypesType, GridType, OnLoadFunc, Node, Edge, Connection } from '../../types';

import '../../style.css';

export interface ReactFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  elements: Elements;
  onElementClick: (element: Node | Edge) => void;
  onElementsRemove: (elements: Elements) => void;
  onNodeDragStop: (node: Node) => void;
  onConnect: (connection: Edge | Connection) => void;
  onLoad: OnLoadFunc;
  onMove: () => void;
  nodeTypes: NodeTypesType;
  edgeTypes: EdgeTypesType;
  connectionLineType: string;
  connectionLineStyle: CSSProperties;
  deleteKeyCode: number;
  selectionKeyCode: number;
  showBackground: boolean;
  backgroundGap: number;
  backgroundColor: string;
  backgroundType: GridType;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleNodes: boolean;
  isInteractive: boolean;
}

const ReactFlow = ({
  style,
  onElementClick,
  elements = [],
  children,
  nodeTypes,
  edgeTypes,
  onLoad,
  onMove,
  onElementsRemove,
  onConnect,
  onNodeDragStop,
  connectionLineType,
  connectionLineStyle,
  deleteKeyCode,
  selectionKeyCode,
  showBackground,
  backgroundGap,
  backgroundType,
  backgroundColor,
  snapToGrid,
  snapGrid,
  onlyRenderVisibleNodes,
  isInteractive,
}: ReactFlowProps) => {
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
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          onlyRenderVisibleNodes={onlyRenderVisibleNodes}
          isInteractive={isInteractive}
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
    output: OutputNode,
  },
  edgeTypes: {
    default: BezierEdge,
    straight: StraightEdge,
    step: StepEdge,
  },
  connectionLineType: 'bezier',
  connectionLineStyle: {},
  deleteKeyCode: 8,
  selectionKeyCode: 16,
  backgroundColor: '#eee',
  backgroundGap: 24,
  showBackground: true,
  backgroundType: GridType.Dots,
  snapToGrid: false,
  snapGrid: [16, 16],
  onlyRenderVisibleNodes: true,
  isInteractive: true,
};

export default ReactFlow;
