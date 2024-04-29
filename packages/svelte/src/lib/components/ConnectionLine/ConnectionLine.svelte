<script lang="ts">
  import cc from 'classcat';
  import { useStore } from '$lib/store';
  import type { Snippet } from 'svelte';
  import {
    ConnectionLineType,
    getBezierPath,
    getSmoothStepPath,
    getStraightPath
  } from '@xyflow/system';
  import type { ConnectionProps } from '$lib/store/derived-connection';

  let {
    containerStyle = '',
    style = '',
    connectionLine
  }: {
    containerStyle: string;
    style: string;
    connectionLine?: Snippet;
  } = $props();

  const store = useStore();

  type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
  };

  let path = $derived.by(() => {
    if (store.connection.sourceX === null || connectionLine) {
      return '';
    }

    const pathParams = store.connection as NonNullableFields<ConnectionProps>;

    switch (store.connectionLineType) {
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
          borderRadius: store.connectionLineType === ConnectionLineType.Step ? 0 : undefined
        });
        return path;
      }
    }
  });
</script>

{#if store.connection.sourceX}
  <svg
    width={store.width}
    height={store.height}
    class="svelte-flow__connectionline"
    style={containerStyle}
  >
    <g class={cc(['svelte-flow__connection', store.connection.status])}>
      {#if connectionLine}
        {@render connectionLine()}
      {:else}
        <path d={path} {style} fill="none" class="svelte-flow__connection-path" />
      {/if}
    </g>
  </svg>
{/if}
