<script lang="ts">
  import type { ClassValue, DOMAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { type SvelteFlowRestProps } from '$lib/store/types';

  let {
    width,
    height,
    class: className,
    colorMode,
    domNode = $bindable(),
    clientWidth = $bindable(),
    clientHeight = $bindable(),
    children,
    rest
  }: {
    width?: number;
    height?: number;
    class?: ClassValue;
    colorMode?: string;
    domNode: HTMLDivElement | null;
    clientWidth?: number;
    clientHeight?: number;
    children?: Snippet;
    rest: SvelteFlowRestProps & DOMAttributes<HTMLDivElement>;
  } = $props();

  // Unfortunately we have to destructure the props here this way,
  // so we don't pass all the props as attributes to the div element
  let {
    id,
    nodeTypes,
    edgeTypes,
    colorMode: _colorMode,
    isValidConnection,
    onerror,
    ondelete,
    onbeforedelete,
    onedgecreate,
    onconnect,
    onconnectstart,
    onconnectend,
    oninit,
    fitView,
    fitViewOptions,
    nodeOrigin,
    nodeDragThreshold,
    minZoom,
    maxZoom,
    initialViewport,
    connectionRadius,
    connectionMode,
    selectionMode,
    selectNodesOnDrag,
    snapGrid,
    defaultMarkerColor,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
    translateExtent,
    nodeExtent,
    onlyRenderVisibleElements,
    autoPanOnConnect,
    autoPanOnNodeDrag,
    colorModeSSR,
    style,
    defaultEdgeOptions,
    ...divAttributes
  } = $derived(rest);

  type OnlyDivAttributes<T> = {
    [K in keyof T]: K extends keyof DOMAttributes<HTMLDivElement> ? T[K] : never;
  };
</script>

<div
  bind:this={domNode}
  bind:clientHeight
  bind:clientWidth
  style:width
  style:height
  class={['svelte-flow', 'svelte-flow-container', className, colorMode]}
  data-testid="svelte-flow__wrapper"
  role="application"
  {...divAttributes satisfies OnlyDivAttributes<typeof divAttributes>}
>
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
