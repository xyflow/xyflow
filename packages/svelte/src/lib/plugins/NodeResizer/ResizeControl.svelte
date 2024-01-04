<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { drag } from 'd3-drag';
  import { select } from 'd3-selection';
  import cc from 'classcat';
  import type { ResizeControlProps, ResizeDragEvent } from './types';
  import {
    ResizeControlVariant,
    getPointerPosition,
    clamp,
    getResizeDirection
  } from '@xyflow/system';
  import { useStore } from '$lib/store';

  type $$Props = ResizeControlProps;

  export let nodeId: $$Props['nodeId'] = undefined;
  export let position: $$Props['position'] = undefined;
  export let variant: $$Props['variant'] = ResizeControlVariant.Handle;
  export let color: $$Props['color'] = undefined;
  export let minWidth: $$Props['minWidth'] = 10;
  $: _minWidth = minWidth ?? 10;
  export let minHeight: $$Props['minHeight'] = 10;
  $: _minHeight = minHeight ?? 10;
  export let maxWidth: $$Props['maxWidth'] = Number.MAX_VALUE;
  $: _maxWidth = maxWidth ?? Number.MAX_VALUE;
  export let maxHeight: $$Props['maxHeight'] = Number.MAX_VALUE;
  $: _maxHeight = maxHeight ?? Number.MAX_VALUE;
  export let keepAspectRatio: $$Props['keepAspectRatio'] = false;
  export let shouldResize: $$Props['shouldResize'] = undefined;
  export let onResizeStart: $$Props['onResizeStart'] = undefined;
  export let onResize: $$Props['onResize'] = undefined;
  export let onResizeEnd: $$Props['onResizeEnd'] = undefined;
  export let style: $$Props['style'] = '';
  let className: $$Props['class'] = '';
  export { className as class };

  const initPrevValues = { width: 0, height: 0, x: 0, y: 0 };

  const initStartValues = {
    ...initPrevValues,
    pointerX: 0,
    pointerY: 0,
    aspectRatio: 1
  };

  const { nodeLookup, snapGrid, viewport, nodes } = useStore();
  const contextNodeId = getContext<string>('svelteflow__node_id');
  $: id = typeof nodeId === 'string' ? nodeId : contextNodeId;
  let resizeControlRef: HTMLDivElement;

  let startValues = { ...initStartValues };
  let prevValues = { ...initPrevValues };

  $: defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  $: controlPosition = position ?? defaultPosition;

  $: positionClassNames = controlPosition.split('-');
  $: colorStyleProp = variant === ResizeControlVariant.Line ? 'border-color' : 'background-color';

  $: _style = style ?? '';
  $: controlStyle = !!color ? `${_style} ${colorStyleProp}: ${color};` : _style;

  onMount(() => {
    if (!resizeControlRef || !id) {
      return;
    }
    const selection = select(resizeControlRef);

    const enableX = controlPosition.includes('right') || controlPosition.includes('left');
    const enableY = controlPosition.includes('bottom') || controlPosition.includes('top');
    const invertX = controlPosition.includes('left');
    const invertY = controlPosition.includes('top');

    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = $nodeLookup.get(id);
        const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, {
          transform: [$viewport.x, $viewport.y, $viewport.zoom],
          snapGrid: $snapGrid ?? undefined,
          snapToGrid: !!$snapGrid
        });

        prevValues = {
          width: node?.computed?.width ?? 0,
          height: node?.computed?.height ?? 0,
          x: node?.position.x ?? 0,
          y: node?.position.y ?? 0
        };

        startValues = {
          ...prevValues,
          pointerX: xSnapped,
          pointerY: ySnapped,
          aspectRatio: prevValues.width / prevValues.height
        };

        onResizeStart?.(event, { ...prevValues });
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, {
          transform: [$viewport.x, $viewport.y, $viewport.zoom],
          snapGrid: $snapGrid ?? undefined,
          snapToGrid: !!$snapGrid
        });
        const node = $nodeLookup.get(id);

        if (node) {
          const {
            pointerX: startX,
            pointerY: startY,
            width: startWidth,
            height: startHeight,
            x: startNodeX,
            y: startNodeY,
            aspectRatio
          } = startValues;

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;

          const distX = Math.floor(enableX ? xSnapped - startX : 0);
          const distY = Math.floor(enableY ? ySnapped - startY : 0);

          let width = clamp(startWidth + (invertX ? -distX : distX), minWidth, maxWidth);
          let height = clamp(startHeight + (invertY ? -distY : distY), minHeight, maxHeight);

          if (keepAspectRatio) {
            const nextAspectRatio = width / height;
            const isDiagonal = enableX && enableY;
            const isHorizontal = enableX && !enableY;
            const isVertical = enableY && !enableX;

            width =
              (nextAspectRatio <= aspectRatio && isDiagonal) || isVertical
                ? height * aspectRatio
                : width;
            height =
              (nextAspectRatio > aspectRatio && isDiagonal) || isHorizontal
                ? width / aspectRatio
                : height;

            if (width >= _maxWidth) {
              width = _maxWidth;
              height = _maxWidth / aspectRatio;
            } else if (width <= _minWidth) {
              width = _minWidth;
              height = _minWidth / aspectRatio;
            }

            if (height >= _maxHeight) {
              height = _maxHeight;
              width = _maxHeight * aspectRatio;
            } else if (height <= _minHeight) {
              height = _minHeight;
              width = _minHeight * aspectRatio;
            }
          }

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          let changes = false;

          if (invertX || invertY) {
            const x = invertX ? startNodeX - (width - startWidth) : startNodeX;
            const y = invertY ? startNodeY - (height - startHeight) : startNodeY;

            // only transform the node if the width or height changes
            const isXPosChange = x !== prevX && isWidthChange;
            const isYPosChange = y !== prevY && isHeightChange;

            if (isXPosChange || isYPosChange) {
              let newX = isXPosChange ? x : prevX;
              let newY = isYPosChange ? y : prevY;

              node.position = { x: newX, y: newY };
              prevValues.x = newX;
              prevValues.y = newY;

              changes = true;
            }
          }

          if (isWidthChange || isHeightChange) {
            node.width = width;
            node.height = height;
            prevValues.width = width;
            prevValues.height = height;

            changes = true;
          }

          if (!changes) {
            return;
          }

          const direction = getResizeDirection({
            width: prevValues.width,
            prevWidth,
            height: prevValues.height,
            prevHeight,
            invertX,
            invertY
          });

          const nextValues = { ...prevValues, direction };

          const callResize = shouldResize?.(event, nextValues);

          if (callResize === false) {
            return;
          }

          onResize?.(event, nextValues);

          $nodes = $nodes;
        }
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  });
</script>

<div
  class={cc(['svelte-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
  bind:this={resizeControlRef}
  style={controlStyle}
>
  <slot />
</div>
