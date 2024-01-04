import { memo, ReactNode } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import useVisibleEdgeIds from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import EdgeWrapper from '../../components/EdgeWrapper';
import type { ReactFlowState } from '../../types';

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
  | 'rfId'
  | 'disableKeyboardA11y'
  | 'edgeTypes'
> & {
  children?: ReactNode;
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
  const edgeIds = useVisibleEdgeIds(onlyRenderVisibleElements);

  return (
    <div className="react-flow__edges">
      <MarkerDefinitions defaultColor={defaultMarkerColor} rfId={rfId} />

      {edgeIds.map((id) => {
        return (
          <EdgeWrapper
            key={id}
            id={id}
            edgesFocusable={edgesFocusable}
            edgesUpdatable={edgesUpdatable}
            elementsSelectable={elementsSelectable}
            noPanClassName={noPanClassName}
            onEdgeUpdate={onEdgeUpdate}
            onContextMenu={onEdgeContextMenu}
            onMouseEnter={onEdgeMouseEnter}
            onMouseMove={onEdgeMouseMove}
            onMouseLeave={onEdgeMouseLeave}
            onClick={onEdgeClick}
            edgeUpdaterRadius={edgeUpdaterRadius}
            onDoubleClick={onEdgeDoubleClick}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            rfId={rfId}
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
