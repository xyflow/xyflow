// import { memo, useState, useCallback } from 'react';
import cc from 'classcat';
import type { Rect } from '@xyflow/system';

import type { EdgeLabelOptions } from '../../types';
import { Show, mergeProps, splitProps, JSX, createSignal } from 'solid-js';

interface Props extends EdgeLabelOptions, JSX.GSVGAttributes<SVGGElement> {
  x: number;
  y: number;
}

function EdgeTextComponent(_p: Props) {
  const p = mergeProps(
    {
      labelStyle: {},
      labelShowBg: true,
      labelBgStyle: {},
      labelBgPadding: [2, 4],
      labelBgBorderRadius: 2,
    },
    _p
  );

  const [edgeTextBbox, setEdgeTextBbox] = createSignal<Rect>({ x: 1, y: 0, width: 0, height: 0 });

  const edgeTextClasses = () => cc(['react-flow__edge-textwrapper', p.class]);

  const onEdgeTextRefChange = (edgeRef: SVGTextElement) => {
    if (edgeRef === null) return;

    const textBbox = edgeRef.getBBox();

    setEdgeTextBbox({
      x: textBbox.x,
      y: textBbox.y,
      width: textBbox.width,
      height: textBbox.height,
    });
  };


  const [_, rest] = splitProps(p, [
    'label',
    'labelStyle',
    'labelShowBg',
    'labelBgStyle',
    'labelBgPadding',
    'labelBgBorderRadius',
    'children',
    'class',
  ]);

  return (
    <Show when={p.label}>
      {(label) => {
        return (
          <g
            transform={`translate(${p.x - edgeTextBbox().width / 2} ${p.y - edgeTextBbox().height / 2})`}
            class={edgeTextClasses()}
            visibility={edgeTextBbox().width ? 'visible' : 'hidden'}
            {...rest}
          >
            <Show when={p.labelShowBg}>
              <rect
                width={edgeTextBbox().width + 2 * p.labelBgPadding[0]}
                x={-p.labelBgPadding[0]}
                y={-p.labelBgPadding[1]}
                height={edgeTextBbox().height + 2 * p.labelBgPadding[1]}
                class="react-flow__edge-textbg"
                style={p.labelBgStyle}
                rx={p.labelBgBorderRadius}
                ry={p.labelBgBorderRadius}
              />
            </Show>

            <text
              class="react-flow__edge-text"
              y={edgeTextBbox().height / 2}
              dy="0.3em"
              ref={onEdgeTextRefChange}
              style={p.labelStyle}
            >
              {label()}
            </text>
            {p.children}
          </g>
        );
      }}
    </Show>
  );
}

EdgeTextComponent.displayName = 'EdgeText';

export const EdgeText = EdgeTextComponent;
