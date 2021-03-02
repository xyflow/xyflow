import React, { useMemo, CSSProperties, HTMLAttributes, MouseEvent as ReactMouseEvent, WheelEvent, ChangeEvent, forwardRef } from 'react';
import cc from 'classcat';

import GraphView from '../GraphView';
import ElementUpdater from '../../components/ElementUpdater';
import DefaultNode from '../../components/Nodes/DefaultNode';
import InputNode from '../../components/Nodes/InputNode';
import OutputNode from '../../components/Nodes/OutputNode';
import { createNodeTypes } from '../NodeRenderer/utils';
import SelectionListener from '../../components/SelectionListener';
import { BezierEdge, StepEdge, SmoothStepEdge, StraightEdge } from '../../components/Edges';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import Wrapper from './Wrapper';
import {
  Elements,
  NodeTypesType,
  EdgeTypesType,
  OnLoadFunc,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  ConnectionLineType,
  ConnectionLineComponent,
  FlowTransform,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  TranslateExtent,
  KeyCode,
  PanOnScrollMode,
  OnEdgeUpdateFunc,
  NodeExtent,
} from '../../types';

import '../../style.css';
import '../../theme-default.css';

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
};

export interface ReactFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  elements: Elements;
  onAddField?:(event: MouseEvent, element: Node | Edge) => void;
  onRemoveField?:(event: MouseEvent, element: Node | Edge) => void;
  onFieldChange?:(event: ChangeEvent, element: Node | Edge) => void;
  onTitleChange?:(event: ChangeEvent, element: Node | Edge) => void;
  onElementClick?: (event: MouseEvent, element: Node | Edge) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeDoubleClick?: (event: ReactMouseEvent, node: Node) => void;
  onNodeMouseEnter?: (event: ReactMouseEvent, node: Node) => void;
  onNodeMouseMove?: (event: ReactMouseEvent, node: Node) => void;
  onNodeMouseLeave?: (event: ReactMouseEvent, node: Node) => void;
  onNodeContextMenu?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDragStart?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDrag?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDragStop?: (event: ReactMouseEvent, node: Node) => void;
  onConnect?: (connection: Edge | Connection) => void;
  onConnectStart?: OnConnectStartFunc;
  onConnectStop?: OnConnectStopFunc;
  onConnectEnd?: OnConnectEndFunc;
  onLoad?: OnLoadFunc;
  onMove?: (flowTransform?: FlowTransform) => void;
  isValidConnection?: (connection: Connection) => boolean;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  onSelectionChange?: (elements: Elements | null) => void;
  onSelectionDragStart?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: ReactMouseEvent) => void;
  onPaneContextMenu?: (event: ReactMouseEvent) => void;
  nodeTypes?: NodeTypesType;
  edgeTypes?: EdgeTypesType;
  connectionMode?: ConnectionMode;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  deleteKeyCode?: KeyCode | Array<KeyCode>;
  selectionKeyCode?: KeyCode;
  multiSelectionKeyCode?: KeyCode;
  zoomActivationKeyCode?: KeyCode;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  onlyRenderVisibleElements?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  paneMoveable?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  defaultPosition?: [number, number];
  translateExtent?: TranslateExtent;
  preventScrolling?: boolean;
  nodeExtent?: NodeExtent;
  arrowHeadColor?: string;
  markerEndId?: string;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnDoubleClick?: boolean;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseEnter?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseMove?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseLeave?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeDoubleClick?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge) => void;
  edgeUpdaterRadius?: number;
  nodeTypesId?: string;
  edgeTypesId?: string;
}

