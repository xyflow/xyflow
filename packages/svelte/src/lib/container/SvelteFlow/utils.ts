import type { SvelteFlowStore } from '$lib/store/types';
import type { EdgeTypes, NodeTypes } from '$lib/types';
import type { CoordinateExtent } from '@xyflow/system';
import type { Writable } from 'svelte/store';

// this is helper function for updating the store
// for props where we need to call a specific store action
export function updateStore(
  store: SvelteFlowStore,
  {
    nodeTypes,
    edgeTypes,
    minZoom,
    maxZoom,
    translateExtent
  }: {
    nodeTypes?: NodeTypes;
    edgeTypes?: EdgeTypes;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: CoordinateExtent;
  }
) {
  if (nodeTypes !== undefined) {
    store.setNodeTypes(nodeTypes);
  }

  if (edgeTypes !== undefined) {
    store.setEdgeTypes(edgeTypes);
  }

  if (minZoom !== undefined) {
    store.setMinZoom(minZoom);
  }

  if (maxZoom !== undefined) {
    store.setMaxZoom(maxZoom);
  }

  if (translateExtent !== undefined) {
    store.setTranslateExtent(translateExtent);
  }
}

const getKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

type UnwrapWritable<T> = T extends Writable<infer U> ? U : T;

// @todo there must be a better way to define the types here..
export type UpdatableStoreProps = {
  flowId?: UnwrapWritable<SvelteFlowStore['flowId']>;
  connectionLineType?: UnwrapWritable<SvelteFlowStore['connectionLineType']>;
  connectionRadius?: UnwrapWritable<SvelteFlowStore['connectionRadius']>;
  selectionMode?: UnwrapWritable<SvelteFlowStore['selectionMode']>;
  snapGrid?: UnwrapWritable<SvelteFlowStore['snapGrid']>;
  defaultMarkerColor?: UnwrapWritable<SvelteFlowStore['defaultMarkerColor']>;
  nodesDraggable?: UnwrapWritable<SvelteFlowStore['nodesDraggable']>;
  nodesConnectable?: UnwrapWritable<SvelteFlowStore['nodesConnectable']>;
  elementsSelectable?: UnwrapWritable<SvelteFlowStore['elementsSelectable']>;
  onlyRenderVisibleElements?: UnwrapWritable<SvelteFlowStore['onlyRenderVisibleElements']>;
  isValidConnection?: UnwrapWritable<SvelteFlowStore['isValidConnection']>;
  autoPanOnConnect?: UnwrapWritable<SvelteFlowStore['autoPanOnConnect']>;
  autoPanOnNodeDrag?: UnwrapWritable<SvelteFlowStore['autoPanOnNodeDrag']>;
  connectionMode?: UnwrapWritable<SvelteFlowStore['connectionMode']>;
  onerror?: UnwrapWritable<SvelteFlowStore['onerror']>;
  ondelete?: UnwrapWritable<SvelteFlowStore['ondelete']>;
  onedgecreate?: UnwrapWritable<SvelteFlowStore['onedgecreate']>;
  nodeDragThreshold?: UnwrapWritable<SvelteFlowStore['nodeDragThreshold']>;
  onconnect?: UnwrapWritable<SvelteFlowStore['onconnect']>;
  onconnectstart?: UnwrapWritable<SvelteFlowStore['onconnectstart']>;
  onconnectend?: UnwrapWritable<SvelteFlowStore['onconnectend']>;
  onbeforedelete?: UnwrapWritable<SvelteFlowStore['onbeforedelete']>;
};

export function updateStoreByKeys(store: SvelteFlowStore, keys: UpdatableStoreProps) {
  getKeys(keys).forEach((prop) => {
    const update = keys[prop];
    if (update !== undefined) {
      // @todo: how to fix this TS error?
      // @ts-ignore
      store[prop].set(update);
    }
  });
}
