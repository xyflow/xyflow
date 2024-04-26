// import { memo, ReactNode } from 'react';
// import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { useVisibleEdgeIds } from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions';
import { GraphViewProps } from '../GraphView';
import { EdgeWrapper } from '../../components/EdgeWrapper';
import type { Edge, SolidFlowState, Node } from '../../types';
import { For, ParentProps } from 'solid-js';

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
>;

const selector = (s: SolidFlowState) => ({
  width: s.width,
  height: s.height,
  edgesFocusable: s.edgesFocusable,
  edgesUpdatable: s.edgesUpdatable,
  elementsSelectable: s.elementsSelectable,
  connectionMode: s.connectionMode,
  onError: s.onError,
});

function EdgeRendererComponent<EdgeType extends Edge = Edge>(p: ParentProps<EdgeRendererProps<EdgeType>>) {
  //   defaultMarkerColor,
  //   onlyRenderVisibleElements,
  //   rfId,
  //   edgeTypes,
  //   noPanClassName,
  //   onEdgeUpdate,
  //   onEdgeContextMenu,
  //   onEdgeMouseEnter,
  //   onEdgeMouseMove,
  //   onEdgeMouseLeave,
  //   onEdgeClick,
  //   edgeUpdaterRadius,
  //   onEdgeDoubleClick,
  //   onEdgeUpdateStart,
  //   onEdgeUpdateEnd,
  //   disableKeyboardA11y,
  // }: EdgeRendererProps<EdgeType>) {
  const { edgesFocusable, edgesUpdatable, elementsSelectable, onError } = useStore(selector);
  const edgeIds = useVisibleEdgeIds(() => p.onlyRenderVisibleElements);

  return (
    <div class="react-flow__edges">
      <MarkerDefinitions defaultColor={p.defaultMarkerColor} rfId={p.rfId} />

      <For each={edgeIds()}>
        {(id) => {
          console.log('rendering edge with id', id);
          return (
            <EdgeWrapper<EdgeType>
              id={id}
              edgesFocusable={edgesFocusable.get()}
              edgesUpdatable={edgesUpdatable.get()}
              elementsSelectable={elementsSelectable.get()}
              noPanClassName={p.noPanClassName}
              onEdgeUpdate={p.onEdgeUpdate}
              onContextMenu={p.onEdgeContextMenu}
              onMouseEnter={p.onEdgeMouseEnter}
              onMouseMove={p.onEdgeMouseMove}
              onMouseLeave={p.onEdgeMouseLeave}
              onClick={p.onEdgeClick}
              edgeUpdaterRadius={p.edgeUpdaterRadius}
              onDoubleClick={p.onEdgeDoubleClick}
              onEdgeUpdateStart={p.onEdgeUpdateStart}
              onEdgeUpdateEnd={p.onEdgeUpdateEnd}
              rfId={p.rfId}
              onError={onError.get()}
              edgeTypes={p.edgeTypes}
              disableKeyboardA11y={p.disableKeyboardA11y}
            />
          );
        }}
      </For>
    </div>
  );
}

EdgeRendererComponent.displayName = 'EdgeRenderer';

export const EdgeRenderer = EdgeRendererComponent;
