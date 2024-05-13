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
  import type { HandleProps } from '$lib/types';

  let {
    id: handleId,
    type = 'source',
    position = Position.Top,
    style,
    class: className,
    isConnectable: isConnectableProp,
    isValidConnection: isValidConnectionProp,
    onconnect,
    ondisconnect,
    children
  }: HandleProps = $props();

  const store = useStore();

  const nodeId = getContext<string>('svelteflow__node_id');
  // TODO: can writables be replaced here?
  const isConnectableContext = getContext<Writable<boolean>>('svelteflow__node_connectable');

  let isConnectable = $derived(
    isConnectableProp !== undefined ? isConnectableProp : $isConnectableContext
  );
  let isTarget = $derived(type === 'target');

  function onPointerDown(event: MouseEvent | TouchEvent) {
    const isMouseTriggered = isMouseEvent(event);

    if ((isMouseTriggered && event.button === 0) || !isMouseTriggered) {
      XYHandle.onPointerDown(event, {
        handleId: handleId ?? null,
        nodeId,
        isTarget,
        connectionRadius: store.connectionRadius,
        domNode: store.domNode,
        nodeLookup: store.nodeLookup,
        connectionMode: store.connectionMode,
        lib: 'svelte',
        autoPanOnConnect: store.autoPanOnConnect,
        flowId: store.flowId,
        isValidConnection: isValidConnectionProp ?? store.isValidConnection,
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

  // TODO: why does this not work
  // let stopTrackingConnection: (() => void) | null = null;

  // $effect.pre(() => {
  //   if (!stopTrackingConnection && (onconnect || ondisconnect)) {
  //     stopTrackingConnection = $effect.root(() => {
  //       connections = store.connectionLookup.get(`${nodeId}-${type}-${handleId}`);
  //       connections?.size;
  //       console.log('OJ THIS IS WHAT WE NEED', `${nodeId}-${type}-${handleId}`, connections?.size);

  //       if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
  //         const _connections = connections ?? new Map();

  //         handleConnectionChange(prevConnections, _connections, ondisconnect);
  //         handleConnectionChange(_connections, prevConnections, onconnect);
  //       }

  //       prevConnections = connections ?? new Map();
  //       return () => {
  //         console.log('stopped tracking connection');
  //       };
  //     });
  //   } else if (stopTrackingConnection && !onconnect && !ondisconnect) {
  //     stopTrackingConnection();
  //     stopTrackingConnection = null;
  //   }
  // });
  // onDestroy(() => {
  //   if (stopTrackingConnection) stopTrackingConnection();
  // });

  $effect.pre(() => {
    if (onconnect || ondisconnect) {
      let connections = store.connectionLookup.get(`${nodeId}-${type}-${handleId}`);

      if (prevConnections && !areConnectionMapsEqual(connections, prevConnections)) {
        const _connections = connections ?? new Map();

        handleConnectionChange(prevConnections, _connections, ondisconnect);
        handleConnectionChange(_connections, prevConnections, onconnect);
      }

      prevConnections = new Map(connections);
    }
  });

  let [connectionInProcess, connectingFrom, connectingTo, isPossibleEndHandle, valid] = $derived.by(
    () => {
      const connectionInProcess = !!store.connection.startHandle;

      const connectingFrom =
        store.connection.startHandle?.nodeId === nodeId &&
        store.connection.startHandle?.type === type &&
        store.connection.startHandle?.handleId === handleId;

      const connectingTo =
        store.connection.endHandle?.nodeId === nodeId &&
        store.connection.endHandle?.type === type &&
        store.connection.endHandle?.handleId === handleId;

      const isPossibleEndHandle =
        store.connectionMode === ConnectionMode.Strict
          ? store.connection.startHandle?.type !== type
          : nodeId !== store.connection.startHandle?.nodeId ||
            handleId !== store.connection.startHandle?.handleId;

      const valid = connectingTo && store.connection.status === 'valid';

      return [connectionInProcess, connectingFrom, connectingTo, isPossibleEndHandle, valid];
    }
  );
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
