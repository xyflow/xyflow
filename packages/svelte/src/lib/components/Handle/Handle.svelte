<script lang="ts">
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import cc from 'classcat';
  import {
    Position,
    XYHandle,
    isMouseEvent,
    type HandleConnection,
    areConnectionMapsEqual,
    handleConnectionChange,
    ConnectionMode
  } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import type { HandleComponentProps } from '$lib/types';

  let {
    id,
    type = 'source',
    position = Position.Top,
    style,
    class: className,
    isConnectable: isConnectableProp,
    onconnect,
    ondisconnect,
    children
  }: HandleComponentProps = $props();

  const nodeId = getContext<string>('svelteflow__node_id');
  const isConnectableContext = getContext<Writable<boolean>>('svelteflow__node_connectable');

  const handleId = id || null;

  let isConnectable = $derived(
    isConnectableProp !== undefined ? isConnectableProp : $isConnectableContext
  );
  let isTarget = $derived(type === 'target');

  const store = useStore();
  const {
    connectionMode,
    domNode,
    nodeLookup,
    connectionRadius,
    viewport,
    isValidConnection,
    lib,
    addEdge,
    onedgecreate,
    panBy,
    cancelConnection,
    updateConnection,
    autoPanOnConnect,
    edges,
    connectionLookup,
    onconnect: onConnectAction,
    onconnectstart: onConnectStartAction,
    onconnectend: onConnectEndAction,
    flowId,
    connection
  } = store;

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      XYHandle.onPointerDown(event, {
        handleId,
        nodeId,
        isTarget,
        connectionRadius: $connectionRadius,
        domNode: $domNode,
        nodeLookup: $nodeLookup,
        connectionMode: $connectionMode,
        lib: $lib,
        autoPanOnConnect: $autoPanOnConnect,
        flowId: $flowId,
        isValidConnection: $isValidConnection,
        updateConnection,
        cancelConnection,
        panBy,
        onConnect: (connection) => {
          const edge = $onedgecreate ? $onedgecreate(connection) : connection;

          if (!edge) {
            return;
          }

          addEdge(edge);
          $onConnectAction?.(connection);
        },
        onConnectStart: (event, startParams) => {
          $onConnectStartAction?.(event, {
            nodeId: startParams.nodeId,
            handleId: startParams.handleId,
            handleType: startParams.handleType
          });
        },
        onConnectEnd: (event) => {
          $onConnectEndAction?.(event);
        },
        getTransform: () => [$viewport.x, $viewport.y, $viewport.zoom],
        getConnectionStartHandle: () => $connection.startHandle
      });
    }
  }

  let prevConnections: Map<string, HandleConnection> | null = null;
  let connections: Map<string, HandleConnection> | undefined;

  // TODO: this should be rewritten
  $effect.pre(() => {
    if (onconnect || ondisconnect) {
      // connectionLookup is not reactive, so we use edges to get notified about updates
      $edges;
      connections = $connectionLookup.get(`${nodeId}-${type}-${id || null}`);
    }
  });

  $effect.pre(() => {
    if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
      const _connections = connections ?? new Map();

      handleConnectionChange(prevConnections, _connections, ondisconnect);
      handleConnectionChange(_connections, prevConnections, onconnect);
    }

    prevConnections = connections ?? new Map();
  });

  let connectionInProcess = $derived(!!$connection.startHandle);
  let connectingFrom = $derived(
    $connection.startHandle?.nodeId === nodeId &&
      $connection.startHandle?.type === type &&
      $connection.startHandle?.handleId === handleId
  );
  let connectingTo = $derived(
    $connection.endHandle?.nodeId === nodeId &&
      $connection.endHandle?.type === type &&
      $connection.endHandle?.handleId === handleId
  );
  let isPossibleEndHandle = $derived(
    $connectionMode === ConnectionMode.Strict
      ? $connection.startHandle?.type !== type
      : nodeId !== $connection.startHandle?.nodeId || handleId !== $connection.startHandle?.handleId
  );
  let valid = $derived(connectingTo && $connection.status === 'valid');
</script>

<!--
@component
The Handle component is the part of a node that can be used to connect nodes.
-->
<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{$flowId}-{nodeId}-{handleId}-{type}"
  class={cc([
    'svelte-flow__handle',
    `svelte-flow__handle-${position}`,
    'nodrag',
    'nopan',
    position,
    className
  ])}
  class:valid
  class:connectingto={connectingTo}
  class:connectingfrom={connectingFrom}
  class:source={!isTarget}
  class:target={isTarget}
  class:connectablestart={isConnectable}
  class:connectableend={isConnectable}
  class:connectable={isConnectable}
  class:connectionindicator={isConnectable && (!connectionInProcess || isPossibleEndHandle)}
  onmousedown={onPointerDown}
  ontouchstart={onPointerDown}
  {style}
  role="button"
  tabindex="-1"
>
  {#if children}
    {@render children()}
  {/if}
</div>
