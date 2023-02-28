<script lang="ts">
	import { getContext } from 'svelte';
  import cc from 'classcat';
	import {  Position, type Connection, type HandleProps } from '@reactflow/system';
	import { isMouseEvent } from '@reactflow/utils';

	import { handlePointerDown } from './handler';
	import { useStore } from '$lib/store';

  type $$Props = HandleProps;

  export let type: $$Props['type'] = 'source';
  export let position: $$Props['position'] = Position.Top;
  export let id: $$Props['id'] = undefined;
  export let isConnectable: $$Props['isConnectable'] = true;
  export let isValidConnection: $$Props['isValidConnection'] = (_: Connection) => true;
  let className: string | null = null;
  export { className as class };

  const isTarget = type === 'target';
  const nodeId = getContext<string>('rf_nodeid');
  const handleId = id || null;

  const {
    connectionMode,
    domNode,
    nodes,
    connectionRadius,
    transform,
    addEdge,
    panBy,
    cancelConnection,
    updateConnection
  } = useStore();

  function onConnectExtended(params: Connection) {
      addEdge(params);
      // @todo add props
      // onConnectAction?.(edgeParams);
      // onConnect?.(edgeParams);
    };

  function onPointerDown(event: MouseEvent | TouchEvent)  {
      const isMouseTriggered = isMouseEvent(event);

      if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
        handlePointerDown({
          event,
          handleId,
          nodeId,
          isTarget,
          connectionRadius: $connectionRadius,
          domNode: $domNode,
          nodes: $nodes,
          connectionMode: $connectionMode,
          transform,
          isValidConnection: isValidConnection!,
          onConnect: onConnectExtended,
          updateConnection,
          cancelConnection,
          panBy,
        });
      }

      // if (isMouseTriggered) {
      //   onMouseDown?.(event);
      // } else {
      //   onTouchStart?.(event);
      // }
    };
</script>

<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id={`${nodeId}-${id}-${type}`}
  class={cc([
    'react-flow__handle',
    `react-flow__handle-${position}`,
    'nodrag',
    'nopan',
    className,
    position
  ])}
  class:source={!isTarget}
  class:target={isTarget}
  class:connectable={isConnectable}
  on:mousedown={onPointerDown}
  on:touchstart={onPointerDown}
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

  .connectable {
    pointer-events: all;
    cursor: crosshair;
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