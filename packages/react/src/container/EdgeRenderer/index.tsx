import { memo, ReactNode } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { useVisibleEdgeIds } from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import { EdgeWrapper } from '../../components/EdgeWrapper';
import type { Edge, ReactFlowState, Node } from '../../types';

type EdgeRendererProps<EdgeType extends Edge = Edge> = Pick<
  GraphViewProps<Node, EdgeType>,
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

function EdgeRendererComponent<EdgeType extends Edge = Edge>({
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
  disableKeyboardA11y,
}: EdgeRendererProps<EdgeType>) {
  const { edgesFocusable, edgesUpdatable, elementsSelectable, onError } = useStore(selector, shallow);
  const edgeIds = useVisibleEdgeIds(onlyRenderVisibleElements);

  return (
    <div className="react-flow__edges">
      <MarkerDefinitions defaultColor={defaultMarkerColor} rfId={rfId} />

      {edgeIds.map((id) => {
        return (
          <EdgeWrapper<EdgeType>
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
            disableKeyboardA11y={disableKeyboardA11y}
          />
        );
      })}
    </div>
  );
}

EdgeRendererComponent.displayName = 'EdgeRenderer';

export const EdgeRenderer = memo(EdgeRendererComponent) as typeof EdgeRendererComponent;
