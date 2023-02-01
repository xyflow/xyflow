<script lang="ts">
	import { getContext } from 'svelte';
  import cc from 'classcat';
	import { type HandleType, Position } from '@reactflow/core';

  export let type: HandleType = 'source';
  export let position: Position = Position.Top;
  export let id: string | null = null;
  export let className: string | null = null;;

  const isTarget = type === 'target';
  const nodeId = getContext('rf_nodeid');
</script>


<div
  data-handleid={id}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id={`${nodeId}-${id}-${type}`}
  class={cc([
    'react-flow__handle',
    `react-flow__handle-${position}`,
    'nodrag',
    className,
    position
  ])}
  class:source={!isTarget}
  class:target={isTarget}
  >
  <slot></slot>
</div>


<style>
  .react-flow__handle {
    position: absolute;
    pointer-events: none;
    min-width: 5px;
    min-height: 5px;
    width: 6px;
    height: 6px;
    background: #1a192b;
    border: 1px solid white;
    border-radius: 100%;
  }

  .bottom {
    top: auto;
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 0);
  }

  .top {
    left: 50%;
    top: -4px;
    transform: translate(-50%, 0);
  }

  .left {
    top: 50%;
    left: -4px;
    transform: translate(0, -50%);
  }

  .right {
    right: -4px;
    top: 50%;
    transform: translate(0, -50%);
  }
</style>