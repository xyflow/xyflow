import { memo, ReactNode } from 'react';

import { useCustomDiff, useReactFlowStore } from '../../hooks/useReactFlowStore';
import { useVisibleEdgeIds } from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import EdgeWrapper from '../../components/EdgeWrapper';
import type { Edge, Node, ReactFlowState } from '../../types';
import { ConnectionMode, OnError } from '@xyflow/system';

type EdgeRendererProps<EdgeType extends Edge = Edge> = Pick<
  GraphViewProps<Node, EdgeType>,
  | 'onEdgeClick'
  | 'onEdgeDoubleClick'
  | 'defaultMarkerColor'
  | 'onlyRenderVisibleElements'
  | 'onReconnect'
  | 'onEdgeContextMenu'
  | 'onEdgeMouseEnter'
  | 'onEdgeMouseMove'
  | 'onEdgeMouseLeave'
  | 'onReconnectStart'
  | 'onReconnectEnd'
  | 'reconnectRadius'
  | 'noPanClassName'
  | 'rfId'
  | 'disableKeyboardA11y'
  | 'edgeTypes'
> & {
  children?: ReactNode;
};

const selector = (s: ReactFlowState) => ({
  edgesFocusable: s.edgesFocusable,
  edgesReconnectable: s.edgesReconnectable,
  elementsSelectable: s.elementsSelectable,
  onError: s.onError,
});

function EdgeRendererComponent<EdgeType extends Edge = Edge>({
  defaultMarkerColor,
  onlyRenderVisibleElements,
  rfId,
  edgeTypes,
  noPanClassName,
  onReconnect,
  onEdgeContextMenu,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  onEdgeClick,
  reconnectRadius,
  onEdgeDoubleClick,
  onReconnectStart,
  onReconnectEnd,
  disableKeyboardA11y,
}: EdgeRendererProps<EdgeType>) {
  const { edgesFocusable, edgesReconnectable, elementsSelectable, onError } = useReactFlowStore(
    useCustomDiff(selector, areEqual)
  );
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
            edgesReconnectable={edgesReconnectable}
            elementsSelectable={elementsSelectable}
            noPanClassName={noPanClassName}
            onReconnect={onReconnect}
            onContextMenu={onEdgeContextMenu}
            onMouseEnter={onEdgeMouseEnter}
            onMouseMove={onEdgeMouseMove}
            onMouseLeave={onEdgeMouseLeave}
            onClick={onEdgeClick}
            reconnectRadius={reconnectRadius}
            onDoubleClick={onEdgeDoubleClick}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
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
function areEqual(
  a: {
    edgesFocusable: boolean;
    edgesReconnectable: boolean;
    elementsSelectable: boolean;
    onError: OnError | undefined;
  },
  b: {
    edgesFocusable: boolean;
    edgesReconnectable: boolean;
    elementsSelectable: boolean;
    onError: OnError | undefined;
  }
): boolean {
  return (
    a.edgesFocusable === b.edgesFocusable &&
    a.edgesReconnectable === b.edgesReconnectable &&
    a.elementsSelectable === b.elementsSelectable &&
    a.onError === b.onError
  );
}
