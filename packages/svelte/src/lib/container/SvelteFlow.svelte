<script lang="ts">
  import { setContext, onMount } from 'svelte'
  import cc from 'classcat';
  import type { Node, Edge } from '@reactflow/core';

	import { key, createStore } from '$lib/store';
  import Viewport from '$lib/container/Viewport.svelte';
  import NodeRenderer from '$lib/container/NodeRenderer.svelte';
  import EdgeRenderer from '$lib/container/EdgeRenderer/index.svelte';

  export let nodes: Node[];
  export let edges: Edge[];

  export let className: string | null = null;
  export let id: string = '1';

  let props = { ...$$restProps };
  let domNode: Element;

  const store = createStore({
    nodes,
    edges,
  });

  setContext(key, {
    getStore: () => store
  });

  onMount(() => {
    const { width, height } = domNode.getBoundingClientRect();
    store.widthStore.set(width);
    store.heightStore.set(height);
  })
</script>


<div
  {...props}
  class={cc(['react-flow', className])}
  data-testid="rf__wrapper"
  id={id}
  bind:this={domNode}
>
  <Viewport>
    <NodeRenderer />
    <EdgeRenderer />
  </Viewport>
</div>

<style>
  .react-flow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

</style>