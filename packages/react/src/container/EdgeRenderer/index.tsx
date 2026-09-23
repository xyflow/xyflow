import { ReactNode } from 'react';

import { useReactFlowStore } from '../../hooks/useReactFlowStore';
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
  const edgesFocusable = useReactFlowStore((s) => s.edgesFocusable);
  const edgesReconnectable = useReactFlowStore((s) => s.edgesReconnectable);
  const elementsSelectable = useReactFlowStore((s) => s.elementsSelectable);
  const onError = useReactFlowStore((s) => s.onError);
  const connectionMode = useReactFlowStore((s) => s.connectionMode);
  const elevateEdgesOnSelect = useReactFlowStore((s) => s.elevateEdgesOnSelect);
  const zIndexMode = useReactFlowStore((s) => s.zIndexMode);
  const defaultEdgeOptions = useReactFlowStore((s) => s.defaultEdgeOptions);

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
            connectionMode={connectionMode}
            elevateEdgesOnSelect={elevateEdgesOnSelect}
            zIndexMode={zIndexMode}
            defaultEdgeOptions={defaultEdgeOptions}
          />
        );
      })}
    </div>
  );
}

EdgeRendererComponent.displayName = 'EdgeRenderer';

export const EdgeRenderer = EdgeRendererComponent;
