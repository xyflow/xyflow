<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';
  import {
    ConnectionLineType,
    getBezierPath,
    getConnectionStatus,
    getSmoothStepPath,
    getStraightPath
  } from '@xyflow/system';

  export let containerStyle: string | undefined = undefined;
  export let style: string | undefined = undefined;
  export let isCustomComponent: boolean = false;

  const { width, height, connection, connectionLineType } = useStore();

  let path: string | null = null;

  $: if ($connection.inProgress && !isCustomComponent) {
    const { from, to, fromPosition, toPosition } = $connection;
    const pathParams = {
      sourceX: from.x,
      sourceY: from.y,
      sourcePosition: fromPosition,
      targetX: to.x,
      targetY: to.y,
      targetPosition: toPosition
    };

    switch ($connectionLineType) {
      case ConnectionLineType.Bezier:
        [path] = getBezierPath(pathParams);
        break;
      case ConnectionLineType.Step:
        [path] = getSmoothStepPath({
          ...pathParams,
          borderRadius: 0
        });
        break;
      case ConnectionLineType.SmoothStep:
        [path] = getSmoothStepPath(pathParams);
        break;
      default:
        [path] = getStraightPath(pathParams);
    }
  }
</script>

{#if $connection.inProgress}
  <svg width={$width} height={$height} class="svelte-flow__connectionline" style={containerStyle}>
    <g class={cc(['svelte-flow__connection', getConnectionStatus($connection.isValid)])}>
      <slot name="connectionLine" />
      <!-- slot fallbacks do not work if slots are forwarded in parent -->
      {#if !isCustomComponent}
        <path d={path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}
