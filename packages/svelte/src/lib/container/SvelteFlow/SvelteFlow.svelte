<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { ConnectionLineType } from '@reactflow/system';
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
  import type { SvelteFlowProps } from './types';

  type $$Props = SvelteFlowProps;

  export let id: $$Props['id'] = '1';
  export let nodes: $$Props['nodes'] = [];
  export let edges: $$Props['edges'] = [];
  export let fitView: $$Props['fitView'] = undefined;
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let deleteKey: $$Props['deleteKey'] = undefined;
  export let connectionLineType: $$Props['connectionLineType'] = ConnectionLineType.Bezier;

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
  {id}
  bind:this={domNode}
>
  <KeyHandler {selectionKey} {deleteKey} />
  <Zoom>
    <Pane>
      <Viewport>
        <EdgeRenderer />
        <ConnectionLine />
        <div class="react-flow__edgelabel-renderer" />
        <NodeRenderer />
        <NodeSelection />
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

  .react-flow__edgelabel-renderer {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }
</style>
