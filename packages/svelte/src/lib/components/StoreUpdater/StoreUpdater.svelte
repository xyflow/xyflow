<script lang="ts">
  import { infiniteExtent } from '@xyflow/system';
  import type { SvelteFlowProps, SvelteFlowStore } from '$lib';
  import { untrack } from 'svelte';

  let {
    store,
    nodes = [],
    edges = [],
    edgeTypes,
    nodeTypes,
    minZoom,
    maxZoom,
    translateExtent,
    id,
    connectionLineType,
    connectionRadius,
    selectionMode,
    snapGrid,
    defaultMarkerColor,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
    onlyRenderVisibleElements,
    isValidConnection,
    autoPanOnConnect,
    autoPanOnNodeDrag,
    onerror,
    ondelete,
    onedgecreate,
    connectionMode,
    nodeDragThreshold,
    onconnect,
    onconnectstart,
    onconnectend,
    onbeforedelete
  }: Partial<SvelteFlowProps> & { store: SvelteFlowStore } = $props();

  store.nodes = nodes;
  $effect.pre(() => {
    store.nodes = nodes;
  });

  store.edges = edges;
  $effect.pre(() => {
    store.edges = edges;
  });

  store.setEdgeTypes(edgeTypes ?? {});
  $effect.pre(() => {
    store.setEdgeTypes(edgeTypes ?? {});
  });

  store.setNodeTypes(nodeTypes ?? {});
  $effect.pre(() => {
    store.setNodeTypes(nodeTypes ?? {});
  });

  store.setMinZoom(minZoom ?? 0.5);
  $effect.pre(() => {
    store.setMinZoom(minZoom ?? 0.5);
  });

  store.setMaxZoom(maxZoom ?? 2);
  $effect.pre(() => {
    store.setMaxZoom(maxZoom ?? 2);
  });

  store.setTranslateExtent(translateExtent ?? infiniteExtent);
  $effect.pre(() => {
    store.setTranslateExtent(translateExtent ?? infiniteExtent);
  });

  // These are store items without side effects

  // @ts-expect-error
  store.flowId = id;
  $effect.pre(() => {
    //@ts-expect-error
    store.flowId = id;
  });

  // @ts-expect-error
  store.connectionLineType = connectionLineType;
  $effect.pre(() => {
    //@ts-expect-error
    store.connectionLineType = connectionLineType;
  });

  // @ts-expect-error
  store.connectionRadius = connectionRadius;
  $effect.pre(() => {
    //@ts-expect-error
    store.connectionRadius = connectionRadius;
  });

  // @ts-expect-error
  store.selectionMode = selectionMode;
  $effect.pre(() => {
    //@ts-expect-error
    store.selectionMode = selectionMode;
  });

  // @ts-expect-error
  store.snapGrid = snapGrid;
  $effect.pre(() => {
    //@ts-expect-error
    store.snapGrid = snapGrid;
  });

  // @ts-expect-error
  store.defaultMarkerColor = defaultMarkerColor;
  $effect.pre(() => {
    //@ts-expect-error
    store.defaultMarkerColor = defaultMarkerColor;
  });

  // @ts-expect-error
  store.nodesDraggable = nodesDraggable;
  $effect.pre(() => {
    //@ts-expect-error
    store.nodesDraggable = nodesDraggable;
  });

  // @ts-expect-error
  store.nodesConnectable = nodesConnectable;
  $effect.pre(() => {
    //@ts-expect-error
    store.nodesConnectable = nodesConnectable;
  });

  // @ts-expect-error
  store.elementsSelectable = elementsSelectable;
  $effect.pre(() => {
    //@ts-expect-error
    store.elementsSelectable = elementsSelectable;
  });

  // @ts-expect-error
  store.onlyRenderVisibleElements = onlyRenderVisibleElements;
  $effect.pre(() => {
    //@ts-expect-error
    store.onlyRenderVisibleElements = onlyRenderVisibleElements;
  });

  // @ts-expect-error
  store.isValidConnection = isValidConnection;
  $effect.pre(() => {
    //@ts-expect-error
    store.isValidConnection = isValidConnection;
  });

  // @ts-expect-error
  store.autoPanOnConnect = autoPanOnConnect;
  $effect.pre(() => {
    //@ts-expect-error
    store.autoPanOnConnect = autoPanOnConnect;
  });

  // @ts-expect-error
  store.autoPanOnNodeDrag = autoPanOnNodeDrag;
  $effect.pre(() => {
    //@ts-expect-error
    store.autoPanOnNodeDrag = autoPanOnNodeDrag;
  });

  // @ts-expect-error
  store.onerror = onerror;
  $effect.pre(() => {
    //@ts-expect-error
    store.onerror = onerror;
  });

  // @ts-expect-error
  store.connectionMode = connectionMode;
  $effect.pre(() => {
    //@ts-expect-error
    store.connectionMode = connectionMode;
  });

  // @ts-expect-error
  store.nodeDragThreshold = nodeDragThreshold;
  $effect.pre(() => {
    //@ts-expect-error
    store.nodeDragThreshold = nodeDragThreshold;
  });

  store.onconnect = onconnect;
  $effect.pre(() => {
    store.onconnect = onconnect;
  });

  store.onconnectstart = onconnectstart;
  $effect.pre(() => {
    store.onconnectstart = onconnectstart;
  });

  store.onconnectend = onconnectend;
  $effect.pre(() => {
    store.onconnectend = onconnectend;
  });

  store.onbeforedelete = onbeforedelete;
  $effect.pre(() => {
    store.onbeforedelete = onbeforedelete;
  });

  store.ondelete = ondelete;
  $effect.pre(() => {
    store.ondelete = ondelete;
  });

  store.onedgecreate = onedgecreate;
  $effect.pre(() => {
    store.onedgecreate = onedgecreate;
  });
</script>
