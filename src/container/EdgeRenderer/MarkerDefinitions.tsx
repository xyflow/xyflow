import React, { useMemo } from 'react';
import { useStoreState } from '../../store/hooks';
import { EdgeMarker, ArrowHeadType } from '../../types';
import { getMarkerId } from '../../utils/graph';
interface MarkerProps {
  id: string;
  type: ArrowHeadType;
  color: string;
}
interface MarkerDefinitionsProps {
  defaultColor: string;
}

interface SymbolProps {
  color: string;
}

interface EdgeMarkerExtended extends EdgeMarker {
  id: string;
}

const ArrowSymbol = ({ color }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

const ArrowClosedSymbol = ({ color }: SymbolProps) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

const markerSymbols = {
  [ArrowHeadType.Arrow]: ArrowSymbol,
  [ArrowHeadType.ArrowClosed]: ArrowClosedSymbol,
};

const Marker = ({ id, type, color }: MarkerProps) => {
  const Symbol = markerSymbols[type];

  return (
    <marker
      className="react-flow__arrowhead"
      id={id}
      markerWidth="12.5"
      markerHeight="12.5"
      viewBox="-10 -10 20 20"
      orient="auto"
      refX="0"
      refY="0"
    >
      <Symbol color={color} />
    </marker>
  );
};

const MarkerDefinitions = ({ defaultColor }: MarkerDefinitionsProps) => {
  const edges = useStoreState((state) => state.edges);
  const markers = useMemo(() => {
    const ids: string[] = [];

    return edges.reduce<EdgeMarkerExtended[]>((markers, edge) => {
      [edge.markerStart, edge.markerEnd].forEach((marker) => {
        if (marker && typeof marker === 'object') {
          const markerId = getMarkerId(marker);
          if (!ids.includes(markerId)) {
            markers.push({ id: markerId, ...marker });
            ids.push(markerId);
          }
        }
      });
      return markers.sort((a, b) => a.id.localeCompare(b.id));
    }, []);
  }, [edges]);

  return (
    <defs>
      {markers.map((marker: EdgeMarkerExtended) => (
        <Marker id={marker.id} key={marker.id} type={marker.type} color={marker.color || defaultColor} />
      ))}
    </defs>
  );
};

MarkerDefinitions.displayName = 'MarkerDefinitions';

export default MarkerDefinitions;
