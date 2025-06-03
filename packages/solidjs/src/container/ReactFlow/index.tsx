// import { ForwardedRef, type CSSProperties } from 'react';
import cc from 'classcat';
import { ConnectionLineType, PanOnScrollMode, SelectionMode, infiniteExtent, isMacOs } from '@xyflow/system';

import { A11yDescriptions } from '../../components/A11yDescriptions';
import { Attribution } from '../../components/Attribution';
import { SelectionListener } from '../../components/SelectionListener';
import { StoreUpdater } from '../../components/StoreUpdater';
import { useColorModeClass } from '../../hooks/useColorModeClass';
import { GraphView } from '../GraphView';
import { Wrapper } from './Wrapper';
import type { Edge, Node, ReactFlowProps } from '../../types';
import { defaultViewport as initViewport, defaultNodeOrigin } from './init-values';
// import { fixedForwardRef } from '../../utils/general';
import { mergeProps, splitProps, JSX } from 'solid-js';

const wrapperStyle: JSX.CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  'z-index': 0,
};

type UsedProps<N extends Node, E extends Edge> = ReactFlowProps<N, E> & {
  ref?: (node: HTMLDivElement) => void;
  className?: string; // Add explicit className support for API compatibility
};

function ReactFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(_p: UsedProps<NodeType, EdgeType>) {
  //   {
  //     nodes,
  //     edges,
  //     defaultNodes,
  //     defaultEdges,
  //     className,
  //     nodeTypes,
  //     edgeTypes,
  //     onNodeClick,
  //     onEdgeClick,
  //     onInit,
  //     onMove,
  //     onMoveStart,
  //     onMoveEnd,
  //     onConnect,
  //     onConnectStart,
  //     onConnectEnd,
  //     onClickConnectStart,
  //     onClickConnectEnd,
  //     onNodeMouseEnter,
  //     onNodeMouseMove,
  //     onNodeMouseLeave,
  //     onNodeContextMenu,
  //     onNodeDoubleClick,
  //     onNodeDragStart,
  //     onNodeDrag,
  //     onNodeDragStop,
  //     onNodesDelete,
  //     onEdgesDelete,
  //     onDelete,
  //     onSelectionChange,
  //     onSelectionDragStart,
  //     onSelectionDrag,
  //     onSelectionDragStop,
  //     onSelectionContextMenu,
  //     onSelectionStart,
  //     onSelectionEnd,
  //     onBeforeDelete,
  //     connectionMode,
  //     connectionLineType = ConnectionLineType.Bezier,
  //     connectionLineStyle,
  //     connectionLineComponent,
  //     connectionLineContainerStyle,
  //     deleteKeyCode = 'Backspace',
  //     selectionKeyCode = 'Shift',
  //     selectionOnDrag = false,
  //     selectionMode = SelectionMode.Full,
  //     panActivationKeyCode = 'Space',
  //     multiSelectionKeyCode = isMacOs() ? 'Meta' : 'Control',
  //     zoomActivationKeyCode = isMacOs() ? 'Meta' : 'Control',
  //     snapToGrid,
  //     snapGrid,
  //     onlyRenderVisibleElements = false,
  //     selectNodesOnDrag,
  //     nodesDraggable,
  //     nodesConnectable,
  //     nodesFocusable,
  //     nodeOrigin = defaultNodeOrigin,
  //     edgesFocusable,
  //     edgesUpdatable,
  //     elementsSelectable = true,
  //     defaultViewport = initViewport,
  //     minZoom = 0.5,
  //     maxZoom = 2,
  //     translateExtent = infiniteExtent,
  //     preventScrolling = true,
  //     nodeExtent,
  //     defaultMarkerColor = '#b1b1b7',
  //     zoomOnScroll = true,
  //     zoomOnPinch = true,
  //     panOnScroll = false,
  //     panOnScrollSpeed = 0.5,
  //     panOnScrollMode = PanOnScrollMode.Free,
  //     zoomOnDoubleClick = true,
  //     panOnDrag = true,
  //     onPaneClick,
  //     onPaneMouseEnter,
  //     onPaneMouseMove,
  //     onPaneMouseLeave,
  //     onPaneScroll,
  //     onPaneContextMenu,
  //     children,
  //     onEdgeUpdate,
  //     onEdgeContextMenu,
  //     onEdgeDoubleClick,
  //     onEdgeMouseEnter,
  //     onEdgeMouseMove,
  //     onEdgeMouseLeave,
  //     onEdgeUpdateStart,
  //     onEdgeUpdateEnd,
  //     edgeUpdaterRadius = 10,
  //     onNodesChange,
  //     onEdgesChange,
  //     noDragClassName = 'nodrag',
  //     noWheelClassName = 'nowheel',
  //     noPanClassName = 'nopan',
  //     fitView,
  //     fitViewOptions,
  //     connectOnClick,
  //     attributionPosition,
  //     proOptions,
  //     defaultEdgeOptions,
  //     elevateNodesOnSelect,
  //     elevateEdgesOnSelect,
  //     disableKeyboardA11y = false,
  //     autoPanOnConnect,
  //     autoPanOnNodeDrag,
  //     connectionRadius,
  //     isValidConnection,
  //     onError,
  //     style,
  //     id,
  //     nodeDragThreshold,
  //     viewport,
  //     onViewportChange,
  //     width,
  //     height,
  //     colorMode = 'light',
  //     debug,
  //     ...rest
  //   }: ReactFlowProps<NodeType, EdgeType>,
  //   ref: ForwardedRef<HTMLDivElement>
  // ) {

  const p = mergeProps(
    {
      colorMode: 'light',
      debug: false,
      connectionLineType: ConnectionLineType.Bezier,
      deleteKeyCode: 'Backspace',
      selectionKeyCode: 'Shift',
      selectionOnDrag: false,
      selectionMode: SelectionMode.Full,
      panActivationKeyCode: 'Space',
      multiSelectionKeyCode: isMacOs() ? 'Meta' : 'Control',
      zoomActivationKeyCode: isMacOs() ? 'Meta' : 'Control',
      onlyRenderVisibleElements: false,
      nodeOrigin: defaultNodeOrigin,
      elementsSelectable: true,
      defaultViewport: initViewport,
      minZoom: 0.5,
      maxZoom: 2,
      translateExtent: infiniteExtent,
      preventScrolling: true,
      defaultMarkerColor: '#b1b1b7',
      zoomOnScroll: true,
      zoomOnPinch: true,
      panOnScroll: false,
      panOnScrollSpeed: 0.5,
      panOnScrollMode: PanOnScrollMode.Free,
      zoomOnDoubleClick: true,
      panOnDrag: true,
      paneClickDistance: 0,
      nodeClickDistance: 0,
      reconnectRadius: 10,
      noDragClassName: 'nodrag',
      noWheelClassName: 'nowheel',
      noPanClassName: 'nopan',
      disableKeyboardA11y: false,
    } satisfies Partial<ReactFlowProps<NodeType, EdgeType>>,
    _p
  );

  const [_extractedProps, rest] = splitProps(p, [
    'nodes',
    'edges',
    'defaultNodes',
    'defaultEdges',
    'class',
    'className',
    'nodeTypes',
    'edgeTypes',
    'onNodeClick',
    'onEdgeClick',
    'onInit',
    'onMove',
    'onMoveStart',
    'onMoveEnd',
    'onConnect',
    'onConnectStart',
    'onConnectEnd',
    'onClickConnectStart',
    'onClickConnectEnd',
    'onNodeMouseEnter',
    'onNodeMouseMove',
    'onNodeMouseLeave',
    'onNodeContextMenu',
    'onNodeDoubleClick',
    'onNodeDragStart',
    'onNodeDrag',
    'onNodeDragStop',
    'onNodesDelete',
    'onEdgesDelete',
    'onDelete',
    'onSelectionChange',
    'onSelectionDragStart',
    'onSelectionDrag',
    'onSelectionDragStop',
    'onSelectionContextMenu',
    'onSelectionStart',
    'onSelectionEnd',
    'onBeforeDelete',
    'connectionMode',
    'connectionLineStyle',
    'connectionLineComponent',
    'connectionLineContainerStyle',
    'snapToGrid',
    'snapGrid',
    'onlyRenderVisibleElements',
    'selectNodesOnDrag',
    'nodesDraggable',
    'nodesConnectable',
    'nodesFocusable',
    'nodeExtent',
    'edgesFocusable',
    'edgesReconnectable',
    'onPaneClick',
    'onPaneMouseEnter',
    'onPaneMouseMove',
    'onPaneMouseLeave',
    'onPaneScroll',
    'onPaneContextMenu',
    'paneClickDistance',
    'nodeClickDistance',
    'children',
    'onReconnect',
    'onReconnectStart',
    'onReconnectEnd',
    'onEdgeContextMenu',
    'onEdgeDoubleClick',
    'onEdgeMouseEnter',
    'onEdgeMouseMove',
    'onEdgeMouseLeave',
    'reconnectRadius',
    'onNodesChange',
    'onEdgesChange',
    'noDragClassName',
    'noWheelClassName',
    'noPanClassName',
    'fitView',
    'fitViewOptions',
    'connectOnClick',
    'attributionPosition',
    'proOptions',
    'defaultEdgeOptions',
    'elevateNodesOnSelect',
    'elevateEdgesOnSelect',
    'disableKeyboardA11y',
    'autoPanOnConnect',
    'autoPanOnNodeDrag',
    'autoPanSpeed',
    'connectionRadius',
    'isValidConnection',
    'onError',
    'style',
    'id',
    'nodeDragThreshold',
    'viewport',
    'onViewportChange',
    'width',
    'height',
    'onScroll',
  ]);

  const rfId = () => p.id || '1';
  const colorModeClassName = useColorModeClass(() => p.colorMode);

  // Undo scroll events, preventing viewport from shifting when nodes outside of it are focused
  const wrapperOnScroll = (e: Event) => {
    const target = e.currentTarget as HTMLDivElement;
    target.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Handle onScroll callback if it exists and is callable
    if (typeof p.onScroll === 'function') {
      p.onScroll(e as Event & { currentTarget: HTMLDivElement; target: Element });
    }
  };

  return (
    <div
      data-testid="rf__wrapper"
      {...rest}
      onScroll={wrapperOnScroll}
      style={{ ...(typeof p.style === 'object' ? p.style : null), ...wrapperStyle }}
      ref={p.ref}
      class={cc(['react-flow', p.class || p.className, colorModeClassName])}
      id={p.id}
    >
      <Wrapper
        nodes={p.nodes}
        edges={p.edges}
        width={p.width}
        height={p.height}
        fitView={p.fitView}
        fitViewOptions={p.fitViewOptions}
        minZoom={p.minZoom}
        maxZoom={p.maxZoom}
        nodeOrigin={p.nodeOrigin}
        nodeExtent={p.nodeExtent}
      >
        <GraphView<NodeType, EdgeType>
          onInit={p.onInit}
          onNodeClick={p.onNodeClick}
          onEdgeClick={p.onEdgeClick}
          onNodeMouseEnter={p.onNodeMouseEnter}
          onNodeMouseMove={p.onNodeMouseMove}
          onNodeMouseLeave={p.onNodeMouseLeave}
          onNodeContextMenu={p.onNodeContextMenu}
          onNodeDoubleClick={p.onNodeDoubleClick}
          nodeTypes={p.nodeTypes}
          edgeTypes={p.edgeTypes}
          connectionLineType={p.connectionLineType}
          connectionLineStyle={p.connectionLineStyle}
          connectionLineComponent={p.connectionLineComponent}
          connectionLineContainerStyle={p.connectionLineContainerStyle}
          selectionKeyCode={p.selectionKeyCode}
          selectionOnDrag={p.selectionOnDrag}
          selectionMode={p.selectionMode}
          deleteKeyCode={p.deleteKeyCode}
          multiSelectionKeyCode={p.multiSelectionKeyCode}
          panActivationKeyCode={p.panActivationKeyCode}
          zoomActivationKeyCode={p.zoomActivationKeyCode}
          onlyRenderVisibleElements={p.onlyRenderVisibleElements}
          defaultViewport={p.defaultViewport}
          translateExtent={p.translateExtent}
          minZoom={p.minZoom}
          maxZoom={p.maxZoom}
          preventScrolling={p.preventScrolling}
          zoomOnScroll={p.zoomOnScroll}
          zoomOnPinch={p.zoomOnPinch}
          zoomOnDoubleClick={p.zoomOnDoubleClick}
          panOnScroll={p.panOnScroll}
          panOnScrollSpeed={p.panOnScrollSpeed}
          panOnScrollMode={p.panOnScrollMode}
          panOnDrag={p.panOnDrag}
          onPaneClick={p.onPaneClick}
          onPaneMouseEnter={p.onPaneMouseEnter}
          onPaneMouseMove={p.onPaneMouseMove}
          onPaneMouseLeave={p.onPaneMouseLeave}
          onPaneScroll={p.onPaneScroll}
          onPaneContextMenu={p.onPaneContextMenu}
          paneClickDistance={p.paneClickDistance}
          nodeClickDistance={p.nodeClickDistance}
          onSelectionContextMenu={p.onSelectionContextMenu}
          onSelectionStart={p.onSelectionStart}
          onSelectionEnd={p.onSelectionEnd}
          onReconnect={p.onReconnect}
          onReconnectStart={p.onReconnectStart}
          onReconnectEnd={p.onReconnectEnd}
          onEdgeContextMenu={p.onEdgeContextMenu}
          onEdgeDoubleClick={p.onEdgeDoubleClick}
          onEdgeMouseEnter={p.onEdgeMouseEnter}
          onEdgeMouseMove={p.onEdgeMouseMove}
          onEdgeMouseLeave={p.onEdgeMouseLeave}
          reconnectRadius={p.reconnectRadius}
          defaultMarkerColor={p.defaultMarkerColor}
          noDragClassName={p.noDragClassName}
          noWheelClassName={p.noWheelClassName}
          noPanClassName={p.noPanClassName}
          rfId={rfId()}
          disableKeyboardA11y={p.disableKeyboardA11y}
          nodeExtent={p.nodeExtent}
          viewport={p.viewport}
          onViewportChange={p.onViewportChange}
        />
        <StoreUpdater<NodeType, EdgeType>
          nodes={p.nodes}
          edges={p.edges}
          defaultNodes={p.defaultNodes}
          defaultEdges={p.defaultEdges}
          onConnect={p.onConnect}
          onConnectStart={p.onConnectStart}
          onConnectEnd={p.onConnectEnd}
          onClickConnectStart={p.onClickConnectStart}
          onClickConnectEnd={p.onClickConnectEnd}
          nodesDraggable={p.nodesDraggable}
          nodesConnectable={p.nodesConnectable}
          nodesFocusable={p.nodesFocusable}
          edgesFocusable={p.edgesFocusable}
          edgesReconnectable={p.edgesReconnectable}
          elementsSelectable={p.elementsSelectable}
          elevateNodesOnSelect={p.elevateNodesOnSelect}
          elevateEdgesOnSelect={p.elevateEdgesOnSelect}
          minZoom={p.minZoom}
          maxZoom={p.maxZoom}
          nodeExtent={p.nodeExtent}
          onNodesChange={p.onNodesChange}
          onEdgesChange={p.onEdgesChange}
          snapToGrid={p.snapToGrid}
          snapGrid={p.snapGrid}
          connectionMode={p.connectionMode}
          translateExtent={p.translateExtent}
          connectOnClick={p.connectOnClick}
          defaultEdgeOptions={p.defaultEdgeOptions}
          fitView={p.fitView}
          fitViewOptions={p.fitViewOptions}
          onNodesDelete={p.onNodesDelete}
          onEdgesDelete={p.onEdgesDelete}
          onDelete={p.onDelete}
          onNodeDragStart={p.onNodeDragStart}
          onNodeDrag={p.onNodeDrag}
          onNodeDragStop={p.onNodeDragStop}
          onSelectionDrag={p.onSelectionDrag}
          onSelectionDragStart={p.onSelectionDragStart}
          onSelectionDragStop={p.onSelectionDragStop}
          onMove={p.onMove}
          onMoveStart={p.onMoveStart}
          onMoveEnd={p.onMoveEnd}
          noPanClassName={p.noPanClassName}
          nodeOrigin={p.nodeOrigin}
          rfId={rfId()}
          autoPanOnConnect={p.autoPanOnConnect}
          autoPanOnNodeDrag={p.autoPanOnNodeDrag}
          autoPanSpeed={p.autoPanSpeed}
          onError={p.onError}
          connectionRadius={p.connectionRadius}
          isValidConnection={p.isValidConnection}
          selectNodesOnDrag={p.selectNodesOnDrag}
          nodeDragThreshold={p.nodeDragThreshold}
          onBeforeDelete={p.onBeforeDelete}
          paneClickDistance={p.paneClickDistance}
          debug={p.debug}
        />
        <SelectionListener onSelectionChange={p.onSelectionChange} />
        {p.children}
        <Attribution proOptions={p.proOptions} position={p.attributionPosition} />
        <A11yDescriptions rfId={rfId()} disableKeyboardA11y={p.disableKeyboardA11y} />
      </Wrapper>
    </div>
  );
}

/**
 * The `<ReactFlow />` component is the heart of your React Flow application.
 * It renders your nodes and edges and handles user interaction
 *
 * @public
 *
 * @example
 * ```tsx
 *import { ReactFlow } from '@xyflow/solid'
 *
 *export default function Flow() {
 *  return (<ReactFlow
 *    nodes={...}
 *    edges={...}
 *    onNodesChange={...}
 *    ...
 *  />);
 *}
 *```
 */
export default ReactFlow;
