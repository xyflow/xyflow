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

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      XYHandle.onPointerDown(event, {
        handleId,
        nodeId,
        isTarget,
        connectionRadius: store.connectionRadius,
        domNode: store.domNode,
        nodeLookup: store.nodeLookup,
        connectionMode: store.connectionMode,
        lib: 'svelte',
        autoPanOnConnect: store.autoPanOnConnect,
        flowId: store.flowId,
        isValidConnection: store.isValidConnection,
        updateConnection: store.updateConnection,
        cancelConnection: store.cancelConnection,
        panBy: store.panBy,
        onConnect: (connection) => {
          const edge = store.onedgecreate ? store.onedgecreate(connection) : connection;

          if (!edge) {
            return;
          }

          store.addEdge(edge);
          store.onconnect?.(connection);
        },
        onConnectStart: (event, startParams) => {
          store.onconnectstart?.(event, {
            nodeId: startParams.nodeId,
            handleId: startParams.handleId,
            handleType: startParams.handleType
          });
        },
        onConnectEnd: (event) => {
          store.onconnectend?.(event);
        },
        getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
        getConnectionStartHandle: () => store.connection.startHandle
      });
    }
  }

  let prevConnections: Map<string, HandleConnection> | null = null;
  let connections: Map<string, HandleConnection> | undefined;

  // TODO: this should be rewritten
  $effect.pre(() => {
    if (onconnect || ondisconnect) {
      // connectionLookup is not reactive, so we use edges to get notified about updates
      store.edges;
      connections = store.connectionLookup.get(`${nodeId}-${type}-${id || null}`);
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

  let connectionInProcess = $derived(!!store.connection.startHandle);
  let connectingFrom = $derived(
    store.connection.startHandle?.nodeId === nodeId &&
      store.connection.startHandle?.type === type &&
      store.connection.startHandle?.handleId === handleId
  );
  let connectingTo = $derived(
    store.connection.endHandle?.nodeId === nodeId &&
      store.connection.endHandle?.type === type &&
      store.connection.endHandle?.handleId === handleId
  );
  let isPossibleEndHandle = $derived(
    store.connectionMode === ConnectionMode.Strict
      ? store.connection.startHandle?.type !== type
      : nodeId !== store.connection.startHandle?.nodeId ||
          handleId !== store.connection.startHandle?.handleId
  );
  let valid = $derived(connectingTo && store.connection.status === 'valid');
</script>

<!--
@component
The Handle component is the part of a node that can be used to connect nodes.
-->
<div
  data-handleid={handleId}
  data-nodeid={nodeId}
  data-handlepos={position}
  data-id="{store.flowId}-{nodeId}-{handleId}-{type}"
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
