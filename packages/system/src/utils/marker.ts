import type { EdgeBase, EdgeMarker, EdgeMarkerType, MarkerProps } from '../types';

export function getMarkerId(marker: EdgeMarkerType | undefined, id?: string | null): string {
  if (!marker) {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  const idPrefix = id ? `${id}__` : '';

  return `${idPrefix}${Object.keys(marker)
    .sort()
    .map((key) => `${key}=${marker[key as keyof EdgeMarker]}`)
    .join('&')}`;
}

export function createMarkerIds(
  edges: EdgeBase[],
  {
    id,
    defaultColor,
    defaultMarkerStart,
    defaultMarkerEnd,
  }: {
    id?: string | null;
    defaultColor?: string | null;
    defaultMarkerStart?: EdgeMarkerType;
    defaultMarkerEnd?: EdgeMarkerType;
  }
) {
  const ids = new Set<string>();

  return edges
    .reduce<MarkerProps[]>((markers, edge) => {
      [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
        if (marker && typeof marker === 'object') {
          const markerId = getMarkerId(marker, id);
          if (!ids.has(markerId)) {
            markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
            ids.add(markerId);
          }
        }
      });

      return markers;
    }, [])
    .sort((a, b) => a.id.localeCompare(b.id));
}
