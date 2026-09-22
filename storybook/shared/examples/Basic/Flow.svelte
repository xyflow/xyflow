<script lang="ts">
  import { SvelteFlow, Background, SelectionMode, Controls, MiniMap, type Node, type Edge } from '@xyflow/svelte';
  import { defaultFlowProps } from '../../defaultFlow';
  import { figmaFlowProps, type BasicArgs } from './config';
  import InteractionPanel from '../../InteractionPanel/InteractionPanel.svelte';
  let { isHidden = false, figma = false }: BasicArgs = $props();
  let nodes = $state.raw<Node[]>(structuredClone(defaultFlowProps.nodes));
  let edges = $state.raw<Edge[]>(structuredClone(defaultFlowProps.edges));
</script>

<div style:display={isHidden ? 'none' : 'block'} style="height: 100vh; width: 100%;">
  <SvelteFlow
    {...defaultFlowProps}
    {...figma ? figmaFlowProps : {}}
    selectionMode={figma ? SelectionMode.Partial : SelectionMode.Full}
    multiSelectionKey={figma ? ['Meta', 'Shift'] : undefined}
    onpanecontextmenu={figma ? (event) => event.preventDefault() : undefined}
    bind:nodes
    bind:edges
  >
    <Background /><Controls /><MiniMap /><InteractionPanel />
  </SvelteFlow>
</div>
