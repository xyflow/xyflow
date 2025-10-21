<script lang="ts">
  import { useStore } from '$lib/store';
  import { getEdgeIdContext } from '$lib/store/context';
  import type { Edge } from '$lib/types';
  import { XYHandle, type HandleType, type OnConnectStart } from '@xyflow/system';
  import { EdgeLabel } from '../EdgeLabel';
  import type { EdgeReconnectAnchorProps } from './types';

  let {
    type,
    reconnecting = $bindable(false),
    position,
    class: className,
    size = 25,
    dragThreshold = 1,
    children,
    ...rest
  }: EdgeReconnectAnchorProps = $props();

  const store = useStore();

  const edgeId = getEdgeIdContext(
    'EdgeReconnectAnchor must be used within a Custom Edge component'
  );

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) {
      return;
    }

    const {
      autoPanOnConnect,
      domNode,
      isValidConnection,
      connectionMode,
      connectionRadius,
      onconnectstart,
      onconnectend,
      onreconnect,
      onreconnectstart,
      onreconnectend,
      onbeforereconnect,
      cancelConnection,
      nodeLookup,
      flowId,
      panBy,
      updateConnection,
      edgeLookup
    } = store;

    let edge = edgeLookup.get(edgeId)!;

    const _onConnectStart: OnConnectStart = (evt, params) => {
      reconnecting = true;
      onreconnectstart?.(event, edge, type);
      onconnectstart?.(evt, params);
    };

    const opposite =
      type === 'target'
        ? { nodeId: edge.source, handleId: edge.sourceHandle ?? null, type: 'source' as HandleType }
        : {
            nodeId: edge.target,
            handleId: edge.targetHandle ?? null,
            type: 'target' as HandleType
          };

    XYHandle.onPointerDown(event, {
      autoPanOnConnect,
      connectionMode,
      connectionRadius,
      domNode,
      handleId: opposite.handleId,
      nodeId: opposite.nodeId,
      nodeLookup,
      isTarget: opposite.type === 'target',
      edgeUpdaterType: opposite.type,
      lib: 'svelte',
      flowId,
      cancelConnection,
      panBy,
      isValidConnection,
      onConnectStart: _onConnectStart,
      onConnectEnd: onconnectend,
      onConnect: (connection) => {
        const reconnectedEdge = { ...edge, ...connection };
        const newEdge = onbeforereconnect
          ? onbeforereconnect(reconnectedEdge, edge)
          : reconnectedEdge;

        if (!newEdge) {
          return;
        }

        store.edges = store.edges.map((e) => (e.id === edge.id ? (newEdge as Edge) : e));
        onreconnect?.(edge, connection);
      },
      onReconnectEnd: (event, connectionState) => {
        reconnecting = false;
        onreconnectend?.(event, edge, opposite.type, connectionState);
      },
      updateConnection,
      getTransform: () => [store.viewport.x, store.viewport.y, store.viewport.zoom],
      getFromHandle: () => store.connection.fromHandle,
      dragThreshold: dragThreshold ?? store.connectionDragThreshold,
      handleDomNode: event.currentTarget as HTMLElement
    });
  };
</script>

<EdgeLabel
  x={position?.x}
  y={position?.y}
  width={size}
  height={size}
  class={[
    'svelte-flow__edgeupdater',
    `svelte-flow__edgeupdater-${type}`,
    store.noPanClass,
    className
  ]}
  onpointerdown={onPointerDown}
  transparent
  {...rest}
>
  {#if !reconnecting && children}
    {@render children()}
  {/if}
</EdgeLabel>
