import type { ReactNode } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { useVisibleEdgeIds } from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import EdgeWrapper from '../../components/EdgeWrapper';
import type { Edge, Node } from '../../types';

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

export function EdgeRenderer<EdgeType extends Edge = Edge>({
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
  const { edgesFocusable, edgesReconnectable, elementsSelectable, onError } = useStore(
    (s) => ({
      edgesFocusable: s.edgesFocusable,
      edgesReconnectable: s.edgesReconnectable,
      elementsSelectable: s.elementsSelectable,
      connectionMode: s.connectionMode,
      onError: s.onError,
    }),
    shallow
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
