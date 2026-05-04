<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { type SvelteFlowRestProps } from '$lib/store/types';
  import { toPxString } from '$lib/utils';
  import type { Node, Edge } from '$lib/types';

  let {
    width,
    height,
    colorMode,
    domNode = $bindable(),
    clientWidth = $bindable(),
    clientHeight = $bindable(),
    children,
    rest
  }: {
    width?: number;
    height?: number;
    colorMode?: string;
    domNode: HTMLDivElement | null;
    clientWidth?: number;
    clientHeight?: number;
    children?: Snippet;
    rest: SvelteFlowRestProps<NodeType, EdgeType> &
      Omit<HTMLAttributes<HTMLDivElement>, 'onselectionchange'>;
  } = $props();

  // Unfortunately we have to destructure the props here this way,
  // so we don't pass all the props as attributes to the div element
  /* eslint-disable @typescript-eslint/no-unused-vars */
  let {
    id,
    class: className,
    nodeTypes,
    edgeTypes,
    colorMode: _colorMode,
    isValidConnection,
    onmove,
    onmovestart,
    onmoveend,
    onflowerror,
    ondelete,
    onbeforedelete,
    onbeforeconnect,
    onconnect,
    onconnectstart,
    onconnectend,
    onbeforereconnect,
    onreconnect,
    onreconnectstart,
    onreconnectend,
    onclickconnectstart,
    onclickconnectend,
    oninit,
    onselectionchange,
    onselectiondragstart,
    onselectiondrag,
    onselectiondragstop,
    onselectionstart,
    onselectionend,
    clickConnect,
    fitView,
    fitViewOptions,
    nodeOrigin,
    nodeDragThreshold,
    connectionDragThreshold,
    minZoom,
    maxZoom,
    initialViewport,
    connectionRadius,
    connectionMode,
    selectionMode,
    selectNodesOnDrag,
    snapGrid,
    defaultMarkerColor,
    translateExtent,
    nodeExtent,
    onlyRenderVisibleElements,
    autoPanOnConnect,
    autoPanOnNodeDrag,
    colorModeSSR,
    defaultEdgeOptions,
    elevateNodesOnSelect,
    elevateEdgesOnSelect,
    nodesDraggable,
    autoPanOnNodeFocus,
    nodesConnectable,
    elementsSelectable,
    nodesFocusable,
    edgesFocusable,
    disableKeyboardA11y,
    noDragClass,
    noPanClass,
    noWheelClass,
    ariaLabelConfig,
    autoPanSpeed,
    panOnScrollSpeed,
    zIndexMode,
    ...divAttributes
  } = $derived(rest);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  type OnlyDivAttributes<T> = {
    [K in keyof T]: K extends keyof HTMLAttributes<HTMLDivElement> ? T[K] : never;
  };

  // Undo scroll events, preventing viewport from shifting when nodes outside of it are focused
  function wrapperOnScroll(e: UIEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    e.currentTarget.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Forward the event to any existing onscroll handler if needed
    if (rest.onscroll) {
      rest.onscroll(e);
    }
  }
</script>

<div
  bind:this={domNode}
  bind:clientHeight
  bind:clientWidth
  style:width={toPxString(width)}
  style:height={toPxString(height)}
  class={['svelte-flow', 'svelte-flow__container', className, colorMode]}
  data-testid="svelte-flow__wrapper"
  role="application"
  onscroll={wrapperOnScroll}
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
