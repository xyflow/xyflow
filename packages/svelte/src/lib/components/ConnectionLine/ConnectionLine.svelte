<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { Component } from 'svelte';
  import {
    ConnectionLineType,
    getBezierPath,
    getConnectionStatus,
    getSmoothStepPath,
    getStraightPath
  } from '@xyflow/system';

  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Node, Edge } from '$lib/types';

  let {
    store = $bindable(),
    type,
    containerStyle,
    style,
    LineComponent
  }: {
    store: SvelteFlowStore<NodeType, EdgeType>;
    type: ConnectionLineType;
    containerStyle?: string;
    style?: string;
    LineComponent?: Component;
  } = $props();

  let path = $derived.by(() => {
    if (!store.connection.inProgress) {
      return '';
    }

    const pathParams = {
      sourceX: store.connection.from.x,
      sourceY: store.connection.from.y,
      sourcePosition: store.connection.fromPosition,
      targetX: store.connection.to.x,
      targetY: store.connection.to.y,
      targetPosition: store.connection.toPosition
    };

    switch (type) {
      case ConnectionLineType.Bezier: {
        const [path] = getBezierPath(pathParams);
        return path;
      }
      case ConnectionLineType.Straight: {
        const [path] = getStraightPath(pathParams);
        return path;
      }
      case ConnectionLineType.Step:
      case ConnectionLineType.SmoothStep: {
        const [path] = getSmoothStepPath({
          ...pathParams,
          borderRadius: type === ConnectionLineType.Step ? 0 : undefined
        });
        return path;
      }
    }
  });
</script>

{#if store.connection.inProgress}
  <svg
    width={store.width}
    height={store.height}
    class="svelte-flow__connectionline"
    style={containerStyle}
  >
    <g class={['svelte-flow__connection', getConnectionStatus(store.connection.isValid)]}>
      {#if LineComponent}
        <LineComponent></LineComponent>
      {:else}
        <path d={path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}