const ReactFlow = ({
  elements = [],
  className,
  nodeTypes = defaultNodeTypes,
  edgeTypes = defaultEdgeTypes,
  onAddField,
  onRemoveField,
  onTitleChange,
  onElementClick,
  onLoad,
  onMove,
  onMoveStart,
  onMoveEnd,
  onElementsRemove,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  onFieldChange,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeContextMenu,
  onNodeDragStart,
  onNodeDrag,
  onNodeDragStop,
  onSelectionChange,
  onSelectionDragStart,
  onSelectionDrag,
  onSelectionDragStop,
  onSelectionContextMenu,
  connectionMode = ConnectionMode.Strict,
  connectionLineType = ConnectionLineType.Bezier,
  connectionLineStyle,
  connectionLineComponent,
  deleteKeyCode = ['Backspace', 'Delete'],
  selectionKeyCode = 'Shift',
  multiSelectionKeyCode = 'Meta',
  zoomActivationKeyCode = 'Meta',
  snapToGrid = false,
  snapGrid = [15, 15],
  onlyRenderVisibleElements = true,
  selectNodesOnDrag = true,
  nodesDraggable,
  nodesConnectable,
  elementsSelectable,
  minZoom,
  maxZoom,
  defaultZoom = 1,
  defaultPosition = [0, 0],
  translateExtent,
  nodeExtent,
  arrowHeadColor = '#b1b1b7',
  markerEndId,
  zoomOnScroll = true,
  zoomOnPinch = true,
  panOnScroll = false,
  panOnScrollSpeed = 0.5,
  panOnScrollMode = PanOnScrollMode.Free,
  isValidConnection,
  zoomOnDoubleClick = true,
  paneMoveable = true,
  onPaneClick,
  onPaneScroll,
  onPaneContextMenu,
  children,
  onEdgeUpdate,
  ...rest
}: ReactFlowProps) => {
  const nodeTypesParsed = useMemo(() => createNodeTypes(nodeTypes), []);
  const edgeTypesParsed = useMemo(() => createEdgeTypes(edgeTypes), []);
  const reactFlowClasses = cc(['react-flow', className]);
 
  return (
    <div {...rest} className={reactFlowClasses}>
      <Wrapper>
        <GraphView
          onAddField={onAddField}
          onRemoveField={onRemoveField}
          onFieldChange={onFieldChange}
          onTitleChange={onTitleChange}
          onLoad={onLoad}
          onMove={onMove}
          onMoveStart={onMoveStart}
          onMoveEnd={onMoveEnd}
          onElementClick={onElementClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          isValidConnection={isValidConnection}
          nodeTypes={nodeTypesParsed}
          edgeTypes={edgeTypesParsed}
          connectionMode={connectionMode}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          connectionLineComponent={connectionLineComponent}
          selectionKeyCode={selectionKeyCode}
          onElementsRemove={onElementsRemove}
          deleteKeyCode={deleteKeyCode}
          multiSelectionKeyCode={multiSelectionKeyCode}
          zoomActivationKeyCode={zoomActivationKeyCode}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectStop={onConnectStop}
          onConnectEnd={onConnectEnd}
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          nodesDraggable={nodesDraggable}
          nodesConnectable={nodesConnectable}
          elementsSelectable={elementsSelectable}
          selectNodesOnDrag={selectNodesOnDrag}
          minZoom={minZoom}
          maxZoom={maxZoom}
          defaultZoom={defaultZoom}
          defaultPosition={defaultPosition}
          translateExtent={translateExtent}
          nodeExtent={nodeExtent}
          arrowHeadColor={arrowHeadColor}
          markerEndId={markerEndId}
          zoomOnScroll={zoomOnScroll}
          zoomOnPinch={zoomOnPinch}
          zoomOnDoubleClick={zoomOnDoubleClick}
          panOnScroll={panOnScroll}
          panOnScrollSpeed={panOnScrollSpeed}
          panOnScrollMode={panOnScrollMode}
          paneMoveable={paneMoveable}
          onPaneClick={onPaneClick}
          onPaneScroll={onPaneScroll}
          onPaneContextMenu={onPaneContextMenu}
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStop={onSelectionDragStop}
          onSelectionContextMenu={onSelectionContextMenu}
          onEdgeUpdate={onEdgeUpdate}
        />
        <ElementUpdater elements={elements} />
        {onSelectionChange && <SelectionListener onSelectionChange={onSelectionChange} />}
        {children}
      </Wrapper>
    </div>
  );
};

ReactFlow.displayName = 'ReactFlow';

export default ReactFlow;
