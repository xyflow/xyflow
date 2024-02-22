<script lang="ts">
  import { onMount } from 'svelte';
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { CallOnMount } from '$lib/components/CallOnMount';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import { useStore } from '$lib/store';
  import type { DefaultEdgeOptions } from '$lib/types';

  export let defaultEdgeOptions: DefaultEdgeOptions | undefined;

  const {
    visibleEdges,
    edgesInitialized,
    edges: { setDefaultOptions }
  } = useStore();

  onMount(() => {
    if (defaultEdgeOptions) setDefaultOptions(defaultEdgeOptions);
  });
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each $visibleEdges as edge (edge.id)}
    <EdgeWrapper
      id={edge.id}
      source={edge.source}
      target={edge.target}
      data={edge.data}
      style={edge.style}
      animated={edge.animated}
      selected={edge.selected}
      selectable={edge.selectable}
      hidden={edge.hidden}
      label={edge.label}
      labelStyle={edge.labelStyle}
      markerStart={edge.markerStart}
      markerEnd={edge.markerEnd}
      sourceHandle={edge.sourceHandle}
      targetHandle={edge.targetHandle}
      sourceX={edge.sourceX}
      sourceY={edge.sourceY}
      targetX={edge.targetX}
      targetY={edge.targetY}
      sourcePosition={edge.sourcePosition}
      targetPosition={edge.targetPosition}
      ariaLabel={edge.ariaLabel}
      interactionWidth={edge.interactionWidth}
      class={edge.class}
      type={edge.type || 'default'}
      zIndex={edge.zIndex}
      on:edgeclick
      on:edgecontextmenu
    />
  {/each}

  {#if $visibleEdges.length > 0}
    <CallOnMount
      onMount={() => {
        $edgesInitialized = true;
      }}
      onDestroy={() => {
        $edgesInitialized = false;
      }}
    />
  {/if}
</div>
