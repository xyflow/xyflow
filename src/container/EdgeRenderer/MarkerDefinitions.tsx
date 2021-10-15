import React, { useMemo } from 'react';
import { useStoreState } from '../../store/hooks';
import { EdgeMarker, ArrowHeadType } from '../../types';
import { getMarkerId } from '../../utils/graph';
interface MarkerProps extends EdgeMarker {
  id: string;
}
interface MarkerDefinitionsProps {
  defaultColor: string;
}

type SymbolProps = Omit<MarkerProps, 'id' | 'type'>;

const ArrowSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  );
};

const ArrowClosedSymbol = ({ color = 'none', strokeWidth = 1 }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

const markerSymbols = {
  [ArrowHeadType.Arrow]: ArrowSymbol,
  [ArrowHeadType.ArrowClosed]: ArrowClosedSymbol,
};

const Marker = ({ id, type, color, width = 12.5, height = 12.5, units = 'strokeWidth', strokeWidth }: MarkerProps) => {
  const Symbol = markerSymbols[type];

  return (
    <marker
      className="react-flow__arrowhead"
      id={id}
      markerUnits={units}
      markerWidth={`${width}`}
      markerHeight={`${height}`}
      viewBox="-10 -10 20 20"
      orient="auto"
      refX="0"
      refY="0"
    >
      <Symbol color={color} strokeWidth={strokeWidth} />
    </marker>
  );
};

const MarkerDefinitions = ({ defaultColor }: MarkerDefinitionsProps) => {
  const edges = useStoreState((state) => state.edges);
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
          units={marker.units}
          strokeWidth={marker.strokeWidth}
        />
      ))}
    </defs>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default MarkerDefinitions;
