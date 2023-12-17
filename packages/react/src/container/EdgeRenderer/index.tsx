import { memo, ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import useVisibleEdges from '../../hooks/useVisibleEdges';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import type { ReactFlowState } from '../../types';
import EdgeWrapper from '../../components/EdgeWrapper';

type EdgeRendererProps = Pick<
  GraphViewProps,
  | 'onEdgeClick'
  | 'onEdgeDoubleClick'
  | 'defaultMarkerColor'
  | 'onlyRenderVisibleElements'
  | 'onEdgeUpdate'
  | 'onEdgeContextMenu'
  | 'onEdgeMouseEnter'
  | 'onEdgeMouseMove'
  | 'onEdgeMouseLeave'
  | 'onEdgeUpdateStart'
  | 'onEdgeUpdateEnd'
  | 'edgeUpdaterRadius'
  | 'noPanClassName'
  | 'elevateEdgesOnSelect'
  | 'rfId'
  | 'disableKeyboardA11y'
  | 'edgeTypes'
> & {
  elevateEdgesOnSelect: boolean;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => ({
  width: s.width,
  height: s.height,
  edgesFocusable: s.edgesFocusable,
  edgesUpdatable: s.edgesUpdatable,
  elementsSelectable: s.elementsSelectable,
  connectionMode: s.connectionMode,
  onError: s.onError,
});

const EdgeRenderer = ({
  defaultMarkerColor,
  onlyRenderVisibleElements,
  elevateEdgesOnSelect,
  rfId,
  edgeTypes,
  noPanClassName,
  onEdgeUpdate,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  onEdgeClick,
  edgeUpdaterRadius,
  onEdgeDoubleClick,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  children,
}: EdgeRendererProps) => {
  const { edgesFocusable, edgesUpdatable, elementsSelectable, onError } = useStore(selector, shallow);
  const edges = useVisibleEdges(onlyRenderVisibleElements, elevateEdgesOnSelect);

  return (
    <div className="react-flow__edges">
      <svg className="react-flow__marker">
        <MarkerDefinitions defaultColor={defaultMarkerColor} rfId={rfId} />
      </svg>

      {edges.map((edge) => {
        const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
        const isUpdatable =
          typeof onEdgeUpdate !== 'undefined' &&
          (edge.updatable || (edgesUpdatable && typeof edge.updatable === 'undefined'));
        const isSelectable = !!(edge.selectable || (elementsSelectable && typeof edge.selectable === 'undefined'));

        return (
          <EdgeWrapper
            key={edge.id}
            id={edge.id}
            className={cc([edge.className, noPanClassName])}
            type={edge.type}
            data={edge.data}
            selected={!!edge.selected}
            animated={!!edge.animated}
            hidden={!!edge.hidden}
            zIndex={edge.zIndex}
            label={edge.label}
            labelStyle={edge.labelStyle}
            labelShowBg={edge.labelShowBg}
            labelBgStyle={edge.labelBgStyle}
            labelBgPadding={edge.labelBgPadding}
            labelBgBorderRadius={edge.labelBgBorderRadius}
            style={edge.style}
            source={edge.source}
            target={edge.target}
            sourceHandleId={edge.sourceHandle}
            targetHandleId={edge.targetHandle}
            markerEnd={edge.markerEnd}
            markerStart={edge.markerStart}
            isSelectable={isSelectable}
            onEdgeUpdate={onEdgeUpdate}
            onContextMenu={onEdgeContextMenu}
            onMouseEnter={onEdgeMouseEnter}
            onMouseMove={onEdgeMouseMove}
            onMouseLeave={onEdgeMouseLeave}
            onClick={onEdgeClick}
            edgeUpdaterRadius={edgeUpdaterRadius}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            rfId={rfId}
            ariaLabel={edge.ariaLabel}
            isFocusable={isFocusable}
            isUpdatable={isUpdatable}
            pathOptions={'pathOptions' in edge ? edge.pathOptions : undefined}
            interactionWidth={edge.interactionWidth}
            onError={onError}
            edgeTypes={edgeTypes}
          />
        );
      })}
      {children}
    </div>
  );
};

EdgeRenderer.displayName = 'EdgeRenderer';

export default memo(EdgeRenderer);
