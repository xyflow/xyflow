<script lang="ts">
  import { setContext, onMount, SvelteComponent } from 'svelte'
  import cc from 'classcat';
  import type { Node, Edge } from '@reactflow/system';

	import { key, createStore } from '$lib/store';
  import Zoom from '$lib/container/Zoom/index.svelte';
  import Pane from '$lib/container/Pane/index.svelte';
  import Viewport from '$lib/container/Viewport.svelte';
  import NodeRenderer from '$lib/container/NodeRenderer.svelte';
  import EdgeRenderer from '$lib/container/EdgeRenderer/index.svelte';
  import UserSelection from '$lib/components/UserSelection/index.svelte';
  import NodeSelection from '$lib/components/NodeSelection/index.svelte';
  import KeyHandler from '$lib/components/KeyHandler/index.svelte';

  export let id: string = '1';
  export let nodes: Node[] = [];
  export let edges: Edge[] = [];
  export let fitView: boolean = false;
  export let nodeTypes: Record<string, SvelteComponent>

  let className: string = '';
  export { className as class };

  let domNode: Element;

  const store = createStore({
    nodes,
    edges,
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
  })
</script>

<div
  {...$$restProps}
  class={cc(['react-flow', className])}
  data-testid="rf__wrapper"
  id={id}
  bind:this={domNode}
>
  <KeyHandler />
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
</style>