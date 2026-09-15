<script lang="ts">
  import { SvelteFlow, Controls, type CoordinateExtent, type Edge } from '@xyflow/svelte';

  import DefaultResizer from './DefaultResizer.svelte';
  import CustomResizer from './CustomResizer.svelte';
  import VerticalResizer from './VerticalResizer.svelte';
  import HorizontalResizer from './HorizontalResizer.svelte';
  import BottomRightResizer from './BottomRightResizer.svelte';
  import FixedExtentNode from './FixedExtentNode.svelte';

  import '@xyflow/svelte/dist/style.css';
  import type { ResizeNode } from './types';
  import { setContext } from 'svelte';
  import { createResizeState, RESIZE_CONTEXT } from './resizeState.svelte';
  import { initialNodes, initialEdges } from './config';
  const store = createResizeState();
  setContext(RESIZE_CONTEXT, store);

  const nodeTypes = {
    defaultResizer: DefaultResizer,
    customResizer: CustomResizer,
    verticalResizer: VerticalResizer,
    horizontalResizer: HorizontalResizer,
    bottomRightResizer: BottomRightResizer,
    fixedExtent: FixedExtentNode,
  };

  let nodes = $state.raw<ResizeNode[]>(
    structuredClone(initialNodes).map((node) => ({
      ...node,
      style: 'border: 1px solid #222; font-size: 10px; background-color: #ddd;',
    })) as ResizeNode[]
  );
  let edges = $state.raw<Edge[]>(structuredClone(initialEdges));

  let { snapToGrid = false }: { snapToGrid?: boolean } = $props();
</script>

<svelte:window
  on:blur={() => {
    store.keepAspectRatio = false;
  }}
  on:keydown={(e) => {
    if (e.key === 'k') store.keepAspectRatio = true;
  }}
  on:keyup={(e) => {
    if (e.key === 'k') store.keepAspectRatio = false;
  }}
/>

<div style="height: 100vh;">
  <SvelteFlow
    bind:nodes
    bind:edges
    {nodeTypes}
    minZoom={0.2}
    maxZoom={5}
    snapGrid={snapToGrid ? [10, 10] : undefined}
    fitView
  >
    <Controls />
  </SvelteFlow>
</div>
