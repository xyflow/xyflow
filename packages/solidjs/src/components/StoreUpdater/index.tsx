/*
 * This component helps us to update the store with the values coming from the user.
 * We distinguish between values we can update directly with `useDirectStoreUpdater` (like `snapGrid`)
 * and values that have a dedicated setter function in the store (like `setNodes`).
 */
// import { useEffect, useRef } from 'react';
// import { shallow } from 'zustand/shallow';
import { infiniteExtent, type CoordinateExtent } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { Node, Edge, SolidFlowState, ReactFlowProps, FitViewOptions } from '../../types';
import { defaultNodeOrigin } from '../../container/ReactFlow/init-values';
import { useRef } from '../../utils/hooks';
import { createEffect, onCleanup, onMount } from 'solid-js';
import { Writable } from '../../store/initialState';

// These fields exist in the global store, and we need to keep them up to date
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
  'edgesReconnectable',
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
  'debug',
  'autoPanSpeed',
  'paneClickDistance',
] as const;

type ReactFlowFieldsToTrack = (typeof reactFlowFieldsToTrack)[number];
type StoreUpdaterProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Pick<
  ReactFlowProps<NodeType, EdgeType>,
  ReactFlowFieldsToTrack
> & {
  rfId: string;
};

// rfId doesn't exist in ReactFlowProps, but it's one of the fields we want to update
const fieldsToTrack = [...reactFlowFieldsToTrack, 'rfId'] as const;

const selector = (s: SolidFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setPaneClickDistance: s.setPaneClickDistance,
});

const initPrevValues = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: infiniteExtent,
  nodeOrigin: defaultNodeOrigin,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: true,
  noPanClassName: 'nopan',
  rfId: '1',
  paneClickDistance: 0,
};

export function StoreUpdater<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  props: StoreUpdaterProps<NodeType, EdgeType>
) {
  const store = useStoreApi<NodeType, EdgeType>();
  const storeData = useStore(selector);
  const previousFields = useRef<Partial<StoreUpdaterProps<NodeType, EdgeType>>>(initPrevValues);

  // FIXME: this should be a createEffect
  onMount(() => {
    // Access setters within reactive scope to maintain reactivity
    storeData.setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
  });

  onCleanup(() => {
    // when we reset the store we also need to reset the previous fields
    previousFields.current = initPrevValues;
    storeData.reset();
  });

  createEffect(() => {
    // Access all setters within reactive scope

    for (const fieldName of fieldsToTrack) {
      const fieldValue = props[fieldName];
      const previousFieldValue = previousFields.current[fieldName];

      if (fieldValue === previousFieldValue) continue;
      if (typeof props[fieldName] === 'undefined') continue;

      // Custom handling with dedicated setters for some fields
      if (fieldName === 'nodes') storeData.setNodes(fieldValue as Node[]);
      else if (fieldName === 'edges') storeData.setEdges(fieldValue as Edge[]);
      else if (fieldName === 'minZoom') storeData.setMinZoom(fieldValue as number);
      else if (fieldName === 'maxZoom') storeData.setMaxZoom(fieldValue as number);
      else if (fieldName === 'translateExtent') storeData.setTranslateExtent(fieldValue as CoordinateExtent);
      else if (fieldName === 'nodeExtent') storeData.setNodeExtent(fieldValue as CoordinateExtent);
      else if (fieldName === 'paneClickDistance') storeData.setPaneClickDistance(fieldValue as number);
      // Renamed fields - use correct field names that match React
      else if (fieldName === 'fitView') store.fitViewQueued.set(fieldValue as boolean);
      else if (fieldName === 'fitViewOptions') store.fitViewOptions.set(fieldValue as FitViewOptions);
      // General case
      else {
        if (fieldName === 'defaultNodes') {
          console.warn('defaultNodes is not a valid field to track');
          continue;
        }
        if (fieldName === 'defaultEdges') {
          console.warn('defaultEdges is not a valid field to track');
          continue;
        }

        // Use type assertion to access store properties dynamically
        const maybeWritable = (store as any)[fieldName];
        if (maybeWritable instanceof Writable) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const w = maybeWritable as Writable<any>;
          w.set(fieldValue);
        } else {
          console.warn(`Field ${fieldName} is not writable`);
        }
      }
    }

    previousFields.current = { ...props };
  });

  return null;
}
