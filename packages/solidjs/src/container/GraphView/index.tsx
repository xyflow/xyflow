import { FlowRenderer } from '../FlowRenderer';
import { NodeRenderer } from '../NodeRenderer';
import { EdgeRenderer } from '../EdgeRenderer';
import { Viewport } from '../Viewport';
import { useOnInitHandler } from '../../hooks/useOnInitHandler';
import { useViewportSync } from '../../hooks/useViewportSync';
import { ConnectionLineWrapper } from '../../components/ConnectionLine';
import { useNodeOrEdgeTypesWarning } from './useNodeOrEdgeTypesWarning';
import { useStylesLoadedWarning } from './useStylesLoadedWarning';
import type { Edge, Node, ReactFlowProps } from '../../types';

export type GraphViewProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Omit<
  ReactFlowProps<NodeType, EdgeType>,
  'onSelectionChange' | 'nodes' | 'edges' | 'onMove' | 'onMoveStart' | 'onMoveEnd' | 'elevateEdgesOnSelect'
> &
  Required<
    Pick<
      ReactFlowProps<NodeType, EdgeType>,
      | 'selectionKeyCode'
      | 'deleteKeyCode'
      | 'multiSelectionKeyCode'
      | 'connectionLineType'
      | 'onlyRenderVisibleElements'
      | 'translateExtent'
      | 'minZoom'
      | 'maxZoom'
      | 'defaultMarkerColor'
      | 'noDragClassName'
      | 'noWheelClassName'
      | 'noPanClassName'
      | 'defaultViewport'
      | 'disableKeyboardA11y'
      | 'paneClickDistance'
      | 'nodeClickDistance'
    >
  > & {
    rfId: string;
  };

