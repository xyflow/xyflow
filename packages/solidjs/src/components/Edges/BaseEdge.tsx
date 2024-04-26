import { isNumeric } from '@xyflow/system';
import cc from 'classcat';

import { EdgeText } from './EdgeText';
import type { BaseEdgeProps } from '../../types';
import { Show, mergeProps } from 'solid-js';

export function BaseEdge(_p: BaseEdgeProps) {
  const p = mergeProps(
    {
      interactionWidth: 20,
    },
    _p
  );

  const labelCoordinates = () => {
    if (p.label && isNumeric(p.labelX) && isNumeric(p.labelY)) {
      return {
        x: p.labelX,
        y: p.labelY,
      };
    } else {
      null;
    }
  };

  return (
    <>
      <path
        id={p.id}
        style={p.style}
        d={p.path}
        fill="none"
        class={cc(['react-flow__edge-path', p.className])}
        marker-end={p.markerEnd}
        marker-start={p.markerStart}
      />
      <Show when={p.interactionWidth > 0}>
        <path
          d={p.path}
          fill="none"
          stroke-opacity={0}
          stroke-width={p.interactionWidth}
          class="react-flow__edge-interaction"
        />
      </Show>
      <Show when={labelCoordinates()}>
        {(labelCoordinates) => {
          return (
            <EdgeText
              x={labelCoordinates().x}
              y={labelCoordinates().y}
              label={p.label}
              labelStyle={p.labelStyle}
              labelShowBg={p.labelShowBg}
              labelBgStyle={p.labelBgStyle}
              labelBgPadding={p.labelBgPadding}
              labelBgBorderRadius={p.labelBgBorderRadius}
            />
          );
        }}
      </Show>
    </>
  );
}
