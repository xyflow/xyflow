<script lang="ts">
  import { setContext, onMount } from 'svelte'
  import cc from 'classcat';

	import { key, createStore } from '$lib/store';
  import Zoom from '$lib/container/Zoom/index.svelte';
  import Pane from '$lib/container/Pane/index.svelte';
  import Viewport from '$lib/container/Viewport.svelte';
  import NodeRenderer from '$lib/container/NodeRenderer/index.svelte';
  import EdgeRenderer from '$lib/container/EdgeRenderer/index.svelte';
  import UserSelection from '$lib/components/UserSelection/index.svelte';
  import NodeSelection from '$lib/components/NodeSelection/index.svelte';
  import { KeyHandler } from '$lib/components/KeyHandler';
	import type { SvelteFlowProps } from '$lib/types';

  type $$Props = SvelteFlowProps;

  export let id: $$Props['id'] = '1';
  export let nodes: $$Props['nodes'] = [];
  export let edges: $$Props['edges'] = [];
  export let fitView: $$Props['fitView'] = undefined;
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let deleteKey: $$Props['deleteKey'] = undefined;
  
  let className: $$Props['class'] = undefined;
  export { className as class };

  let domNode: Element;

  const store = createStore({
    fitView,
    nodeTypes
  });

  setContext(key, {
    getStore: () => store
  });

  onMount(() => {
    const { width, height } = domNode.getBoundingClientRect();
    store.widthStore.set(width);
    store.heightStore.set(height);

    // @todo: is this a svelte way for two way binding?
    store.nodesStore.subscribe((ns) => {
      nodes = ns;
    });
  });

  $: {
    store.setNodes(nodes);
  }

  $: {
    store.setEdges(edges);
  }
</script>

<div
  {...$$restProps}
  class={cc(['react-flow', className])}
  data-testid="rf__wrapper"
  id={id}
  bind:this={domNode}
>
  <KeyHandler {selectionKey} {deleteKey} />
  <Zoom>
    <Pane>
      <Viewport>
        <NodeSelection />
        <NodeRenderer />
        <EdgeRenderer />
      </Viewport>
      <UserSelection />
    </Pane>
  </Zoom>
  <slot />
</div>

<style>
  .react-flow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

  .react-flow :global(.react-flow__node-default),
  .react-flow :global(.react-flow__node-input),
  .react-flow :global(.react-flow__node-output) {
    padding: 10px;
  }
</style>