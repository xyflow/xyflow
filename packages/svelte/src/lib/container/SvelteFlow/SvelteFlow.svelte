<script lang="ts">
  import { onMount, hasContext } from 'svelte';
  import { get } from 'svelte/store';
  import cc from 'classcat';
  import { ConnectionMode, PanOnScrollMode, type Viewport } from '@xyflow/system';

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

  type $$Props = SvelteFlowProps;

  export let id: $$Props['id'] = '1';
  export let nodes: $$Props['nodes'];
  export let edges: $$Props['edges'];
  export let fitView: $$Props['fitView'] = undefined;
  export let fitViewOptions: $$Props['fitViewOptions'] = undefined;
  export let minZoom: $$Props['minZoom'] = undefined;
  export let maxZoom: $$Props['maxZoom'] = undefined;
  export let initialViewport: Viewport = { x: 0, y: 0, zoom: 1 };
  export let viewport: $$Props['viewport'] = undefined;
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let edgeTypes: $$Props['edgeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let selectionMode: $$Props['selectionMode'] = undefined;
  export let panActivationKey: $$Props['panActivationKey'] = undefined;
  export let multiSelectionKey: $$Props['multiSelectionKey'] = undefined;
  export let zoomActivationKey: $$Props['zoomActivationKey'] = undefined;
  export let nodesDraggable: $$Props['nodesDraggable'] = undefined;
  export let nodesConnectable: $$Props['nodesConnectable'] = undefined;
  export let nodeDragThreshold: $$Props['nodeDragThreshold'] = undefined;
  export let elementsSelectable: $$Props['elementsSelectable'] = undefined;
  export let snapGrid: $$Props['snapGrid'] = undefined;
  export let deleteKey: $$Props['deleteKey'] = undefined;
  export let connectionRadius: $$Props['connectionRadius'] = undefined;
  export let connectionLineType: $$Props['connectionLineType'] = undefined;
  export let connectionMode: $$Props['connectionMode'] = ConnectionMode.Strict;
  export let connectionLineStyle: $$Props['connectionLineStyle'] = '';
  export let connectionLineContainerStyle: $$Props['connectionLineContainerStyle'] = '';
  export let onMoveStart: $$Props['onMoveStart'] = undefined;
  export let onMove: $$Props['onMove'] = undefined;
  export let onMoveEnd: $$Props['onMoveEnd'] = undefined;
  export let isValidConnection: $$Props['isValidConnection'] = undefined;
  export let translateExtent: $$Props['translateExtent'] = undefined;
  export let onlyRenderVisibleElements: $$Props['onlyRenderVisibleElements'] = undefined;
  export let panOnScrollMode: $$Props['panOnScrollMode'] = PanOnScrollMode.Free;
  export let preventScrolling: $$Props['preventScrolling'] = true;
  export let zoomOnScroll: $$Props['zoomOnScroll'] = true;
  export let zoomOnDoubleClick: $$Props['zoomOnDoubleClick'] = true;
  export let zoomOnPinch: $$Props['zoomOnPinch'] = true;
  export let panOnScroll: $$Props['panOnScroll'] = false;
  export let panOnDrag: $$Props['panOnDrag'] = true;
  export let selectionOnDrag: $$Props['selectionOnDrag'] = undefined;
  export let autoPanOnConnect: $$Props['autoPanOnConnect'] = true;
  export let autoPanOnNodeDrag: $$Props['autoPanOnNodeDrag'] = true;
  export let onerror: $$Props['onerror'] = undefined;
  export let ondelete: $$Props['ondelete'] = undefined;
  export let onedgecreate: $$Props['onedgecreate'] = undefined;
  export let attributionPosition: $$Props['attributionPosition'] = undefined;
  export let proOptions: $$Props['proOptions'] = undefined;
  export let defaultEdgeOptions: $$Props['defaultEdgeOptions'] = undefined;
  export let width: $$Props['width'] = undefined;
  export let height: $$Props['height'] = undefined;
  export let colorMode: $$Props['colorMode'] = 'light';
  export let onconnect: $$Props['onconnect'] = undefined;
  export let onconnectstart: $$Props['onconnectstart'] = undefined;
  export let onconnectend: $$Props['onconnectend'] = undefined;
  export let onbeforedelete: $$Props['onbeforedelete'] = undefined;
  export let oninit: $$Props['oninit'] = undefined;

  export let defaultMarkerColor = '#b1b1b7';

  export let style: $$Props['style'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };

  let domNode: HTMLDivElement;
  let clientWidth: number;
  let clientHeight: number;

  const store = hasContext(key)
    ? useStore()
    : createStoreContext({ nodes: get(nodes), edges: get(edges), width, height, fitView });

  onMount(() => {
    store.width.set(clientWidth);
    store.height.set(clientHeight);
    store.domNode.set(domNode);

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
      translateExtent
    });

    return () => {
      store.reset();
    };
  });

  // Update width & height on resize
  $: {
    if (clientWidth !== undefined && clientHeight !== undefined) {
      store.width.set(clientWidth);
      store.height.set(clientHeight);
    }
  }

  // Call oninit once when flow is intialized
  const { initialized } = store;
  let onInitCalled = false;
  $: {
    if (!onInitCalled && $initialized) {
      oninit?.();
      onInitCalled = true;
    }
  }

  // this updates the store for simple changes
  // where the prop names equals the store name
  $: {
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
      onbeforedelete
    };

    updateStoreByKeys(store, updatableProps);
  }

  $: updateStore(store, {
    nodeTypes,
    edgeTypes,
    minZoom,
    maxZoom,
    translateExtent
  });

  $: colorModeClass = useColorModeClass(colorMode);
