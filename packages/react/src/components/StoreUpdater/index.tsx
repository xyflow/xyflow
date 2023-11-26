/*
 * This component helps us to update the store with the vlues coming from the user.
 * We distinguish between values we can update directly with `useDirectStoreUpdater` (like `snapGrid`)
 * and values that have a dedicated setter function in the store (like `setNodes`).
 */
import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { ReactFlowState, ReactFlowProps } from '../../types';

type StoreUpdaterProps = Pick<
  ReactFlowProps,
  | 'nodes'
  | 'edges'
  | 'defaultNodes'
  | 'defaultEdges'
  | 'onConnect'
  | 'onConnectStart'
  | 'onConnectEnd'
  | 'onClickConnectStart'
  | 'onClickConnectEnd'
  | 'nodesDraggable'
  | 'nodesConnectable'
  | 'nodesFocusable'
  | 'edgesFocusable'
  | 'edgesUpdatable'
  | 'minZoom'
  | 'maxZoom'
  | 'nodeExtent'
  | 'onNodesChange'
  | 'onEdgesChange'
  | 'elementsSelectable'
  | 'connectionMode'
  | 'snapToGrid'
  | 'snapGrid'
  | 'translateExtent'
  | 'connectOnClick'
  | 'defaultEdgeOptions'
  | 'fitView'
  | 'fitViewOptions'
  | 'onNodesDelete'
  | 'onEdgesDelete'
  | 'onDelete'
  | 'onNodeDragStart'
  | 'onNodeDrag'
  | 'onNodeDragStop'
  | 'onSelectionDragStart'
  | 'onSelectionDrag'
  | 'onSelectionDragStop'
  | 'onMove'
  | 'onMoveStart'
  | 'onMoveEnd'
  | 'noPanClassName'
  | 'nodeOrigin'
  | 'elevateNodesOnSelect'
  | 'autoPanOnConnect'
  | 'autoPanOnNodeDrag'
  | 'onError'
  | 'connectionRadius'
  | 'isValidConnection'
  | 'selectNodesOnDrag'
  | 'nodeDragThreshold'
> & { rfId: string };

const selector = (s: ReactFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
});

const StoreUpdater = (props: StoreUpdaterProps) => {
  const {
    setNodes,
    setEdges,
    setDefaultNodesAndEdges,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    reset,
  } = useStore(selector, shallow);
  const store = useStoreApi();

  useEffect(() => {
    const edgesWithDefaults = props.defaultEdges?.map((e) => ({ ...e, ...props.defaultEdgeOptions }));
    setDefaultNodesAndEdges(props.defaultNodes, edgesWithDefaults);

    return () => {
      reset();
    };
  }, []);

  const fieldsToTrack: (keyof StoreUpdaterProps)[] = [
    'nodes',
    'edges',
    'defaultNodes',
    'defaultEdges',
    'onConnect',
    'onConnectStart',
    'onConnectEnd',
    'onClickConnectStart',
    'onClickConnectEnd',
    'nodesDraggable',
    'nodesConnectable',
    'nodesFocusable',
    'edgesFocusable',
    'edgesUpdatable',
    'elevateNodesOnSelect',
    'minZoom',
    'maxZoom',
    'nodeExtent',
    'onNodesChange',
    'onEdgesChange',
    'elementsSelectable',
    'connectionMode',
    'snapGrid',
    'snapToGrid',
    'translateExtent',
    'connectOnClick',
    'defaultEdgeOptions',
    'fitView',
    'fitViewOptions',
    'onNodesDelete',
    'onEdgesDelete',
    'onDelete',
    'onNodeDrag',
    'onNodeDragStart',
    'onNodeDragStop',
    'onSelectionDrag',
    'onSelectionDragStart',
    'onSelectionDragStop',
    'onMoveStart',
    'onMove',
    'onMoveEnd',
    'noPanClassName',
    'nodeOrigin',
    'rfId',
    'autoPanOnConnect',
    'autoPanOnNodeDrag',
    'onError',
    'connectionRadius',
    'isValidConnection',
    'selectNodesOnDrag',
    'nodeDragThreshold',
  ];
  const previousFields = useRef<Partial<StoreUpdaterProps>>({});

  useEffect(
    () => {
      store.batchUpdates(() => {
        for (const fieldName of fieldsToTrack) {
          const fieldValue = props[fieldName];
          const previousFieldValue = previousFields.current[fieldName];

          if (fieldValue === previousFieldValue) continue;
          if (typeof props[fieldName] === 'undefined') continue;

          // Custom handling for some fields
          if (fieldName === 'nodes') setNodes(fieldValue as any);
          else if (fieldName === 'edges') setEdges(fieldValue as any);
          else if (fieldName === 'minZoom') setMinZoom(fieldValue as any);
          else if (fieldName === 'maxZoom') setMaxZoom(fieldValue as any);
          else if (fieldName === 'translateExtent') setTranslateExtent(fieldValue as any);
          else if (fieldName === 'nodeExtent') setNodeExtent(fieldValue as any);
          // Renamed fields
          else if (fieldName === 'fitView') store.setState({ fitViewOnInit: fieldValue as any });
          else if (fieldName === 'fitViewOptions') store.setState({ fitViewOnInitOptions: fieldValue as any });
          // General case
          else store.setState({ [fieldName]: fieldValue });
        }
      });

      previousFields.current = props;
    },
    // Only re-run the effect if one of the fields we track changes
    fieldsToTrack.map((fieldName) => props[fieldName])
  );

  return null;
};

export default StoreUpdater;
