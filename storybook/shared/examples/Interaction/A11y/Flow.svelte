<script lang="ts">
  import { Background, Controls, MiniMap, SvelteFlow, type AriaLabelConfig } from '@xyflow/svelte';

  import { defaultA11yArgs, initialEdges, initialNodes, type SharedA11yArgs } from './config';

  let {
    autoPanOnNodeFocus = defaultA11yArgs.autoPanOnNodeFocus,
    ariaNodeDefault = defaultA11yArgs.ariaNodeDefault,
    ariaNodeKeyboardDisabled = defaultA11yArgs.ariaNodeKeyboardDisabled,
    ariaNodeLiveMessagePrefix = defaultA11yArgs.ariaNodeLiveMessagePrefix,
    ariaEdgeDefault = defaultA11yArgs.ariaEdgeDefault,
    ariaControlsLabel = defaultA11yArgs.ariaControlsLabel,
    ariaControlsZoomIn = defaultA11yArgs.ariaControlsZoomIn,
    ariaControlsZoomOut = defaultA11yArgs.ariaControlsZoomOut,
    ariaControlsFitView = defaultA11yArgs.ariaControlsFitView,
    ariaControlsInteractive = defaultA11yArgs.ariaControlsInteractive,
    ariaMinimap = defaultA11yArgs.ariaMinimap,
  }: SharedA11yArgs = $props();

  let nodes = $state.raw([...initialNodes]);
  let edges = $state.raw([...initialEdges]);

  const ariaLabelConfig = $derived<Partial<AriaLabelConfig>>({
    'node.a11yDescription.default': ariaNodeDefault,
    'node.a11yDescription.keyboardDisabled': ariaNodeKeyboardDisabled,
    'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
      `${ariaNodeLiveMessagePrefix} ${direction}. New position, x: ${x}, y: ${y}`,
    'edge.a11yDescription.default': ariaEdgeDefault,
    'controls.ariaLabel': ariaControlsLabel,
    'controls.zoomIn.ariaLabel': ariaControlsZoomIn,
    'controls.zoomOut.ariaLabel': ariaControlsZoomOut,
    'controls.fitView.ariaLabel': ariaControlsFitView,
    'controls.interactive.ariaLabel': ariaControlsInteractive,
    'minimap.ariaLabel': ariaMinimap,
  });
</script>

<div class="flow">
  <SvelteFlow
    bind:nodes
    bind:edges
    {autoPanOnNodeFocus}
    {ariaLabelConfig}
    selectNodesOnDrag={false}
    elevateEdgesOnSelect
    elevateNodesOnSelect={false}
    nodeDragThreshold={0}
  >
    <Controls />
    <Background />
    <MiniMap />
  </SvelteFlow>
</div>

<style>
  .flow {
    width: 100%;
    height: 100%;
  }

  .flow :global(.svelte-flow) {
    width: 100%;
    height: 100%;
  }
</style>
