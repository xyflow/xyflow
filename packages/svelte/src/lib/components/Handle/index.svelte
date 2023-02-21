<script lang="ts">
	import { getContext } from 'svelte';
  import cc from 'classcat';
	import { type HandleType, Position } from '@reactflow/system';

  export let type: HandleType = 'source';
  export let position: Position = Position.Top;
  export let id: string | null = null;
  
  let className: string | null = null;
  export { className as class };

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
  <slot />
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
    top: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .top {
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
  }

  .left {
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
  }

  .right {
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%);
  }
</style>