<script lang="ts">
  import { get } from 'svelte/store';
  import { onMount, getContext, setContext } from 'svelte';
  import cc from 'classcat';
  import { PanOnScrollMode } from '@xyflow/system';

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
  import { key, createStore } from '$lib/store';
  import type { SvelteFlowProps } from './types';
  import { useColorModeClass } from '$lib/hooks/useColorModeClass';
  import { type ProviderContext, type ContainerSignals, type StoreContext } from '$lib/store/types';

  let {
    style,
    class: className,
    width,
    height,
    proOptions,
    selectionKey,
    deleteKey,
    panActivationKey,
    multiSelectionKey,
    zoomActivationKey,
    paneClickDistance = 1,
    nodeClickDistance = 1,
    onMoveStart,
    onMoveEnd,
    onMove,
    connectionLine,
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
    panOnScrollMode = PanOnScrollMode.Free,
    preventScrolling = true,
    zoomOnScroll = true,
    zoomOnDoubleClick = true,
    zoomOnPinch = true,
    panOnScroll = false,
    panOnDrag = true,
    selectionOnDrag = true,
    defaultEdgeOptions,
    connectionLineContainerStyle = '',
    connectionLineStyle = '',
    attributionPosition,
    children,
    ...props
  }: SvelteFlowProps = $props();

  // svelte-ignore perf_avoid_inline_class
  const container: ContainerSignals = new (class {
    domNode = $state<HTMLDivElement>();
    width = $state<number | undefined>(width);
    height = $state<number | undefined>(height);
  })();

  const store = createStore({
    props,
    container
  });
  const { viewport } = store;
  const initialViewport = props.initialViewport ?? get(viewport);

  store.syncNodeStores(props.nodes);
  store.syncEdgeStores(props.edges);
  store.syncViewport(props.viewport);

  const providerContext = getContext<ProviderContext>(key);
  if (providerContext) {
    providerContext.setStore(store);
  }
  setContext(key, {
    provider: false,
    getStore() {
      return store;
    }
  } satisfies StoreContext);

  onMount(() => {
    return () => {
      store.reset();
    };
  });

  let colorModeClass = $derived(useColorModeClass(store.colorMode));
</script>

<div
  bind:this={container.domNode}
  bind:clientWidth={container.width}
  bind:clientHeight={container.height}
  style:width
  style:height
  {style}
  class={cc(['svelte-flow', className, $colorModeClass])}
  data-testid="svelte-flow__wrapper"
  {...props}
  role="application"
>
  <KeyHandler
    {store}
    {selectionKey}
    {deleteKey}
    {panActivationKey}
    {multiSelectionKey}
    {zoomActivationKey}
  />
  <Zoom
    {store}
    {initialViewport}
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
    <Pane {store} {onpaneclick} {onpanecontextmenu} {panOnDrag} {selectionOnDrag}>
      <ViewportComponent viewport={$viewport}>
        <EdgeRenderer
          {store}
          {onedgeclick}
          {onedgecontextmenu}
          {onedgemouseenter}
          {onedgemouseleave}
        />
        <ConnectionLine
          {store}
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
          {connectionLine}
        />
        <div class="svelte-flow__edgelabel-renderer"></div>
        <div class="svelte-flow__viewport-portal"></div>
        <NodeRenderer
          {store}
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
          {store}
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