function GraphViewComponent<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  p: GraphViewProps<NodeType, EdgeType>
  //   {
  //   nodeTypes,
  //   edgeTypes,
  //   onInit,
  //   onNodeClick,
  //   onEdgeClick,
  //   onNodeDoubleClick,
  //   onEdgeDoubleClick,
  //   onNodeMouseEnter,
  //   onNodeMouseMove,
  //   onNodeMouseLeave,
  //   onNodeContextMenu,
  //   onSelectionContextMenu,
  //   onSelectionStart,
  //   onSelectionEnd,
  //   connectionLineType,
  //   connectionLineStyle,
  //   connectionLineComponent,
  //   connectionLineContainerStyle,
  //   selectionKeyCode,
  //   selectionOnDrag,
  //   selectionMode,
  //   multiSelectionKeyCode,
  //   panActivationKeyCode,
  //   zoomActivationKeyCode,
  //   deleteKeyCode,
  //   onlyRenderVisibleElements,
  //   elementsSelectable,
  //   defaultViewport,
  //   translateExtent,
  //   minZoom,
  //   maxZoom,
  //   preventScrolling,
  //   defaultMarkerColor,
  //   zoomOnScroll,
  //   zoomOnPinch,
  //   panOnScroll,
  //   panOnScrollSpeed,
  //   panOnScrollMode,
  //   zoomOnDoubleClick,
  //   panOnDrag,
  //   onPaneClick,
  //   onPaneMouseEnter,
  //   onPaneMouseMove,
  //   onPaneMouseLeave,
  //   onPaneScroll,
  //   onPaneContextMenu,
  //   onEdgeUpdate,
  //   onEdgeContextMenu,
  //   onEdgeMouseEnter,
  //   onEdgeMouseMove,
  //   onEdgeMouseLeave,
  //   edgeUpdaterRadius,
  //   onEdgeUpdateStart,
  //   onEdgeUpdateEnd,
  //   noDragClassName,
  //   noWheelClassName,
  //   noPanClassName,
  //   disableKeyboardA11y,
  //   nodeOrigin,
  //   nodeExtent,
  //   rfId,
  //   viewport,
  //   onViewportChange,
  // }: GraphViewProps<NodeType, EdgeType>) {
) {
  useNodeOrEdgeTypesWarning(() => p.nodeTypes);
  useNodeOrEdgeTypesWarning(() => p.edgeTypes);
  useStylesLoadedWarning();

  useOnInitHandler(() => p.onInit);
  useViewportSync(() => p.viewport);

  return (
    <FlowRenderer<NodeType>
      onPaneClick={p.onPaneClick}
      onPaneMouseEnter={p.onPaneMouseEnter}
      onPaneMouseMove={p.onPaneMouseMove}
      onPaneMouseLeave={p.onPaneMouseLeave}
      onPaneContextMenu={p.onPaneContextMenu}
      onPaneScroll={p.onPaneScroll}
      paneClickDistance={p.paneClickDistance}
      deleteKeyCode={p.deleteKeyCode}
      selectionKeyCode={p.selectionKeyCode}
      selectionOnDrag={p.selectionOnDrag}
      selectionMode={p.selectionMode}
      onSelectionStart={p.onSelectionStart}
      onSelectionEnd={p.onSelectionEnd}
      multiSelectionKeyCode={p.multiSelectionKeyCode}
      panActivationKeyCode={p.panActivationKeyCode}
      zoomActivationKeyCode={p.zoomActivationKeyCode}
      elementsSelectable={p.elementsSelectable}
      zoomOnScroll={p.zoomOnScroll}
      zoomOnPinch={p.zoomOnPinch}
      zoomOnDoubleClick={p.zoomOnDoubleClick}
      panOnScroll={p.panOnScroll}
      panOnScrollSpeed={p.panOnScrollSpeed}
      panOnScrollMode={p.panOnScrollMode}
      panOnDrag={p.panOnDrag}
      defaultViewport={p.defaultViewport}
      translateExtent={p.translateExtent}
      minZoom={p.minZoom}
      maxZoom={p.maxZoom}
      onSelectionContextMenu={p.onSelectionContextMenu}
      preventScrolling={p.preventScrolling}
      noDragClassName={p.noDragClassName}
      noWheelClassName={p.noWheelClassName}
      noPanClassName={p.noPanClassName}
      disableKeyboardA11y={p.disableKeyboardA11y}
      onViewportChange={p.onViewportChange}
      isControlledViewport={!!p.viewport}
    >
      <Viewport>
        <EdgeRenderer<NodeType, EdgeType>
          edgeTypes={p.edgeTypes}
          onEdgeClick={p.onEdgeClick}
          onEdgeDoubleClick={p.onEdgeDoubleClick}
          onReconnect={p.onReconnect}
          onlyRenderVisibleElements={p.onlyRenderVisibleElements}
          onEdgeContextMenu={p.onEdgeContextMenu}
          onEdgeMouseEnter={p.onEdgeMouseEnter}
          onEdgeMouseMove={p.onEdgeMouseMove}
          onEdgeMouseLeave={p.onEdgeMouseLeave}
          onReconnectStart={p.onReconnectStart}
          onReconnectEnd={p.onReconnectEnd}
          reconnectRadius={p.reconnectRadius}
          defaultMarkerColor={p.defaultMarkerColor}
          noPanClassName={p.noPanClassName}
          disableKeyboardA11y={p.disableKeyboardA11y}
          rfId={p.rfId}
        />
        <ConnectionLineWrapper
          style={p.connectionLineStyle}
          type={p.connectionLineType}
          component={p.connectionLineComponent}
          containerStyle={p.connectionLineContainerStyle}
        />
        <div class="react-flow__edgelabel-renderer" />
        <NodeRenderer<NodeType>
          nodeTypes={p.nodeTypes}
          onNodeClick={p.onNodeClick}
          onNodeDoubleClick={p.onNodeDoubleClick}
          onNodeMouseEnter={p.onNodeMouseEnter}
          onNodeMouseMove={p.onNodeMouseMove}
          onNodeMouseLeave={p.onNodeMouseLeave}
          onNodeContextMenu={p.onNodeContextMenu}
          nodeClickDistance={p.nodeClickDistance}
          onlyRenderVisibleElements={p.onlyRenderVisibleElements}
          noPanClassName={p.noPanClassName}
          noDragClassName={p.noDragClassName}
          disableKeyboardA11y={p.disableKeyboardA11y}
          nodeExtent={p.nodeExtent}
          rfId={p.rfId}
        />
        <div class="react-flow__viewport-portal" />
      </Viewport>
    </FlowRenderer>
  );
}

GraphViewComponent.displayName = 'GraphView';

export const GraphView = GraphViewComponent;
