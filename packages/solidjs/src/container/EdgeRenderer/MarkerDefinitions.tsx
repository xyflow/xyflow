// import { memo, useMemo } from 'react';
import { type MarkerProps, createMarkerIds } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import { useMarkerSymbol } from './MarkerSymbols';
import { For, Show, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type MarkerDefinitionsProps = {
  defaultColor: string;
  rfId?: string;
};

const Marker = (_p: MarkerProps) => {
  //   id,
  //   type,
  //   color,
  //   width = 12.5,
  //   height = 12.5,
  //   markerUnits = 'strokeWidth',
  //   strokeWidth,
  //   orient = 'auto-start-reverse',
  // }: MarkerProps) => {
  const p = mergeProps({ width: 12.5, height: 12.5, markerUnits: 'strokeWidth', orient: 'auto-start-reverse' }, _p);

  const SymbolComp = useMarkerSymbol(() => p.type);

  // if (!symbol) {
  //   return null;
  // }

  return (
    <Show when={SymbolComp()}>
      {(symbol) => {
        return (
          <marker
            class="react-flow__arrowhead"
            id={p.id}
            markerWidth={`${p.width}`}
            markerHeight={`${p.height}`}
            viewBox="-10 -10 20 20"
            // eslint-disable-next-line
            markerUnits={p.markerUnits as any}
            orient={p.orient}
            refX="0"
            refY="0"
          >
            <Dynamic component={symbol()} color={p.color} strokeWidth={p.strokeWidth} />
          </marker>
        );
      }}
    </Show>
  );
};

// when you have multiple flows on a page and you hide the first one, the other ones have no markers anymore
// when they do have markers with the same ids. To prevent this the user can pass a unique id to the react flow wrapper
// that we can then use for creating our unique marker ids
const MarkerDefinitions = (p: MarkerDefinitionsProps) => {
  const edges = useStore((s) => s.edges);
  const defaultEdgeOptions = useStore((s) => () => s.defaultEdgeOptions);

  const markers = () => {
    return createMarkerIds(edges.get(), {
      id: p.rfId,
      defaultColor: p.defaultColor,
      defaultMarkerStart: defaultEdgeOptions()?.markerStart,
      defaultMarkerEnd: defaultEdgeOptions()?.markerEnd,
    });
  };

  return (
    <Show when={markers().length > 0}>
      <svg class="react-flow__marker">
        <defs>
          <For each={markers()}>
            {(marker) => {
              return (
                <Marker
                  id={marker.id}
                  // key={marker.id}
                  type={marker.type}
                  color={marker.color}
                  width={marker.width}
                  height={marker.height}
                  markerUnits={marker.markerUnits}
                  strokeWidth={marker.strokeWidth}
                  orient={marker.orient}
                />
              );
            }}
          </For>
        </defs>
      </svg>
    </Show>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default MarkerDefinitions;
