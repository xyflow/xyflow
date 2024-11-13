<script lang="ts">
  import { onMount, hasContext } from 'svelte';
  import { get } from 'svelte/store';
  import cc from 'classcat';
  import { ConnectionMode, PanOnScrollMode } from '@xyflow/system';

  import { Zoom } from '$lib/container/Zoom';
  import { Pane } from '$lib/container/Pane';
  import { Viewport as ViewportComponent } from '$lib/container/Viewport';
  import { NodeRenderer } from '$lib/container/NodeRenderer';
  import { EdgeRenderer } from '$lib/container/EdgeRenderer';
  import { UserSelection } from '$lib/components/UserSelection';
  import { NodeSelection } from '$lib/components/NodeSelection';
  import { KeyHandler } from '$lib/components/KeyHandler';
  import { ConnectionLine } from '$lib/components/ConnectionLine';
  import { Attribution } from '$lib/components/Attribution';
  import { key, useStore, createStoreContext } from '$lib/store';
  import type { SvelteFlowProps } from './types';
  import { updateStore, updateStoreByKeys, type UpdatableStoreProps } from './utils';
  import { useColorModeClass } from '$lib/hooks/useColorModeClass';

  let {
    id = '1',
    nodes,
    edges,
    fitView,
    fitViewOptions,
    minZoom,
    maxZoom,
    initialViewport,
    viewport,
    nodeTypes,
    edgeTypes,
    selectionKey,
    selectionMode,
    panActivationKey,
    multiSelectionKey,
    zoomActivationKey,
    nodesDraggable,
    nodesConnectable,
    nodeDragThreshold,
    elementsSelectable,
    snapGrid,
    deleteKey,
    connectionRadius,
    connectionLineType,
    connectionMode = ConnectionMode.Strict,
    connectionLineStyle = '',
    connectionLineContainerStyle = '',
    onMoveStart,
    onMove,
    onMoveEnd,
    isValidConnection,
    translateExtent,
    nodeExtent,
    onlyRenderVisibleElements,
    panOnScrollMode = PanOnScrollMode.Free,
    preventScrolling = true,
    zoomOnScroll = true,
    zoomOnDoubleClick = true,
    zoomOnPinch = true,
    panOnScroll = false,
    panOnDrag = true,
    selectionOnDrag,
    autoPanOnConnect = true,
    autoPanOnNodeDrag = true,
    onerror,
    ondelete,
    onedgecreate,
    attributionPosition,
    proOptions,
    defaultEdgeOptions,
    width,
    height,
    colorMode = 'light',
    onconnect,
    onconnectstart,
    onconnectend,
    onbeforedelete,
    oninit,
    nodeOrigin,
    paneClickDistance = 1,
    nodeClickDistance = 1,
    defaultMarkerColor = '#b1b1b7',
    style,
    class: className,
    connectionLine,
    children,
    onnodeclick,
    onnodecontextmenu,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onselectionclick,
    onselectioncontextmenu,
    onedgeclick,
    onedgecontextmenu,
    onedgemouseenter,
    onedgemouseleave,
    onpaneclick,
    onpanecontextmenu,
    ...rest
  }: SvelteFlowProps = $props();

  let domNode = $state<HTMLDivElement>();
  let clientWidth = $state<number>();
  let clientHeight = $state<number>();

  const initViewport = $viewport || initialViewport;

  //TODO SVELTE5

  const store = hasContext(key)
    ? useStore()
    : createStoreContext({
        nodes: get(nodes),
        edges: get(edges),
        width,
        height,
        fitView,
        nodeOrigin,
        nodeExtent
      });

  onMount(() => {
    store.width.set(clientWidth!);
    store.height.set(clientHeight!);
    store.domNode.set(domNode!);

    store.syncNodeStores(nodes);
    store.syncEdgeStores(edges);
    store.syncViewport(viewport);

    if (fitView !== undefined) {
      store.fitViewOnInit.set(fitView);
    }

    if (fitViewOptions) {
      store.fitViewOptions.set(fitViewOptions);
    }

    updateStore(store, {
      nodeTypes,
      edgeTypes,
      minZoom,
      maxZoom,
      translateExtent,
      paneClickDistance
    });

    return () => {
      store.reset();
    };
  });

  // Update width & height on resize
  $effect.pre(() => {
    if (clientWidth !== undefined && clientHeight !== undefined) {
      store.width.set(clientWidth);
      store.height.set(clientHeight);
    }
  });

  // Call oninit once when flow is intialized
  const { initialized } = store;
  let onInitCalled = $state(false);
  $effect.pre(() => {
    if (!onInitCalled && $initialized) {
      oninit?.();
      onInitCalled = true;
    }
  });

  // this updates the store for simple changes
  // where the prop names equals the store name
  $effect(() => {
    const updatableProps: UpdatableStoreProps = {
      flowId: id,
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
      onbeforedelete,
      nodeOrigin
    };

    updateStoreByKeys(store, updatableProps);
  });

  $effect(() => {
    updateStore(store, {
      nodeTypes,
      edgeTypes,
      minZoom,
      maxZoom,
      translateExtent,
      paneClickDistance
    });
  });

  let colorModeClass = $derived(useColorModeClass(colorMode));
</script>

<div
  bind:this={domNode}
  bind:clientWidth
  bind:clientHeight
  {style}
  class={cc(['svelte-flow', className, $colorModeClass])}
  data-testid="svelte-flow__wrapper"
  {...rest}
  role="application"
>
  <KeyHandler
    {selectionKey}
    {deleteKey}
    {panActivationKey}
    {multiSelectionKey}
    {zoomActivationKey}
  />
  <Zoom
    initialViewport={initViewport}
    {onMoveStart}
    {onMove}
    {onMoveEnd}
    {panOnScrollMode}
    {preventScrolling}
    {zoomOnScroll}
    {zoomOnDoubleClick}
    {zoomOnPinch}
    {panOnScroll}
    {panOnDrag}
    {paneClickDistance}
  >
    <Pane {nodes} {edges} {onpaneclick} {onpanecontextmenu} {panOnDrag} {selectionOnDrag}>
      <ViewportComponent>
        <EdgeRenderer
          {onedgeclick}
          {onedgecontextmenu}
          {onedgemouseenter}
          {onedgemouseleave}
          {defaultEdgeOptions}
        />
        <ConnectionLine
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
          {connectionLine}
        />
        <div class="svelte-flow__edgelabel-renderer"></div>
        <div class="svelte-flow__viewport-portal"></div>
        <NodeRenderer
          {nodeClickDistance}
          {onnodeclick}
          {onnodecontextmenu}
          {onnodemouseenter}
          {onnodemousemove}
          {onnodemouseleave}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
        <NodeSelection
          {onselectionclick}
          {onselectioncontextmenu}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
      </ViewportComponent>
      <UserSelection />
    </Pane>
  </Zoom>
  <Attribution {proOptions} position={attributionPosition} />
  {@render children?.()}
</div>

<style>
  .svelte-flow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 0;

    background-color: var(--background-color, var(--background-color-default));
  }

  :root {
    --background-color-default: #fff;
    --background-pattern-color-default: #ddd;

    --minimap-mask-color-default: rgb(240, 240, 240, 0.6);
    --minimap-mask-stroke-color-default: none;
    --minimap-mask-stroke-width-default: 1;

    --controls-button-background-color-default: #fefefe;
    --controls-button-background-color-hover-default: #f4f4f4;
    --controls-button-color-default: inherit;
    --controls-button-color-hover-default: inherit;
    --controls-button-border-color-default: #eee;
  }
</style>
