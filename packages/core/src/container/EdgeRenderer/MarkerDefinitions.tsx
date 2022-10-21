import { memo, useCallback } from 'react';

import { useStore } from '../../hooks/useStore';
import { getMarkerId } from '../../utils/graph';
import { useMarkerSymbol } from './MarkerSymbols';
import type { EdgeMarker, ReactFlowState } from '../../types';

type MarkerProps = EdgeMarker & {
  id: string;
};

type MarkerDefinitionsProps = {
  defaultColor: string;
  rfId?: string;
};

const Marker = ({
  id,
  type,
  color,
  width = 12.5,
  height = 12.5,
  markerUnits = 'strokeWidth',
  strokeWidth,
  orient = 'auto-start-reverse',
}: MarkerProps) => {
  const Symbol = useMarkerSymbol(type);

  if (!Symbol) {
    return null;
  }

  return (
    <marker
      className="react-flow__arrowhead"
      id={id}
      markerWidth={`${width}`}
      markerHeight={`${height}`}
      viewBox="-10 -10 20 20"
      markerUnits={markerUnits}
      orient={orient}
      refX="0"
      refY="0"
    >
      <Symbol color={color} strokeWidth={strokeWidth} />
    </marker>
  );
};

const markerSelector =
  ({ defaultColor, rfId }: { defaultColor: string; rfId?: string }) =>
  (s: ReactFlowState) => {
    const ids: string[] = [];

    return s.edges
      .reduce<MarkerProps[]>((markers, edge) => {
        [edge.markerStart, edge.markerEnd].forEach((marker) => {
          if (marker && typeof marker === 'object') {
            const markerId = getMarkerId(marker, rfId);
            if (!ids.includes(markerId)) {
              markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
              ids.push(markerId);
            }
          }
        });
        return markers;
      }, [])
      .sort((a, b) => a.id.localeCompare(b.id));
  };

// when you have multiple flows on a page and you hide the first one, the other ones have no markers anymore
// when they do have markers with the same ids. To prevent this the user can pass a unique id to the react flow wrapper
// that we can then use for creating our unique marker ids
const MarkerDefinitions = ({ defaultColor, rfId }: MarkerDefinitionsProps) => {
  const markers = useStore(
    useCallback(markerSelector({ defaultColor, rfId }), [defaultColor, rfId]),
    // the id includes all marker options, so we just need to look at that part of the marker
    (a, b) => !(a.length !== b.length || a.some((m, i) => m.id !== b[i].id))
  );

  return (
    <defs>
      {markers.map((marker: MarkerProps) => (
        <Marker
          id={marker.id}
          key={marker.id}
          type={marker.type}
          color={marker.color}
          width={marker.width}
          height={marker.height}
          markerUnits={marker.markerUnits}
          strokeWidth={marker.strokeWidth}
          orient={marker.orient}
        />
      ))}
    </defs>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default memo(MarkerDefinitions);
