// import { memo, useState, useCallback } from 'react';
import cc from 'classcat';
import type { Rect } from '@xyflow/system';

import type { EdgeTextProps } from '../../types';
import { Show, mergeProps, splitProps, createSignal, createEffect } from 'solid-js';

function EdgeTextComponent(_p: EdgeTextProps) {
  const p = mergeProps(
    {
      labelShowBg: true,
      labelBgPadding: [2, 4],
      labelBgBorderRadius: 2,
    },
    _p
  );

  const [edgeTextBbox, setEdgeTextBbox] = createSignal<Rect>({ x: 1, y: 0, width: 0, height: 0 });
  const edgeTextClasses = () => cc(['react-flow__edge-textwrapper', p.class]);
  let edgeTextRef: SVGTextElement | undefined;

  createEffect(() => {
    if (edgeTextRef) {
      const textBbox = edgeTextRef.getBBox();

      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height,
      });
    }
  });

  const [extractedProps, rest] = splitProps(p, [
    'x',
    'y',
    'label',
    'labelStyle',
    'labelShowBg',
    'labelBgStyle',
    'labelBgPadding',
    'labelBgBorderRadius',
    'children',
    'class',
  ]);

  if (!extractedProps.label) {
    return null;
  }

  return (
    <g
      transform={`translate(${extractedProps.x - edgeTextBbox().width / 2} ${
        extractedProps.y - edgeTextBbox().height / 2
      })`}
      class={edgeTextClasses()}
      visibility={edgeTextBbox().width ? 'visible' : 'hidden'}
      {...rest}
    >
      <Show when={extractedProps.labelShowBg}>
        <rect
          width={edgeTextBbox().width + 2 * extractedProps.labelBgPadding[0]}
          x={-extractedProps.labelBgPadding[0]}
          y={-extractedProps.labelBgPadding[1]}
          height={edgeTextBbox().height + 2 * extractedProps.labelBgPadding[1]}
          class="react-flow__edge-textbg"
          style={extractedProps.labelBgStyle}
          rx={extractedProps.labelBgBorderRadius}
          ry={extractedProps.labelBgBorderRadius}
        />
      </Show>
      <text
        class="react-flow__edge-text"
        y={edgeTextBbox().height / 2}
        dy="0.3em"
        ref={edgeTextRef}
        style={extractedProps.labelStyle}
      >
        {extractedProps.label}
      </text>
      {extractedProps.children}
    </g>
  );
}

EdgeTextComponent.displayName = 'EdgeText';

/**
 * You can use the `<EdgeText />` component as a helper component to display text
 * within your custom edges.
 *
 * @public
 *
 * @example
 * ```jsx
 * import { EdgeText } from '@xyflow/solid';
 *
 * export function CustomEdgeLabel({ label }) {
 *   return (
 *     <EdgeText
 *       x={100}
 *       y={100}
 *       label={label}
 *       labelStyle={{ fill: 'white' }}
 *       labelShowBg
 *       labelBgStyle={{ fill: 'red' }}
 *       labelBgPadding={[2, 4]}
 *       labelBgBorderRadius={2}
 *     />
 *   );
 * }
 *```
 */
export const EdgeText = EdgeTextComponent;
