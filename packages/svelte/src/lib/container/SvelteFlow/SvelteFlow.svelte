<script lang="ts">
  import { getContext, setContext, onDestroy } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ConnectionLineType, PanOnScrollMode } from '@xyflow/system';

  import { key, createStore } from '$lib/store';
  import { Zoom } from '$lib/container/Zoom';
  import { Pane } from '$lib/container/Pane';
  import { Viewport as ViewportComponent } from '$lib/container/Viewport';
  import { NodeRenderer } from '$lib/container/NodeRenderer';
  import { EdgeRenderer } from '$lib/container/EdgeRenderer';
  import { NodeSelection } from '$lib/components/NodeSelection';
  import { Selection } from '$lib/components/Selection';
  import { KeyHandler } from '$lib/components/KeyHandler';
  import { ConnectionLine } from '$lib/components/ConnectionLine';
  import { Attribution } from '$lib/components/Attribution';
  import type { SvelteFlowProps } from './types';
  import { type ProviderContext, type StoreContext } from '$lib/store/types';
  import Wrapper from './Wrapper.svelte';

  let {
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
    onmovestart,
    onmoveend,
    onmove,
    oninit,
    onnodeclick,
    onnodecontextmenu,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodepointerenter,
    onnodepointermove,
    onnodepointerleave,
    onselectionclick,
    onselectioncontextmenu,
    onedgeclick,
    onedgecontextmenu,
    onedgepointerenter,
    onedgepointerleave,
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
    connectionLineComponent,
    connectionLineStyle,
    connectionLineContainerStyle,
    connectionLineType = ConnectionLineType.Bezier,
    attributionPosition,
    children,
    nodes = $bindable([]),
    edges = $bindable([]),
    viewport = $bindable(undefined),
    ...props
  }: SvelteFlowProps & HTMLAttributes<HTMLDivElement> = $props();

  // svelte-ignore non_reactive_update
  let store = createStore({
    props,
    width,
    height,
    get nodes() {
      return nodes;
    },
    set nodes(newNodes) {
      nodes = newNodes;
    },
    get edges() {
      return edges;
    },
    set edges(newEdges) {
      edges = newEdges;
    },
    get viewport() {
      return viewport;
    },
    set viewport(newViewport) {
      viewport = newViewport;
    }
  });

  // Set store for provider context
  const providerContext = getContext<ProviderContext>(key);
  if (providerContext && providerContext.setStore) {
    providerContext.setStore(store);
  }

  // Overwrite store context to give children direct access
  setContext(key, {
    provider: false,
    getStore() {
      return store;
    }
  } satisfies StoreContext);

  onDestroy(() => {
    store.reset();
  });
</script>

<Wrapper
  bind:domNode={store.domNode}
  bind:clientWidth={store.width}
  bind:clientHeight={store.height}
  colorMode={store.colorMode}
  {width}
  {height}
  rest={props}
>
  <KeyHandler
    bind:store
    {selectionKey}
    {deleteKey}
    {panActivationKey}
    {multiSelectionKey}
    {zoomActivationKey}
  />
  <Zoom
    bind:store
    {panOnScrollMode}
    {preventScrolling}
    {zoomOnScroll}
    {zoomOnDoubleClick}
    {zoomOnPinch}
    {panOnScroll}
    {panOnDrag}
    {paneClickDistance}
    {onmovestart}
    {onmove}
    {onmoveend}
    {oninit}
  >
    <Pane bind:store {onpaneclick} {onpanecontextmenu} {panOnDrag} {selectionOnDrag}>
      <ViewportComponent bind:store>
        <EdgeRenderer
          bind:store
          {onedgeclick}
          {onedgecontextmenu}
          {onedgepointerenter}
          {onedgepointerleave}
        />
        <ConnectionLine
          bind:store
          type={connectionLineType}
          LineComponent={connectionLineComponent}
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
        />
        <div class="svelte-flow__edgelabel-renderer"></div>
        <div class="svelte-flow__viewport-portal"></div>
        <NodeRenderer
          bind:store
          {nodeClickDistance}
          {onnodeclick}
          {onnodecontextmenu}
          {onnodepointerenter}
          {onnodepointermove}
          {onnodepointerleave}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
        <NodeSelection
          bind:store
          {onselectionclick}
          {onselectioncontextmenu}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
      </ViewportComponent>
      <Selection
        isVisible={!!(store.selectionRect && store.selectionRectMode === 'user')}
        width={store.selectionRect?.width}
        height={store.selectionRect?.height}
        x={store.selectionRect?.x}
        y={store.selectionRect?.y}
      />
    </Pane>
  </Zoom>
  <Attribution {proOptions} position={attributionPosition} />
  {@render children?.()}
</Wrapper>
