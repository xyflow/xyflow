import { ForwardedRef, useCallback, type CSSProperties } from 'react';
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
import { fixedForwardRef } from '../../utils/general';

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
};

function ReactFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  {
    nodes,
    edges,
    defaultNodes,
    defaultEdges,
    className,
    nodeTypes,
    edgeTypes,
    onNodeClick,
    onEdgeClick,
    onInit,
    onMove,
    onMoveStart,
    onMoveEnd,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onClickConnectStart,
    onClickConnectEnd,
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
    onDelete,
    onSelectionChange,
    onSelectionDragStart,
    onSelectionDrag,
    onSelectionDragStop,
    onSelectionContextMenu,
    onSelectionStart,
    onSelectionEnd,
    onBeforeDelete,
    connectionMode,
    connectionLineType = ConnectionLineType.Bezier,
    connectionLineStyle,
    connectionLineComponent,
    connectionLineContainerStyle,
    deleteKeyCode = 'Backspace',
    selectionKeyCode = 'Shift',
    selectionOnDrag = false,
    selectionMode = SelectionMode.Full,
    panActivationKeyCode = 'Space',
    multiSelectionKeyCode = isMacOs() ? 'Meta' : 'Control',
    zoomActivationKeyCode = isMacOs() ? 'Meta' : 'Control',
    snapToGrid,
    snapGrid,
    onlyRenderVisibleElements = false,
    selectNodesOnDrag,
    nodesDraggable,
    autoPanOnNodeFocus,
    nodesConnectable,
    nodesFocusable,
    nodeOrigin = defaultNodeOrigin,
    edgesFocusable,
    edgesReconnectable,
    elementsSelectable = true,
    defaultViewport = initViewport,
    minZoom = 0.5,
    maxZoom = 2,
    translateExtent = infiniteExtent,
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
    onPaneMouseEnter,
    onPaneMouseMove,
    onPaneMouseLeave,
    onPaneScroll,
    onPaneContextMenu,
    paneClickDistance = 1,
    nodeClickDistance = 0,
    children,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
    onEdgeContextMenu,
    onEdgeDoubleClick,
    onEdgeMouseEnter,
    onEdgeMouseMove,
    onEdgeMouseLeave,
    reconnectRadius = 10,
    onNodesChange,
    onEdgesChange,
    noDragClassName = 'nodrag',
    noWheelClassName = 'nowheel',
    noPanClassName = 'nopan',
    fitView,
    fitViewOptions,
    connectOnClick,
    attributionPosition,
    proOptions,
    defaultEdgeOptions,
    elevateNodesOnSelect = true,
    elevateEdgesOnSelect = false,
    disableKeyboardA11y = false,
    autoPanOnConnect,
    autoPanOnNodeDrag,
    autoPanSpeed,
    connectionRadius,
    isValidConnection,
    onError,
    style,
    id,
    nodeDragThreshold,
    connectionDragThreshold,
    viewport,
    onViewportChange,
    width,
    height,
    colorMode = 'light',
    debug,
    onScroll,
    ariaLabelConfig,
    zIndexMode = 'basic',
    ...rest
  }: ReactFlowProps<NodeType, EdgeType>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const rfId = id || '1';
  const colorModeClassName = useColorModeClass(colorMode);

  // Undo scroll events, preventing viewport from shifting when nodes outside of it are focused
  const wrapperOnScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      e.currentTarget.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      onScroll?.(e);
    },
    [onScroll]
  );

  return (
    <div
      data-testid="rf__wrapper"
      {...rest}
      onScroll={wrapperOnScroll}
      style={{ ...style, ...wrapperStyle }}
      ref={ref}
      className={cc(['react-flow', className, colorModeClassName])}
      id={id}
      role="application"
    >
      <Wrapper
        nodes={nodes}
        edges={edges}
        width={width}
        height={height}
        fitView={fitView}
        fitViewOptions={fitViewOptions}
        minZoom={minZoom}
        maxZoom={maxZoom}
        nodeOrigin={nodeOrigin}
        nodeExtent={nodeExtent}
        zIndexMode={zIndexMode}
      >
        <GraphView<NodeType, EdgeType>
          onInit={onInit}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          connectionLineComponent={connectionLineComponent}
          connectionLineContainerStyle={connectionLineContainerStyle}
          selectionKeyCode={selectionKeyCode}
          selectionOnDrag={selectionOnDrag}
          selectionMode={selectionMode}
          deleteKeyCode={deleteKeyCode}
          multiSelectionKeyCode={multiSelectionKeyCode}
          panActivationKeyCode={panActivationKeyCode}
          zoomActivationKeyCode={zoomActivationKeyCode}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          defaultViewport={defaultViewport}
          translateExtent={translateExtent}
          minZoom={minZoom}
          maxZoom={maxZoom}
          preventScrolling={preventScrolling}
          zoomOnScroll={zoomOnScroll}
          zoomOnPinch={zoomOnPinch}
          zoomOnDoubleClick={zoomOnDoubleClick}
          panOnScroll={panOnScroll}
          panOnScrollSpeed={panOnScrollSpeed}
          panOnScrollMode={panOnScrollMode}
          panOnDrag={panOnDrag}
          onPaneClick={onPaneClick}
          onPaneMouseEnter={onPaneMouseEnter}
          onPaneMouseMove={onPaneMouseMove}
          onPaneMouseLeave={onPaneMouseLeave}
          onPaneScroll={onPaneScroll}
          onPaneContextMenu={onPaneContextMenu}
          paneClickDistance={paneClickDistance}
          nodeClickDistance={nodeClickDistance}
          onSelectionContextMenu={onSelectionContextMenu}
          onSelectionStart={onSelectionStart}
          onSelectionEnd={onSelectionEnd}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseMove={onEdgeMouseMove}
          onEdgeMouseLeave={onEdgeMouseLeave}
          reconnectRadius={reconnectRadius}
          defaultMarkerColor={defaultMarkerColor}
          noDragClassName={noDragClassName}
          noWheelClassName={noWheelClassName}
          noPanClassName={noPanClassName}
          rfId={rfId}
          disableKeyboardA11y={disableKeyboardA11y}
          nodeExtent={nodeExtent}
          viewport={viewport}
          onViewportChange={onViewportChange}
        />
        <StoreUpdater<NodeType, EdgeType>
          nodes={nodes}
          edges={edges}
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onClickConnectStart={onClickConnectStart}
          onClickConnectEnd={onClickConnectEnd}
          nodesDraggable={nodesDraggable}
          autoPanOnNodeFocus={autoPanOnNodeFocus}
          nodesConnectable={nodesConnectable}
          nodesFocusable={nodesFocusable}
          edgesFocusable={edgesFocusable}
          edgesReconnectable={edgesReconnectable}
          elementsSelectable={elementsSelectable}
          elevateNodesOnSelect={elevateNodesOnSelect}
          elevateEdgesOnSelect={elevateEdgesOnSelect}
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
          onDelete={onDelete}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onSelectionDrag={onSelectionDrag}
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDragStop={onSelectionDragStop}
          onMove={onMove}
          onMoveStart={onMoveStart}
          onMoveEnd={onMoveEnd}
          noPanClassName={noPanClassName}
          nodeOrigin={nodeOrigin}
          rfId={rfId}
          autoPanOnConnect={autoPanOnConnect}
          autoPanOnNodeDrag={autoPanOnNodeDrag}
          autoPanSpeed={autoPanSpeed}
          onError={onError}
          connectionRadius={connectionRadius}
          isValidConnection={isValidConnection}
          selectNodesOnDrag={selectNodesOnDrag}
          nodeDragThreshold={nodeDragThreshold}
          connectionDragThreshold={connectionDragThreshold}
          onBeforeDelete={onBeforeDelete}
          debug={debug}
          ariaLabelConfig={ariaLabelConfig}
          zIndexMode={zIndexMode}
        />
        <SelectionListener<NodeType, EdgeType> onSelectionChange={onSelectionChange} />
        {children}
        <Attribution proOptions={proOptions} position={attributionPosition} />
        <A11yDescriptions rfId={rfId} disableKeyboardA11y={disableKeyboardA11y} />
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
 *import { ReactFlow } from '@xyflow/react'
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
export default fixedForwardRef(ReactFlow);
