import React, { useMemo } from 'react';

import { useStore } from '../../store';
import { EdgeMarker, ReactFlowState } from '../../types';
import { getMarkerId } from '../../utils/graph';
import { useMarkerSymbol } from './MarkerSymbols';
interface MarkerProps extends EdgeMarker {
  id: string;
}
interface MarkerDefinitionsProps {
  defaultColor: string;
}

const Marker = ({
  id,
  type,
  color,
  width = 12.5,
  height = 12.5,
  markerUnits = 'strokeWidth',
  strokeWidth,
  orient = 'auto',
}: MarkerProps) => {
  const Symbol = useMarkerSymbol(type);

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

const edgesSelector = (s: ReactFlowState) => s.edges;

const MarkerDefinitions = ({ defaultColor }: MarkerDefinitionsProps) => {
  const edges = useStore(edgesSelector);
  const markers = useMemo(() => {
    const ids: string[] = [];

    return edges.reduce<MarkerProps[]>((markers, edge) => {
      [edge.markerStart, edge.markerEnd].forEach((marker) => {
        if (marker && typeof marker === 'object') {
          const markerId = getMarkerId(marker);
          if (!ids.includes(markerId)) {
            markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
            ids.push(markerId);
          }
        }
      });
      return markers.sort((a, b) => a.id.localeCompare(b.id));
    }, []);
  }, [edges, defaultColor]);

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

export default MarkerDefinitions;
