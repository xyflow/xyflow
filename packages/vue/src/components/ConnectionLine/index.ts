import type { HandleBounds } from '@xyflow/system';
import { ConnectionLineType, ConnectionMode, getBezierPath, getConnectionStatus, getHandlePosition, getMarkerId, getSmoothStepPath, oppositePosition, pointToRendererPoint, Position } from '@xyflow/system';
import { computed, defineComponent, h, inject } from 'vue';
import { storeToRefs, useVueFlow, useVueFlowStore } from '../../composables';
import { Slots } from '../../context';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';

const ConnectionLine = defineComponent({
  name: 'ConnectionLine',
  compatConfig: { MODE: 3 },
  setup() {
    const { id, viewport, getInternalNode } = useVueFlow();

    const { connectionMode, connection, connectionLineOptions } = storeToRefs(useVueFlowStore());

    const connectionLineComponent = inject(Slots)?.['connection-line'];

    const fromNode = computed(() => getInternalNode(connection.value.fromHandle?.nodeId));

    const toNode = computed(() => getInternalNode(connection.value.toHandle?.nodeId) ?? null);

    // the store holds the raw pointer (screen space); convert to flow space for the line + the custom
    // connection-line component. The line END snaps to the hovered handle (below) when there is one.
    const pointer = computed(() => {
      const { pointer: point } = connection.value;
      return point
        ? pointToRendererPoint(point, [viewport.value.x, viewport.value.y, viewport.value.zoom])
        : { x: Number.NaN, y: Number.NaN };
    });

    const markerStart = computed(() =>
      connectionLineOptions.value.markerStart ? `url(#${getMarkerId(connectionLineOptions.value.markerStart, id)})` : '',
    );

    const markerEnd = computed(() =>
      connectionLineOptions.value.markerEnd ? `url(#${getMarkerId(connectionLineOptions.value.markerEnd, id)})` : '',
    );

    return () => {
      const conn = connection.value;

      if (!conn.inProgress || !fromNode.value) {
        return null;
      }

      const connectionStatus = getConnectionStatus(conn.isValid);

      const startHandleId = conn.fromHandle.id;

      const handleType = conn.fromHandle.type;

      const fromHandleBounds = fromNode.value.internals.handleBounds;
      let handleBounds = fromHandleBounds?.[handleType] ?? [];

      if (connectionMode.value === ConnectionMode.Loose) {
        const oppositeBounds = fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'] ?? [];
        handleBounds = [...handleBounds, ...oppositeBounds];
      }

      const fromHandle = (startHandleId ? handleBounds.find(d => d.id === startHandleId) : handleBounds[0]) ?? null;
      const fromPosition = fromHandle?.position ?? Position.Top;
      const { x: fromX, y: fromY } = getHandlePosition(fromNode.value, fromHandle, fromPosition, true);

      let toHandle: HandleBounds | null = null;
      if (toNode.value) {
        // if connection mode is strict, we only look for handles of the opposite type
        if (connectionMode.value === ConnectionMode.Strict) {
          toHandle
            = toNode.value.internals.handleBounds?.[handleType === 'source' ? 'target' : 'source']?.find(
              d => d.id === conn.toHandle?.id,
            ) || null;
        }
        else {
          // if connection mode is loose, look for the handle in both source and target bounds
          toHandle
            = [
              ...(toNode.value.internals.handleBounds?.source ?? []),
              ...(toNode.value.internals.handleBounds?.target ?? []),
            ]?.find(d => d.id === conn.toHandle?.id) || null;
        }
      }

      const toPosition = conn.toHandle?.position ?? (fromPosition ? oppositePosition[fromPosition] : null);

      if (!fromPosition || !toPosition) {
        return null;
      }

      const { x: toX, y: toY }
        = toHandle && toNode.value ? getHandlePosition(toNode.value, toHandle, toPosition, true) : pointer.value;

      const type = connectionLineOptions.value.type ?? ConnectionLineType.Bezier;

      let dAttr = '';

      const pathParams = {
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
      };

      if (type === ConnectionLineType.Bezier) {
        ;[dAttr] = getBezierPath(pathParams);
      }
      else if (type === ConnectionLineType.Step) {
        ;[dAttr] = getSmoothStepPath({
          ...pathParams,
          borderRadius: 0,
        });
      }
      else if (type === ConnectionLineType.SmoothStep) {
        ;[dAttr] = getSmoothStepPath(pathParams);
      }
      else if (type === ConnectionLineType.SimpleBezier) {
        ;[dAttr] = getSimpleBezierPath(pathParams);
      }
      else {
        dAttr = `M${fromX},${fromY} ${toX},${toY}`;
      }

      return h(
        'svg',
        { class: 'vue-flow__edges vue-flow__connectionline vue-flow__container' },
        h(
          'g',
          { class: 'vue-flow__connection' },
          connectionLineComponent
            ? h(connectionLineComponent, {
                fromX,
                fromY,
                fromPosition,
                toX,
                toY,
                toPosition,
                fromNode: fromNode.value,
                fromHandle,
                toNode: toNode.value,
                toHandle,
                markerEnd: markerEnd.value,
                markerStart: markerStart.value,
                connectionStatus,
                pointer: pointer.value,
              })
            : h('path', {
                'd': dAttr,
                'class': [connectionLineOptions.value.class, connectionStatus, 'vue-flow__connection-path'],
                'style': {
                  ...connectionLineOptions.value.style,
                },
                'marker-end': markerEnd.value,
                'marker-start': markerStart.value,
              }),
        ),
      );
    };
  },
});

export default ConnectionLine;
