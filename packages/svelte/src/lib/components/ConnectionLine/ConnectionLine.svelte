<script lang="ts">
  import cc from 'classcat';
  import type { Snippet } from 'svelte';
  import {
    ConnectionLineType,
    getBezierPath,
    getConnectionStatus,
    getSmoothStepPath,
    getStraightPath
  } from '@xyflow/system';

  import { useStore } from '$lib/store';

  let {
    containerStyle = '',
    style = '',
    connectionLine
  }: {
    containerStyle: string;
    style: string;
    connectionLine?: Snippet;
  } = $props();

  const { width, height, connection, connectionLineType } = useStore();

  let path = $derived.by(() => {
    if (!$connection.inProgress) {
      return '';
    }

    const pathParams = {
      sourceX: $connection.from.x,
      sourceY: $connection.from.y,
      sourcePosition: $connection.fromPosition,
      targetX: $connection.to.x,
      targetY: $connection.to.y,
      targetPosition: $connection.toPosition
    };

    switch ($connectionLineType) {
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
          borderRadius: $connectionLineType === ConnectionLineType.Step ? 0 : undefined
        });
        return path;
      }
    }
  });
</script>

{#if $connection.inProgress}
  <svg width={$width} height={$height} class="svelte-flow__connectionline" style={containerStyle}>
    <g class={cc(['svelte-flow__connection', getConnectionStatus($connection.isValid)])}>
      {#if connectionLine}
        {@render connectionLine()}
      {:else}
        <path d={path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}
