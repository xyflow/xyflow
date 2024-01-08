/*
 * This component helps us to update the store with the vlues coming from the user.
 * We distinguish between values we can update directly with `useDirectStoreUpdater` (like `snapGrid`)
 * and values that have a dedicated setter function in the store (like `setNodes`).
 */
import { useEffect, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { infiniteExtent, type CoordinateExtent } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { Node, Edge, ReactFlowState, ReactFlowProps, FitViewOptions } from '../../types';
import { initNodeOrigin } from '../../container/ReactFlow';

// these fields exist in the global store and we need to keep them up to date
const reactFlowFieldsToTrack = [
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
  'elevateEdgesOnSelect',
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
  'autoPanOnConnect',
  'autoPanOnNodeDrag',
  'onError',
  'connectionRadius',
  'isValidConnection',
  'selectNodesOnDrag',
  'nodeDragThreshold',
  'onBeforeDelete',
] as const;

type ReactFlowFieldsToTrack = (typeof reactFlowFieldsToTrack)[number];
type StoreUpdaterProps = Pick<ReactFlowProps, ReactFlowFieldsToTrack> & { rfId: string };

// rfId doesn't exist in ReactFlowProps, but it's one of the fields we want to update
const fieldsToTrack = [...reactFlowFieldsToTrack, 'rfId'] as const;

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

export function StoreUpdater(props: StoreUpdaterProps) {
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

  const previousFields = useRef<Partial<StoreUpdaterProps>>({
    // these are values that are also passed directly to other components
    // than the StoreUpdater. We can reduce the number of setStore calls
    // by setting the same values here as prev fields.
    translateExtent: infiniteExtent,
    nodeOrigin: initNodeOrigin,
    minZoom: 0.5,
    maxZoom: 2,
    elementsSelectable: true,
    noPanClassName: 'nopan',
    rfId: '1',
  });

  useEffect(
    () => {
      for (const fieldName of fieldsToTrack) {
        const fieldValue = props[fieldName];
        const previousFieldValue = previousFields.current[fieldName];

        if (fieldValue === previousFieldValue) continue;
        if (typeof props[fieldName] === 'undefined') continue;

        // Custom handling with dedicated setters for some fields
        if (fieldName === 'nodes') setNodes(fieldValue as Node[]);
        else if (fieldName === 'edges') setEdges(fieldValue as Edge[]);
        else if (fieldName === 'minZoom') setMinZoom(fieldValue as number);
        else if (fieldName === 'maxZoom') setMaxZoom(fieldValue as number);
        else if (fieldName === 'translateExtent') setTranslateExtent(fieldValue as CoordinateExtent);
        else if (fieldName === 'nodeExtent') setNodeExtent(fieldValue as CoordinateExtent);
        // Renamed fields
        else if (fieldName === 'fitView') store.setState({ fitViewOnInit: fieldValue as boolean });
        else if (fieldName === 'fitViewOptions') store.setState({ fitViewOnInitOptions: fieldValue as FitViewOptions });
        // General case
        else store.setState({ [fieldName]: fieldValue });
      }

      previousFields.current = props;
    },
    // Only re-run the effect if one of the fields we track changes
    fieldsToTrack.map((fieldName) => props[fieldName])
  );

  return null;
}
