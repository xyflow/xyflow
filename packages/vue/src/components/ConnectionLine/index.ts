import type { HandleElement } from '../../types';
import { ConnectionLineType, ConnectionMode, getBezierPath, getHandlePosition, getMarkerId, getSmoothStepPath, oppositePosition, Position } from '@xyflow/system';
import { computed, defineComponent, h, inject } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import { Slots } from '../../context';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';

const ConnectionLine = defineComponent({
  name: 'ConnectionLine',
  compatConfig: { MODE: 3 },
  setup() {
    const { id, viewport, getInternalNode } = useVueFlow();

    const {
      connectionMode,
      connectionStartHandle,
      connectionEndHandle,
      connectionPosition,
      connectionLineOptions,
      connectionStatus,
    } = storeToRefs(useStore());

    const connectionLineComponent = inject(Slots)?.['connection-line'];

    const fromNode = computed(() => getInternalNode(connectionStartHandle.value?.nodeId));

    const toNode = computed(() => getInternalNode(connectionEndHandle.value?.nodeId) ?? null);

    // `connectionPosition` holds the raw pointer (screen space); convert to flow space for the line + the
    // custom connection-line component. The line END snaps to the hovered handle (below) when there is one.
    const pointer = computed(() => {
      return {
        x: (connectionPosition.value.x - viewport.value.x) / viewport.value.zoom,
        y: (connectionPosition.value.y - viewport.value.y) / viewport.value.zoom,
      };
    });

    const markerStart = computed(() =>
      connectionLineOptions.value.markerStart ? `url(#${getMarkerId(connectionLineOptions.value.markerStart, id)})` : '',
    );

    const markerEnd = computed(() =>
      connectionLineOptions.value.markerEnd ? `url(#${getMarkerId(connectionLineOptions.value.markerEnd, id)})` : '',
    );

    return () => {
      if (!fromNode.value || !connectionStartHandle.value) {
        return null;
      }

      const startHandleId = connectionStartHandle.value.id;

      const handleType = connectionStartHandle.value.type;

      const fromHandleBounds = fromNode.value.internals.handleBounds;
      let handleBounds = fromHandleBounds?.[handleType] ?? [];

      if (connectionMode.value === ConnectionMode.Loose) {
        const oppositeBounds = fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'] ?? [];
        handleBounds = [...handleBounds, ...oppositeBounds];
      }

      const fromHandle = (startHandleId ? handleBounds.find(d => d.id === startHandleId) : handleBounds[0]) ?? null;
      const fromPosition = fromHandle?.position ?? Position.Top;
      const { x: fromX, y: fromY } = getHandlePosition(fromNode.value, fromHandle, fromPosition);

      let toHandle: HandleElement | null = null;
      if (toNode.value) {
        // if connection mode is strict, we only look for handles of the opposite type
        if (connectionMode.value === ConnectionMode.Strict) {
          toHandle
            = toNode.value.internals.handleBounds?.[handleType === 'source' ? 'target' : 'source']?.find(
              d => d.id === connectionEndHandle.value?.id,
            ) || null;
        }
        else {
          // if connection mode is loose, look for the handle in both source and target bounds
          toHandle
            = [
              ...(toNode.value.internals.handleBounds?.source ?? []),
              ...(toNode.value.internals.handleBounds?.target ?? []),
            ]?.find(d => d.id === connectionEndHandle.value?.id) || null;
        }
      }

      const toPosition = connectionEndHandle.value?.position ?? (fromPosition ? oppositePosition[fromPosition] : null);

      if (!fromPosition || !toPosition) {
        return null;
      }

      // snap the line end to the hovered handle when there is one; otherwise follow the raw pointer
      const { x: toX, y: toY }
        = toHandle && toNode.value ? getHandlePosition(toNode.value, toHandle, toPosition) : pointer.value;

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
                connectionStatus: connectionStatus.value,
                pointer: pointer.value,
              })
            : h('path', {
                'd': dAttr,
                'class': [connectionLineOptions.value.class, connectionStatus.value, 'vue-flow__connection-path'],
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