</script>

<div
  bind:this={domNode}
  bind:clientWidth
  bind:clientHeight
  {style}
  class={cc(['svelte-flow', className, $colorModeClass])}
  data-testid="svelte-flow__wrapper"
  on:dragover
  on:drop
  {...$$restProps}
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
    {initialViewport}
    {onMoveStart}
    {onMove}
    {onMoveEnd}
    panOnScrollMode={panOnScrollMode === undefined ? PanOnScrollMode.Free : panOnScrollMode}
    preventScrolling={preventScrolling === undefined ? true : preventScrolling}
    zoomOnScroll={zoomOnScroll === undefined ? true : zoomOnScroll}
    zoomOnDoubleClick={zoomOnDoubleClick === undefined ? true : zoomOnDoubleClick}
    zoomOnPinch={zoomOnPinch === undefined ? true : zoomOnPinch}
    panOnScroll={panOnScroll === undefined ? false : panOnScroll}
    panOnDrag={panOnDrag === undefined ? true : panOnDrag}
  >
    <Pane
      on:paneclick
      on:panecontextmenu
      panOnDrag={panOnDrag === undefined ? true : panOnDrag}
      {selectionOnDrag}
    >
      <ViewportComponent>
        <EdgeRenderer on:edgeclick on:edgecontextmenu {defaultEdgeOptions} />
        <ConnectionLine
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
          isCustomComponent={$$slots.connectionLine}
        >
          <slot name="connectionLine" slot="connectionLine" />
        </ConnectionLine>
        <div class="svelte-flow__edgelabel-renderer" />
        <div class="svelte-flow__viewport-portal" />
        <NodeRenderer
          on:nodeclick
          on:nodemouseenter
          on:nodemousemove
          on:nodemouseleave
          on:nodedragstart
          on:nodedrag
          on:nodedragstop
          on:nodecontextmenu
        />
        <NodeSelection
          on:selectionclick
          on:selectioncontextmenu
          on:nodedragstart
          on:nodedrag
          on:nodedragstop
        />
      </ViewportComponent>
      <UserSelection />
    </Pane>
  </Zoom>
  <Attribution {proOptions} position={attributionPosition} />
  <slot />
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
