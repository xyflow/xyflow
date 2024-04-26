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

type UsedProps<N extends Node, E extends Edge> = ReactFlowProps<N, E> & { ref?: (node: HTMLDivElement) => void };

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
      multiSelectionKeyCode: isMacOs() ? 'Meta' : 'Control',
      zoomActivationKeyCode: isMacOs() ? 'Meta' : 'Control',
      selectionMode: SelectionMode.Full,
      defaultViewport: initViewport,
      minZoom: 0.5,
      maxZoom: 2,
      translateExtent: infiniteExtent,
      elementsSelectable: true,
      defaultMarkerColor: '#b1b1b7',
      zoomOnScroll: true,
      zoomOnPinch: true,
      panOnScroll: false,
      panOnScrollSpeed: 0.5,
      panOnScrollMode: PanOnScrollMode.Free,
      zoomOnDoubleClick: true,
      panOnDrag: true,
      nodeOrigin: defaultNodeOrigin,
      noWheelClassName: 'nowheel',
      noPanClassName: 'nopan',
      noDragClassName: 'nodrag',
    } satisfies Partial<ReactFlowProps<NodeType, EdgeType>>,
    _p
  );

  const [_extractedProps, rest] = splitProps(p, [
    'nodes',
    'edges',
    'defaultNodes',
    'defaultEdges',
    'class',
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
    'edgesUpdatable',
    'onPaneClick',
    'onPaneMouseEnter',
    'onPaneMouseMove',
    'onPaneMouseLeave',
    'onPaneScroll',
    'onPaneContextMenu',
    'children',
    'onEdgeUpdate',
    'onEdgeContextMenu',
    'onEdgeDoubleClick',
    'onEdgeMouseEnter',
    'onEdgeMouseMove',
    'onEdgeMouseLeave',
    'onEdgeUpdateStart',
    'onEdgeUpdateEnd',
    'edgeUpdaterRadius',
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
  ]);

  const rfId = () => p.id || '1';
  const colorModeClassName = useColorModeClass(() => p.colorMode);

  return (
    <div
      {...rest}
      style={{ ...(typeof p.style === 'object' ? p.style : null), ...wrapperStyle }}
      ref={p.ref}
      class={cc(['react-flow', p.class, colorModeClassName])}
      // class={cc(['react-flow', p.class, colorModeClassName])}
      data-testid="rf__wrapper"
      id={p.id}
    >
      <Wrapper nodes={p.nodes} edges={p.edges} width={p.width} height={p.height} fitView={p.fitView}>
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
          onlyRenderVisibleElements={p.onlyRenderVisibleElements || false}
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
          onSelectionContextMenu={p.onSelectionContextMenu}
          onSelectionStart={p.onSelectionStart}
          onSelectionEnd={p.onSelectionEnd}
          onEdgeUpdate={p.onEdgeUpdate}
          onEdgeContextMenu={p.onEdgeContextMenu}
          onEdgeDoubleClick={p.onEdgeDoubleClick}
          onEdgeMouseEnter={p.onEdgeMouseEnter}
          onEdgeMouseMove={p.onEdgeMouseMove}
          onEdgeMouseLeave={p.onEdgeMouseLeave}
          onEdgeUpdateStart={p.onEdgeUpdateStart}
          onEdgeUpdateEnd={p.onEdgeUpdateEnd}
          edgeUpdaterRadius={p.edgeUpdaterRadius}
          defaultMarkerColor={p.defaultMarkerColor}
          noDragClassName={p.noDragClassName}
          noWheelClassName={p.noWheelClassName}
          noPanClassName={p.noPanClassName}
          rfId={rfId()}
          disableKeyboardA11y={p.disableKeyboardA11y || false}
          nodeOrigin={p.nodeOrigin}
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
          edgesUpdatable={p.edgesUpdatable}
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
          onError={p.onError}
          connectionRadius={p.connectionRadius}
          isValidConnection={p.isValidConnection}
          selectNodesOnDrag={p.selectNodesOnDrag}
          nodeDragThreshold={p.nodeDragThreshold}
          onBeforeDelete={p.onBeforeDelete}
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

export default ReactFlow;
