import cc from 'classcat';
import React, { forwardRef } from 'react';
import Attribution from '../../components/Attribution';
import { BezierEdge, SmoothStepEdge, StepEdge, StraightEdge, SimpleBezierEdge } from '../../components/Edges';
import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import SelectionListener from '../../components/SelectionListener';
import StoreUpdater from '../../components/StoreUpdater';
import css from '../../style.css';
import theme from '../../theme-default.css';
import {
  ConnectionLineType,
  ConnectionMode,
  EdgeTypes,
  NodeTypes,
  PanOnScrollMode,
  ReactFlowProps,
  ReactFlowRefType,
} from '../../types';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import GraphView from '../GraphView';
import { createNodeTypes } from '../NodeRenderer/utils';
import injectStyle, { useNodeOrEdgeTypes } from './utils';
import Wrapper from './Wrapper';

if (__INJECT_STYLES__) {
  injectStyle(css as unknown as string);
  injectStyle(theme as unknown as string);
}

const defaultNodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
};

const defaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  simplebezier: SimpleBezierEdge,
};

const initSnapGrid: [number, number] = [15, 15];
const initDefaultPosition: [number, number] = [0, 0];

const ReactFlow = forwardRef<ReactFlowRefType, ReactFlowProps>(
  (
    {
      nodes,
      edges,
      defaultNodes,
      defaultEdges,
      className,
      nodeTypes = defaultNodeTypes,
      edgeTypes = defaultEdgeTypes,
      onNodeClick,
      onEdgeClick,
      onInit,
      onMove,
      onMoveStart,
      onMoveEnd,
      onConnect,
      onConnectStart,
      onConnectStop,
      onConnectEnd,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeDoubleClick,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
      onNodesDelete,
      onEdgesDelete,
      onSelectionChange,
      onSelectionDragStart,
      onSelectionDrag,
      onSelectionDragStop,
      onSelectionContextMenu,
      connectionMode = ConnectionMode.Strict,
      connectionLineType = ConnectionLineType.Bezier,
      connectionLineStyle,
      connectionLineComponent,
      deleteKeyCode = 'Backspace',
      selectionKeyCode = 'Shift',
      multiSelectionKeyCode = 'Meta',
      zoomActivationKeyCode = 'Meta',
      snapToGrid = false,
      snapGrid = initSnapGrid,
      onlyRenderVisibleElements = false,
      selectNodesOnDrag = true,
      nodesDraggable,
      nodesConnectable,
      elementsSelectable,
      minZoom,
      maxZoom,
      defaultZoom = 1,
      defaultPosition = initDefaultPosition,
      translateExtent,
      preventScrolling = true,
      nodeExtent,
      defaultMarkerColor = '#b1b1b7',
      zoomOnScroll = true,
      zoomOnPinch = true,
      panOnScroll = false,
      panOnScrollSpeed = 0.5,
      panOnScrollMode = PanOnScrollMode.Free,
      zoomOnDoubleClick = true,
      panOnDrag = true,
      onPaneClick,
      onPaneScroll,
      onPaneContextMenu,
      children,
      onEdgeUpdate,
      onEdgeContextMenu,
      onEdgeDoubleClick,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
      onEdgeUpdateStart,
      onEdgeUpdateEnd,
      edgeUpdaterRadius = 10,
      onNodesChange,
      onEdgesChange,
      noDragClassName = 'nodrag',
      noWheelClassName = 'nowheel',
      noPanClassName = 'nopan',
      fitView = false,
      fitViewOptions,
      connectOnClick = true,
      attributionPosition,
      proOptions,
      defaultEdgeOptions,
      ...rest
    },
    ref
  ) => {
    const nodeTypesParsed = useNodeOrEdgeTypes(nodeTypes, createNodeTypes) as NodeTypes;
    const edgeTypesParsed = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes) as EdgeTypes;
    const reactFlowClasses = cc(['react-flow', className]);

    return (
      <div {...rest} ref={ref} className={reactFlowClasses}>
        <Wrapper>
          <GraphView
            onInit={onInit}
            onMove={onMove}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypesParsed}
            edgeTypes={edgeTypesParsed}
            connectionLineType={connectionLineType}
            connectionLineStyle={connectionLineStyle}
            connectionLineComponent={connectionLineComponent}
            selectionKeyCode={selectionKeyCode}
            deleteKeyCode={deleteKeyCode}
            multiSelectionKeyCode={multiSelectionKeyCode}
            zoomActivationKeyCode={zoomActivationKeyCode}
            onlyRenderVisibleElements={onlyRenderVisibleElements}
            selectNodesOnDrag={selectNodesOnDrag}
            defaultZoom={defaultZoom}
            defaultPosition={defaultPosition}
            preventScrolling={preventScrolling}
            zoomOnScroll={zoomOnScroll}
            zoomOnPinch={zoomOnPinch}
            zoomOnDoubleClick={zoomOnDoubleClick}
            panOnScroll={panOnScroll}
            panOnScrollSpeed={panOnScrollSpeed}
            panOnScrollMode={panOnScrollMode}
            panOnDrag={panOnDrag}
            onPaneClick={onPaneClick}
            onPaneScroll={onPaneScroll}
            onPaneContextMenu={onPaneContextMenu}
            onSelectionDragStart={onSelectionDragStart}
            onSelectionDrag={onSelectionDrag}
            onSelectionDragStop={onSelectionDragStop}
            onSelectionContextMenu={onSelectionContextMenu}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            edgeUpdaterRadius={edgeUpdaterRadius}
            defaultMarkerColor={defaultMarkerColor}
            noDragClassName={noDragClassName}
            noWheelClassName={noWheelClassName}
            noPanClassName={noPanClassName}
          />
          <StoreUpdater
            nodes={nodes}
            edges={edges}
            defaultNodes={defaultNodes}
            defaultEdges={defaultEdges}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            elementsSelectable={elementsSelectable}
            minZoom={minZoom}
            maxZoom={maxZoom}
            nodeExtent={nodeExtent}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            snapToGrid={snapToGrid}
            snapGrid={snapGrid}
            connectionMode={connectionMode}
            translateExtent={translateExtent}
            connectOnClick={connectOnClick}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView={fitView}
            fitViewOptions={fitViewOptions}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
          />
          {onSelectionChange && <SelectionListener onSelectionChange={onSelectionChange} />}
          {children}
          <Attribution proOptions={proOptions} position={attributionPosition} />
        </Wrapper>
      </div>
    );
  }
);

ReactFlow.displayName = 'ReactFlow';

export default ReactFlow;
