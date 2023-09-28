import { memo } from 'react';

import FlowRenderer from '../FlowRenderer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import ViewportWrapper from '../Viewport';
import useOnInitHandler from '../../hooks/useOnInitHandler';
import useViewportSync from '../../hooks/useViewportSync';
import ConnectionLine from '../../components/ConnectionLine';
import type { ReactFlowProps } from '../../types';
import { createNodeTypes } from '../NodeRenderer/utils';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import { useNodeOrEdgeTypes } from './utils';

export type GraphViewProps = Omit<
  ReactFlowProps,
  'onSelectionChange' | 'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes' | 'onMove' | 'onMoveStart' | 'onMoveEnd'
> &
  Required<
    Pick<
      ReactFlowProps,
      | 'nodeTypes'
      | 'edgeTypes'
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
      | 'noDragClassName'
      | 'noWheelClassName'
      | 'noPanClassName'
      | 'defaultViewport'
      | 'disableKeyboardA11y'
      | 'nodeOrigin'
    >
  > & {
    rfId: string;
  };

const GraphView = ({
  nodeTypes,
  edgeTypes,
  onInit,
  onNodeClick,
  onEdgeClick,
  onNodeDoubleClick,
  onEdgeDoubleClick,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeContextMenu,
  onSelectionContextMenu,
  onSelectionStart,
  onSelectionEnd,
  connectionLineType,
  connectionLineStyle,
  connectionLineComponent,
  connectionLineContainerStyle,
  selectionKeyCode,
  selectionOnDrag,
  selectionMode,
  multiSelectionKeyCode,
  panActivationKeyCode,
  zoomActivationKeyCode,
  deleteKeyCode,
  onlyRenderVisibleElements,
  elementsSelectable,
  defaultViewport,
  translateExtent,
  minZoom,
  maxZoom,
  preventScrolling,
  defaultMarkerColor,
  zoomOnScroll,
  zoomOnPinch,
  panOnScroll,
  panOnScrollSpeed,
  panOnScrollMode,
  zoomOnDoubleClick,
  panOnDrag,
  onPaneClick,
  onPaneMouseEnter,
  onPaneMouseMove,
  onPaneMouseLeave,
  onPaneScroll,
  onPaneContextMenu,
  onEdgeUpdate,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  edgeUpdaterRadius,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  noDragClassName,
  noWheelClassName,
  noPanClassName,
  elevateEdgesOnSelect,
  disableKeyboardA11y,
  nodeOrigin,
  nodeExtent,
  rfId,
  viewport,
  onViewportChange,
}: GraphViewProps) => {
  const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
  const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);

  useOnInitHandler(onInit);
  useViewportSync(viewport);

  return (
    <FlowRenderer
      onPaneClick={onPaneClick}
      onPaneMouseEnter={onPaneMouseEnter}
      onPaneMouseMove={onPaneMouseMove}
      onPaneMouseLeave={onPaneMouseLeave}
      onPaneContextMenu={onPaneContextMenu}
      onPaneScroll={onPaneScroll}
      deleteKeyCode={deleteKeyCode}
      selectionKeyCode={selectionKeyCode}
      selectionOnDrag={selectionOnDrag}
      selectionMode={selectionMode}
      onSelectionStart={onSelectionStart}
      onSelectionEnd={onSelectionEnd}
      multiSelectionKeyCode={multiSelectionKeyCode}
      panActivationKeyCode={panActivationKeyCode}
      zoomActivationKeyCode={zoomActivationKeyCode}
      elementsSelectable={elementsSelectable}
      zoomOnScroll={zoomOnScroll}
      zoomOnPinch={zoomOnPinch}
      zoomOnDoubleClick={zoomOnDoubleClick}
      panOnScroll={panOnScroll}
      panOnScrollSpeed={panOnScrollSpeed}
      panOnScrollMode={panOnScrollMode}
      panOnDrag={panOnDrag}
      defaultViewport={defaultViewport}
      translateExtent={translateExtent}
      minZoom={minZoom}
      maxZoom={maxZoom}
      onSelectionContextMenu={onSelectionContextMenu}
      preventScrolling={preventScrolling}
      noDragClassName={noDragClassName}
      noWheelClassName={noWheelClassName}
      noPanClassName={noPanClassName}
      disableKeyboardA11y={disableKeyboardA11y}
      onViewportChange={onViewportChange}
      isControlledViewport={!!viewport}
    >
      <ViewportWrapper>
        <EdgeRenderer
          edgeTypes={edgeTypesWrapped}
          onEdgeClick={onEdgeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeUpdate={onEdgeUpdate}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseMove={onEdgeMouseMove}
          onEdgeMouseLeave={onEdgeMouseLeave}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          edgeUpdaterRadius={edgeUpdaterRadius}
          defaultMarkerColor={defaultMarkerColor}
          noPanClassName={noPanClassName}
          elevateEdgesOnSelect={!!elevateEdgesOnSelect}
          disableKeyboardA11y={disableKeyboardA11y}
          rfId={rfId}
        >
          <ConnectionLine
            style={connectionLineStyle}
            type={connectionLineType}
            component={connectionLineComponent}
            containerStyle={connectionLineContainerStyle}
          />
        </EdgeRenderer>
        <div className="react-flow__edgelabel-renderer" />

        <NodeRenderer
          nodeTypes={nodeTypesWrapped}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onNodeMouseMove}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeContextMenu={onNodeContextMenu}
          onlyRenderVisibleElements={onlyRenderVisibleElements}
          noPanClassName={noPanClassName}
          noDragClassName={noDragClassName}
          disableKeyboardA11y={disableKeyboardA11y}
          nodeOrigin={nodeOrigin}
          nodeExtent={nodeExtent}
          rfId={rfId}
        />
      </ViewportWrapper>
    </FlowRenderer>
  );
};

GraphView.displayName = 'GraphView';

export default memo(GraphView);
