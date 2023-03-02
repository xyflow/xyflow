<script lang="ts">
  import { setContext, onMount, createEventDispatcher } from 'svelte';
  import cc from 'classcat';

  import { key, createStore } from '$lib/store';
  import { Zoom } from '$lib/container/Zoom';
  import { Pane } from '$lib/container/Pane';
  import { Viewport } from '$lib/container/Viewport';
  import { NodeRenderer } from '$lib/container/NodeRenderer';
  import { EdgeRenderer } from '$lib/container/EdgeRenderer';
  import { UserSelection } from '$lib/components/UserSelection';
  import { NodeSelection } from '$lib/components/NodeSelection';
  import { KeyHandler } from '$lib/components/KeyHandler';
  import { ConnectionLine } from '$lib/components/ConnectionLine';
  import type { SvelteFlowProps, SvelteFlowEvents } from './types';

  type $$Props = SvelteFlowProps;
  type $$Events = SvelteFlowEvents;

  export let id: $$Props['id'] = '1';
  export let nodes: $$Props['nodes'] = [];
  export let edges: $$Props['edges'] = [];
  export let fitView: $$Props['fitView'] = undefined;
  export let minZoom: $$Props['minZoom'] = undefined;
  export let maxZoom: $$Props['maxZoom'] = undefined;
  export let initialViewport: $$Props['initialViewport'] = undefined;
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let edgeTypes: $$Props['edgeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let deleteKey: $$Props['deleteKey'] = undefined;
  export let defaultEdgeOptions: $$Props['defaultEdgeOptions'] = undefined;
  export let connectionRadius: $$Props['connectionRadius'] = undefined;
  export let connectionLineType: $$Props['connectionLineType'] = undefined
  export let style: $$Props['style'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };

  let domNode: HTMLDivElement;

  const store = createStore({
    fitView,
    nodeTypes
  });

  setContext(key, {
    getStore: () => store
  });

  onMount(() => {
    const { width, height } = domNode.getBoundingClientRect();
    store.width.set(width);
    store.height.set(height);
    store.domNode.set(domNode);

    // @todo: is this a svelte way for two way binding?
    store.nodes.subscribe((ns) => {
      nodes = ns;
    });

    store.edges.subscribe((es) => {
      edges = es;
    });
  });

  $: {
    const updatableProps = {
      id,
      connectionLineType,
      connectionRadius,
      defaultEdgeOptions
    };

    Object.keys(updatableProps).forEach(prop => {
      // @ts-ignore
      if (updatableProps[prop] !== undefined) {
        // @ts-ignore
        store[prop].set(updatableProps[prop]);
      }
    })
  }

  $: {
    store.setNodes(nodes);
  }

  $: {
    store.setEdges(edges);
  }

  $: {
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
  }
</script>

<div
  bind:this={domNode}
  style={style}
  class={cc(['svelte-flow', className])}
  data-testid="rf__wrapper"
>
  <KeyHandler {selectionKey} {deleteKey} />
  <Zoom {initialViewport}>
    <Pane on:pane:click>
      <Viewport>
        <EdgeRenderer on:edge:click />
        <ConnectionLine />
        <div class="svelte-flow__edgelabel-renderer" />
        <NodeRenderer
          on:node:click
          on:node:mouseenter
          on:node:mousemove
          on:node:mouseleave
          on:connect:start
          on:connect
          on:connect:end
        />
        <NodeSelection />
      </Viewport>
      <UserSelection />
    </Pane>
  </Zoom>
  <slot />
</div>

<style>
  .svelte-flow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

  .svelte-flow :global(.svelte-flow__node-default),
  .svelte-flow :global(.svelte-flow__node-input),
  .svelte-flow :global(.svelte-flow__node-output) {
    padding: 10px;
  }

  .svelte-flow__edgelabel-renderer {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }
</style>
